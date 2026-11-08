
import { redisCache } from "../config/redis";

export async function cacheAside<T>(
    chave: string,
    ttlSegundos: number,
    buscar: () => Promise<T>,
): Promise<T> {
    try {
        const cache = await redisCache.get(chave);

        if (cache) {
            console.log(`[CACHE] HIT ${chave}`);
            return JSON.parse(cache) as T;
        }

        console.log(`[CACHE] MISS ${chave}`);
    } catch (err) {
        console.error(`[CACHE] Falha ao ler ${chave}: ${(err as Error).message}`);
    }

    const dados = await buscar();

    if (dados !== null && dados !== undefined) {
        try {
            const ttlFinal = Number(process.env.CACHE_TTL_OVERRIDE) || ttlSegundos;
            await redisCache.set(chave, JSON.stringify(dados), "EX", ttlFinal);
        } catch (err) {
            console.error(`[CACHE] Falha ao gravar ${chave}: ${(err as Error).message}`);
        }
    }

    return dados;
}

export async function invalidarPrefixo(prefixo: string): Promise<void> {
    try {
        let removidas = 0;

        const stream = redisCache.scanStream({
            match: `${prefixo}*`,
            count: 100,
        });

        for await (const chaves of stream as AsyncIterable<string[]>) {
            if (chaves.length > 0) {
                await redisCache.unlink(...chaves);
                removidas += chaves.length;
            }
        }

        console.log(`[CACHE] INVALIDADO ${prefixo}* (${removidas} chaves)`);
    } catch (err) {
        console.error(`[CACHE] Falha ao invalidar ${prefixo}*: ${(err as Error).message}`);
    }
}
