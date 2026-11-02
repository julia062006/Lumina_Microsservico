import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LivroCadastradoEvent } from '../events/dto/livro-cadastrado.event';
import { HttpService } from '../http/http.service';
import { MailService } from './mail.service';
import { novoLivroTemplate } from './templates/novo-livro.template';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private http: HttpService,
    private mail: MailService,
    private cfg: ConfigService,
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

    const destinatarios = await this.getDestinatarios();
    if (destinatarios.length === 0) {
      this.logger.warn('[EMAIL] Nenhum destinatário encontrado, nada a enviar');
      return;
    }

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

    for (const user of destinatarios) {
      try {
        await this.mail.enviar(user.email, `Novo na Lumina: ${livro.titulo}`, html, anexos);
      } catch (err) {
        this.logger.error(`[EMAIL] Falha ao enviar para ${user.email}: ${(err as Error).message}`);
      }
    }

    this.logger.log(`[EMAIL] Processo concluído para o livro "${livro.titulo}"`);
  }

  private async getDestinatarios(): Promise<{ email: string }[]> {
    try {
      const { data } = await this.http.instance.get('/internal/destinatarios');
      const emails = (data as any[]).filter((u) => u?.email);
      this.logger.log(`[HTTP] ${emails.length} destinatários obtidos do backend`);
      return emails;
    } catch (err) {
      this.logger.error(`[HTTP] Falha ao buscar usuários: ${(err as Error).message}`);
      return [];
    }
  }
}