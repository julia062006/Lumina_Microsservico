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

    for (const entrega of entregas) {
      try {
        await this.mail.enviar(entrega.destinatario, titulo, html, anexos);
        await this.repo.marcarEnviada(entrega.id);
      } catch (err) {
        const mensagem = (err as Error).message;
        this.logger.error(`[EMAIL] Falha ao enviar para ${entrega.destinatario}: ${mensagem}`);
        await this.repo.marcarFalha(entrega.id, mensagem);
      }
    }

    this.logger.log(`[EMAIL] Processo concluído para o livro "${livro.titulo}"`);
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