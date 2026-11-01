import { Injectable, Logger } from '@nestjs/common';
import { LivroCadastradoEvent } from '../events/dto/livro-cadastrado.event';
import { HttpService } from '../http/http.service';
import { MailService } from './mail.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private http: HttpService,
    private mail: MailService,
  ) { }


  async processarNovoLivro(livro: LivroCadastradoEvent): Promise<void> {
    this.logger.log(`Processando notificação do livro "${livro.titulo}"`);

    const destinatarios = await this.getDestinatarios();
    if (destinatarios.length === 0) {
      this.logger.warn('[EMAIL] Nenhum destinatário encontrado, nada a enviar');
      return;
    }

    for (const user of destinatarios) {
      try {
        await this.mail.enviar(
          user.email,
          `Novo livro na Lumina: ${livro.titulo}`,
          `<h2>${livro.titulo}</h2>
         <p><strong>Autor:</strong> ${livro.autor} | <strong>Editora:</strong> ${livro.editora}</p>
         <p>${livro.descricao ?? ''}</p>`,
        );
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