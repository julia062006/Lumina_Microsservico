import app from "./app";
import sequelize from "./config/database";

const port = 3000;

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        console.log("[DATABASE] Conexão estabelecida");

        await sequelize.sync();

        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    } catch (erro) {
        console.error("[DATABASE] Erro ao iniciar o servidor:", erro);
        process.exit(1);
    }
}

iniciarServidor();
