import { Server } from 'socket.io'
import { createAdapter } from 'socket.io-redis'
import { RateLimiterMemory } from 'rate-limiter-flexible'

import { getIpFromRequest } from '@/utils/geoFencing'
import Chat from "@/models/Chat";
import { chatAI, initPrompt } from './chatAI';
import { validateJwtToken } from '@/utils/auth'; // Assuming the file is named jwtUtils.ts

export const SocketIO = (http: any) => {
  // Attach socket.io to the server instance
  const socketio = new Server(http, {
    cors: {
      origin: '*'
    }
  })

  const memoryRateLimiter = new RateLimiterMemory({
    points: 100, // Max message per duration
    duration: 10, // Per second(s)
    keyPrefix: 'rlm', // must be unique for limiters with different purpose
  })

  socketio.on('connection', (socket) => {
    
    socket.use(async (_, next) => {
      const clientIP = await getIpFromRequest(socket.handshake, 'local')

      try {
        await memoryRateLimiter.consume(clientIP)
      } catch (err) {
        socket.disconnect()
      }
      next()
    }),

    socket.on('chat', async (msg, chat_id) => {
      console.log(chat_id)
      const chat = await Chat.findById(chat_id)
        .populate("character")
        .exec()
      if(!chat) {
        socket.emit('@nochat')
      } else {
        const reply = await chatAI(chat.messages, chat.character, msg);
        socket.emit('@response', {
            message: reply
        })
        // const chatEntry = { speaker: 'user', message: msg.message, timestamp: new Date() };
        // const botEntry = { speaker: 'assistant', message: reply, timestamp: new Date() };
        // await Chat.findByIdAndUpdate(
        //     { _id: msg.chat_id }, 
        //     { $push: { messages: { $each: [chatEntry, botEntry], $position: 0 } } }, 
        //     { upsert: true }
        // )
      }
    })

    socket.on('getHistory', async (msg) => {
      const history = await Chat.findOne({ address: msg.address, chainId: msg.chainId });
      if (history) {
        const summary = history.messages.slice(0, 5); // Get the latest 5 messages as summary
        socket.emit('@chatHistory', summary);
      }
    })

    socket.on('summarize', async(msg) => {
      // summary chat history leave only last 5 chats
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    socket.on('init_bot', (msg) => {
      const res_msg:any = initPrompt(msg);
      //console.log(res_msg);
      socket.emit('@ready', true)
    })
  })
}
