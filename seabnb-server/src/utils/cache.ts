import * as redis from 'redis'

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

// Connect to redis
const client = redis.createClient({ url: `redis://${redisHost}:${redisPort}` })
client
    .connect()
    .then(() => console.log('Redis connected'))
    .catch(() => console.log('Connect to redis failed !'))


export async function storeValidationCode(email: string, code: string) {
    await client.set(email, code);
    await client.expire(email, 15 * 60)
}

export async function checkValidationCode(email: string, code: string) {
    const storedCode = await client.get(email);
    const result = code === storedCode
    if (result) {
        await client.del(email)
    }
    return result
}
