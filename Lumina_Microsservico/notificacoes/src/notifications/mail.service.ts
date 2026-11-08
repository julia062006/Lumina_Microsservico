import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private cfg: ConfigService) {
  this.transporter = nodemailer.createTransport({
    host: cfg.get('SMTP_HOST'),
    port: parseInt(cfg.get('SMTP_PORT', '2525')),
    auth: { user: cfg.get('SMTP_USER'), pass: cfg.get('SMTP_PASS') },
    pool: true,
    maxConnections: 1,                     
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
  });
}

  async enviar(para: string, assunto: string, html: string, attachments?: nodemailer.SendMailOptions['attachments']) {
    await this.transporter.sendMail({
      from: this.cfg.get('MAIL_FROM'),
      to: para,
      subject: assunto,
      html,
      attachments
    });
    this.logger.log(`[EMAIL] Enviado para ${para}`);
  }
}