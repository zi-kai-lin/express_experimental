const redis = require("redis");

const redisConfig = {
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,

    }


}
console.log(redisConfig)

/* client allow communcation between aplication an redis server */

const client = redis.createClient(redisConfig);


const connectRedis = async() => {


        try{

            
            await client.connect();

            console.log("Redis connection successful");

        }catch(error){

            console.log("redis connection failed", error)




        }




}

module.exports = {

    connectRedis,
    client



}