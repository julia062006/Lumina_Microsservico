import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME ?? "lumina_notificacoes",
  process.env.DB_USER ?? "root",
  process.env.DB_PASS ?? "",
  {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;