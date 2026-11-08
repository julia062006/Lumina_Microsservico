import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import sequelize from './config/database';
import './models';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    await sequelize.authenticate();
    logger.log('[DATABASE] Conexão estabelecida');
    await sequelize.sync();
  } catch (erro) {
    logger.error('[DATABASE] Erro ao conectar ao banco', erro as Error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableShutdownHooks();

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);
  logger.log(`Microsserviço de notificações rodando na porta ${port}`);
}
bootstrap();