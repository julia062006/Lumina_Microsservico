import { Injectable } from "@nestjs/common";
import { literal } from "sequelize";
import { EntregaNotificacao, Notificacao } from "../models";


@Injectable()
export class NotificacoesRepository {
    criarNotificacao(data: { tipo: string; titulo: string; mensagem: string; dados?: object }) {
        return Notificacao.create(data);
    }

    async criarEntregas(notificacaoId: number, destinatarios: { usuario_id: number; email: string }[],) {
        await EntregaNotificacao.bulkCreate(
            destinatarios.map((d) => ({
                notificacao_id: notificacaoId,
                usuario_id: d.usuario_id,
                destinatario: d.email,
            })),
        );
        return EntregaNotificacao.findAll({
            where: { notificacao_id: notificacaoId },
            order: [["id", "ASC"]],
        });
    }

    marcarEnviada(id: number) {
        return EntregaNotificacao.update(
            { status: "ENVIADA", enviada_em: new Date(), erro: null, tentativas: literal("tentativas + 1") },
            { where: { id } }
        );
    }

    marcarFalha(id: number, erro: string) {
        return EntregaNotificacao.update(
            { status: "FALHOU", erro, tentativas: literal("tentativas + 1") },
            { where: { id } }
        );
    }

    buscarEntregas(notificacaoId: number) {
        return EntregaNotificacao.findAll({ where: { notificacao_id: notificacaoId } });
    }
}