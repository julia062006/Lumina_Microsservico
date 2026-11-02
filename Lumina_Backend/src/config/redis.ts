import IORedis from 'ioredis';

export const redisPub = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

redisPub.on('connect', () => console.log('[REDIS] Publisher conectado'));
redisPub.on('error', (e) => console.error('[REDIS] Erro:', e.message));