import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Notificacao extends Model {
    declare id: number;
    declare tipo: string;
    declare titulo: string;
    declare mensagem: string;
    declare dados: Record<string, any>;
    declare criada_em: Date;
}

Notificacao.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        titulo:
        {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        mensagem: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dados: {
            type: DataTypes.JSON,
            allowNull: true
        },
    },
    {
        sequelize,
        tableName: "notificacoes",
        createdAt: "criada_em",
        updatedAt: false,
    }
);

export default Notificacao;