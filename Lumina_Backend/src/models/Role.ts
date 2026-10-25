import { DataTypes, Model } from "sequelize";

import sequelize from "../config/database";

class Role extends Model {
    declare id_role: number;
    declare nome: string;
}

Role.init(
    {
        id_role: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        tableName: "role"
    }
);

export default Role;