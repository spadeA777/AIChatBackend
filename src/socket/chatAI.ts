import config from '@/config';
import { OpenAI } from "openai";

import User from "@/models/User";
import Character from "@/models/Character";
import Chat from "@/models/Chat";

const openai = new OpenAI({
    apiKey: config.openai_key
});

const model = "gpt-3.5-turbo";

const chatFunc = {
    name: "chatFunc",
    parameters: {
        type: "object",
        properties: {
            message: {
                type: "string"
            },
            emotion: {
                type: "string",
                enum: ["very bad", "bad", "normal", "good", "very good"]
            },
        },
        required: ["message", "emotion"]
    }
}

export const chatAI = async (messages: any, character: any, msg: any) => {
    console.log(character.chatmodel)
    
    messages.push({
        role: 'user',
        content: msg
    })
    
    try {
        const response = await openai.chat.completions.create({
            model,
            messages: messages,
            functions: [chatFunc],
            function_call: {
                name: 'chatFunc'
            }
        });
        messages.push({
            role: 'assistant',
            content: response.choices[0].message.content
        })
        return response.choices[0].message.content
    } catch(e) {
        console.log(e)
        return ''
    }
}

interface Character {
    name: string;
    style: string;
    bio: string;
}

interface Message {
    message?: Character;
}

interface PromptMessage {
    role: string;
    content: string;
}

export const initPrompt = (msg: Message): PromptMessage[] => {
    const character: Character | undefined = msg.message;
    if (character) {
        const prompt = `
            Your name is ${character.name}. You are ${character.style} and shy girl. \n
            Here is your bio: "${character.bio}" \n
            Always reply as a friend. \n
            Don't justify your answers. Don't give information not mentioned in the CONTEXT INFORMATION. \n
            Always reply with positivity classification from user's words like following classes - very bad, bad, normal, good, very good. \n

            for example, \n
            user: Hello, how are you today? \n
            assistant: ##normal##I am fine. how about you? \n
            user: fine, thanks. you look beautiful today. \n
            assistant: ##good##Thanks, you too. \n
            user: I mean, your clothes. you're bad as before. \n
            assistant: ##very bad##Shut up!
            user: sorry, I love you. \n
            assistant: ##very good##love you too.
        `;
        
        const promptMessage: PromptMessage = {
            role: 'system',
            content: prompt
        };

        return [promptMessage];
    } else {
        const prompt = `
            Please being a good friend. \n
            Don't say anything \n
        `;

        const promptMessage: PromptMessage = {
            role: 'system',
            content: prompt
        };

        return [promptMessage];
    }
};


