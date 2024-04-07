import "dotenv/config"
import {createClient} from 'redis'
import logger from "../Logger";

export const redisClient = createClient({url:process.env.REDIS_URL})
redisClient.on('error', (err:Error) => logger.info(err))
redisClient.on('connect',()=>{
    logger.info('Redis client connected')
    });

  redisClient.connect()
 