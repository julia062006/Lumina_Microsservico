import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class EntregaNotificacao extends Model {
    declare id: number;
    declare notificacao_id: number;
    declare usuario_id: number;
    declare destinatario: string;
    declare canal: string;
    declare status: "PENDENTE" | "ENVIADA" | "FALHOU";
    declare tentativas: number;
    declare erro: string | null;
    declare enviada_em: Date | null;
}

EntregaNotificacao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        notificacao_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        destinatario: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        canal: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "EMAIL"
        },
        status: {
            type: DataTypes.ENUM("PENDENTE", "ENVIADA", "FALHOU"),
            allowNull: false,
            defaultValue: "PENDENTE",
        },
        tentativas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        erro: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        enviada_em: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        sequelize,
        tableName: "entregas_notificacao",
        createdAt: "criada_em",
        updatedAt: "atualizada_em",
        indexes: [{ fields: ["notificacao_id"] }, { fields: ["status"] }],
    }
);

export default EntregaNotificacao;
