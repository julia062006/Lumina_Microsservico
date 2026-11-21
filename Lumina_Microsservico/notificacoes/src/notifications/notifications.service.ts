import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LivroCadastradoEvent } from '../events/dto/livro-cadastrado.event';
import { HttpService } from '../http/http.service';
import { MailService } from './mail.service';
import { novoLivroTemplate } from './templates/novo-livro.template';
import { NotificacoesRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly MAX_TENTATIVAS = 2;

  constructor(
    private readonly repo: NotificacoesRepository,
    private readonly http: HttpService,
    private readonly mail: MailService,
    private readonly cfg: ConfigService,
  ) { }

  private async getCapa(arquivo?: string): Promise<Buffer | null> {
    if (!arquivo) return null;
    try {
      const { data } = await this.http.instance.get(`/uploads/${arquivo}`, {
        responseType: 'arraybuffer',
      });
      this.logger.log(`[HTTP] Capa "${arquivo}" obtida do backend`);
      return Buffer.from(data);
    } catch (err) {
      this.logger.warn(`[HTTP] Não foi possível obter a capa "${arquivo}": ${(err as Error).message}`);
      return null;
    }
  }

  private async enviarComRetry(
    destinatario: string,
    titulo: string,
    html: string,
    anexos: { filename: string; content: Buffer; cid: string }[] | undefined,
  ): Promise<{ ok: boolean; erro?: string }> {
    let ultimoErro = '';

    for (let tentativa = 1; tentativa <= this.MAX_TENTATIVAS; tentativa++) {
      try {
        await this.mail.enviar(destinatario, titulo, html, anexos);
        return { ok: true };
      } catch (err) {
        ultimoErro = (err as Error).message;

        if (tentativa < this.MAX_TENTATIVAS) {
          this.logger.warn(
            `[EMAIL] Falha ao enviar para ${destinatario} (tentativa ${tentativa}/${this.MAX_TENTATIVAS}): ${ultimoErro}. Tentando novamente...`,
          );
          await new Promise((r) => setTimeout(r, 2000 * tentativa));
        }
      }
    }

    return { ok: false, erro: ultimoErro };
  }

  async processarNovoLivro(livro: LivroCadastradoEvent): Promise<void> {
    this.logger.log(`Processando notificação do livro "${livro.titulo}"`);

    const titulo = `Novo na Lumina: ${livro.titulo}`;

    const notificacao = await this.repo.criarNotificacao({
      tipo: 'LIVRO_CADASTRADO',
      titulo,
      mensagem: `Novo livro cadastrado: "${livro.titulo}" de ${livro.autor}`,
      dados: { ...livro },
    });

    const destinatarios = await this.getDestinatarios();
    if (destinatarios.length === 0) {
      this.logger.warn('[EMAIL] Nenhum destinatário encontrado, nada a enviar');
      return;
    }

    const entregas = await this.repo.criarEntregas(
      notificacao.id,
      destinatarios.map((u) => ({ usuario_id: u.id, email: u.email })),
    );

    const capa = await this.getCapa(livro.capa_imagem);

    const html = novoLivroTemplate({
      titulo: livro.titulo,
      autor: livro.autor,
      editora: livro.editora,
      descricao: livro.descricao,
      temCapa: !!capa,
      link: `${this.cfg.get('FRONTEND_URL', 'https://lumina.local')}/biblioteca`,
    });

    const anexos = capa
      ? [{ filename: livro.capa_imagem!, content: capa, cid: 'capa-livro' }]
      : undefined;

    let enviados = 0;
    let falhas = 0;

    for (const entrega of entregas) {
      const resultado = await this.enviarComRetry(entrega.destinatario, titulo, html, anexos);

      if (resultado.ok) {
        await this.repo.marcarEnviada(entrega.id);
        enviados++;
      } else {
        this.logger.error(
          `[EMAIL] Falha definitiva para ${entrega.destinatario} após ${this.MAX_TENTATIVAS} tentativas: ${resultado.erro}`,
        );
        await this.repo.marcarFalha(entrega.id, resultado.erro ?? 'Erro desconhecido');
        falhas++;
      }
    }

    const resumo = `[EMAIL] Processo concluído para o livro "${livro.titulo}": ${enviados} enviados, ${falhas} falhas`;
    if (falhas > 0) {
      this.logger.warn(resumo);
    } else {
      this.logger.log(resumo);
    }
  }

  private async getDestinatarios(): Promise<{ id: number; email: string }[]> {
    try {
      const { data } = await this.http.instance.get('/internal/destinatarios');
      const usuarios = (data as any[])
        .filter((u) => u?.email)
        .map((u) => ({ id: u.id_usuario ?? u.id, email: u.email as string }));
      this.logger.log(`[HTTP] ${usuarios.length} destinatários obtidos do backend`);
      return usuarios;
    } catch (err) {
      this.logger.error(`[HTTP] Falha ao buscar usuários: ${(err as Error).message}`);
      return [];
    }
  }
}