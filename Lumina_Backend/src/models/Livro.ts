import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Autor from "./Autor";
import Categoria from "./Categoria";
import Editora from "./Editora";
import Colecao from "./Colecao";

class Livro extends Model {
    declare id_livro: number;
    declare id_autor: number;
    declare titulo: string;
    declare descricao: string;
    declare capa_imagem: string;
    declare arquivo_pdf: string;
    declare id_categoria: number;
    declare destaque: boolean;
    declare id_editora: number;
    declare id_colecao: number;
}

Livro.init({
    id_livro: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_autor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "autor",
            key: "id_autor"
        }
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    capa_imagem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    arquivo_pdf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "categoria",
            key: "id_categoria"
        }
    },
    id_editora: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "editora",
            key: "id_editora"
        }
    },
    id_colecao: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "colecao",
            key: "id_colecao"
        }
    },
    destaque: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: "livro"
});

Autor.hasMany(Livro, { foreignKey: 'id_autor', as: 'livros' });
Livro.belongsTo(Autor, { foreignKey: 'id_autor', as: 'autor' });

Categoria.hasMany(Livro, { foreignKey: 'id_categoria', as: 'livros' });
Livro.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

Editora.hasMany(Livro, {foreignKey: 'id_editora', as: "livros"});
Livro.belongsTo(Editora, {foreignKey: 'id_editora', as: 'editora'});

Colecao.hasMany(Livro, {foreignKey: 'id_colecao', as: "livros"});
Livro.belongsTo(Colecao, {foreignKey: 'id_colecao', as: 'colecao'});

export default Livro;