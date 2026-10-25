import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Role from "./Role";

class Usuario extends Model {
    declare id_usuario: number;
    declare nome: string;
    declare email: string;
    declare senha: string;
    declare cpf: string;
    declare id_role: number;
    declare role?: Role;
    declare foto_perfil: string | null;
}

Usuario.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'unique_email'
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'unique_cpf'
    },
    id_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "role",
            key: "id_role"
        }
    },
    foto_perfil: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize,
    tableName: "usuario"
})

Usuario.belongsTo(Role, { foreignKey: "id_role", as: "role" });

Role.hasMany(Usuario, { foreignKey: "id_role", as: "usuarios" });

export default Usuario;
