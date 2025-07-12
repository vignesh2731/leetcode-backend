import http from 'http'
import { parse } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from 'redis';
import dotenv from 'dotenv'
dotenv.config();
const PORT=process.env.PORT;
const redisURL=process.env.REDIS_URL;
const httpServer=http.createServer((req,res)=>{
    console.log(`Server created`);
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': 86400,
        });
        res.end();
        return;
    }
})
const subscriber=createClient({url:redisURL});
subscriber.connect();
const room=new Map<string,WebSocket>();
const wss=new WebSocketServer({server:httpServer});
wss.on('connection',(ws,req)=>{
    ws.on('error',console.error);
    const parameters=parse(req.url!,true);
    const userId:string=parameters.query.userId as string;
    room.set(userId,ws);
    subscriber.subscribe(userId,(message)=>{
        const parseMessage=JSON.parse(message);
        const jsonMessage = {
            type: 'response',
            data: parseMessage,
            timestamp: Date.now()
        };
        const socket=room.get(userId);
        socket?.send(JSON.stringify(jsonMessage));
    })
    ws.on('message',(data,isBinary)=>{

    })
    ws.on('close', (code, reason) => {
        console.log(`Client disconnected with code ${code} and reason: ${reason}`);
    });
})

httpServer.listen(PORT,()=>{
    console.log(`Websocket has been started`);
})