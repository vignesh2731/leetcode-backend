import express from 'express'
import { createClient } from 'redis'
import dotenv from 'dotenv'
dotenv.config();
const PORT=process.env.PORT;
const redisURL=process.env.REDIS_URL;
const redisClient=createClient({url:redisURL});
async function main()
{
    await redisClient.connect();
}
const app=express();
app.use(express.json());

app.post("/checkCode",async(req,res)=>{
    const {language,code,userId,problemId}=req.body;
    await redisClient.LPUSH('store',JSON.stringify({language,code,userId,problemId}));
    res.json({msg:"Code has been pushed to the queue"});
})
main();
app.listen(PORT,()=>{
    console.log(`Listening to port 3000`);
})
