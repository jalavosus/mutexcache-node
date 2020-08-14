import { Mutex } from "async-mutex"
import Cache from "timed-cache"

class MutexCache {
    private mutCache: Cache
    readonly defaultTtl: number

    /**
     * @param defaultTtl
     * Instantiates a new MutexCache.
     * If @defaultTtl is not provided, it defaults to 30 seconds.
     */
    constructor(defaultTtl?: number) {
        this.mutCache = new Cache({ defaultTtl: defaultTtl })
        this.defaultTtl = defaultTtl ? defaultTtl : (30*1000)
    }

    get(cacheKey: string, ttl?: number): Mutex {
        let mut = this.mutCache.get(cacheKey)

        if (mut == null) {
            mut = this.newMutex(cacheKey, ttl)
        }

        return mut
    }

    private newMutex(cacheKey: string, ttl?: number): Mutex {
        let mut = new Mutex()

        if (!ttl) {
            ttl = this.defaultTtl
        }

        this.mutCache.put(cacheKey, mut, { ttl: ttl })

        return mut
    }
}

export { MutexCache }