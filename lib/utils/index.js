const crypto = require('crypto')
const Redis = require('ioredis')

const buildId = () =>
  Math.random()
    .toString(36)
    .slice(2) +
  Math.random()
    .toString(36)
    .slice(1)

const buildPromise = fn =>
  new Promise((resolve, reject) =>
    fn((err, res) => (err ? reject(err) : resolve(res))),
  )

const buildRedis = redisConfig => new Redis(redisConfig)

const clock = () => Date.now()

const endRedis = redisClient => redisClient.quit()

const multiAsync = async (redis, commands, hook) => {
  const results = await redis.multi(commands).exec()
  const err = results.find(([err]) => err)
  if (err) {
    throw new Error(err)
  }
  const res = results.map(([, res]) => res)
  if (hook) {
    hook({ commands, res })
  }
  return res
}

const buildSha1 = string =>
  crypto
    .createHash('sha1')
    .update(string)
    .digest('hex')

module.exports = {
  buildId,
  buildMonitor: require('./build-monitor'),
  buildPromise,
  buildRedis,
  buildSha1,
  clock,
  endRedis,
  multiAsync,
}
