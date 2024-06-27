import { createClient } from 'redis'
import config from '@/config'

const RedisClientTypes = ['session', 'sockets'] as const
type RedisClientType = (typeof RedisClientTypes)[number]

const clients: any = {
    session: null, // sessions - o.g. redis sentinel, needs to be migrated
    sockets: null, // elasticache sentinel (sockets dont scale with cluster)
}

const defaultOptions = (type: RedisClientType = 'session'): any => {
    const selectedRedisConfig = config.redis[type]

    return {
        legacyMode: true,
        host: selectedRedisConfig.host,
        port: selectedRedisConfig.port,

        retry_strategy: (options: any) => {
            const client = clients[type]
            if (client !== null && !client.connected) {
                clients[type] = null
            }
            if (options.error && options.error.code === 'ECONNREFUSED') {
                clients[type] = null
            }

            if (options.total_retry_time > 1000 * 60 * 10) {
                return new Error('Retry Time Exhausted')
            }

            // Wait <= 3 seconds between retry attempts
            return Math.min(options.attempt * 100, 3000)
        },
    }
}

const getClient = (type: RedisClientType = 'session', options = {}) => {
    if (clients[type] === null || !clients[type].connected) {
        const newClient = createClient({
            ...defaultOptions(type),
            ...options,
        })
        clients[type] = newClient
    }
    // We are asserting that clients[type] is non-null here because we just set it
    return clients[type]!
}

export const sessionClient = getClient('session')
export const socketsClient = getClient('sockets')

export const redisClients = {
    sessionClient: () => getClient('session'),
    socketsClient: () => getClient('sockets')
}
