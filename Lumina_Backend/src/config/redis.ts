import IORedis, { Redis } from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export const redisPub = new IORedis(redisConfig);

redisPub.on('connect', () => console.log('[REDIS] Publisher conectado'));
redisPub.on('ready', async () => {
  const resposta = await redisPub.ping();
  console.log(`[REDIS] Publisher PING -> ${resposta}`);
});
redisPub.on('error', (e) => console.error('[REDIS] Erro:', e.message));

export const redisCache = new Redis({
  ...redisConfig,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redisCache.on('connect', () => console.log('[CACHE] Conectado ao Redis'));
redisCache.on('ready', async () => {
  const resposta = await redisCache.ping();
  console.log(`[CACHE] PING -> ${resposta}`);
});
redisCache.on('error', (e) => console.error('[CACHE] Erro no Redis:', e.message));