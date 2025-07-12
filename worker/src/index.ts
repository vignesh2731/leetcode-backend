import {createClient} from 'redis'
import dotenv from 'dotenv'
dotenv.config();
const redisUrl=process.env.REDIS_URL;
async function main()
{
    const redisClient=createClient({url:redisUrl});
    await redisClient.connect();
    while(1)
    {
        const data=await redisClient.brPop('store',0);
        // check your code here, run the tcs and return the response
        if(!data)continue;
        const parsedData=JSON.parse(data?.element);
        await redisClient.publish(parsedData.userId,JSON.stringify({result:"success"}));
    }
}
main();
