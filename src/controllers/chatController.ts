import Chat from '@/models/Chat'
import Character from '@/models/Character'
import User from '@/models/User'

export const getAll = async (req: any, res: any) => {
    const address = req.body.address
    const chainId = req.body.chainId
    const fields = {
        _id: 1,
        address: 1,
        chainId: 1,
        last_chat: 1,
        character: 1,
        bond: 1
    }
    const chats = await Chat.find({address: address, chainId: chainId}, fields)
        .populate("character")
        .exec()
    return res.status(200).json(chats)
}

export const getChat = async (req: any, res: any) => {
    const chat_id = req.body._id
    const chat = await Chat.findById(chat_id)
        .populate("character")
        .exec()

    return res.status(200).json(chat)
}

export const startChat = async (req: any, res: any) => {
    try {
        const address = req.body.address
        const chainId = req.body.chainId
        if(!address || !chainId) {
            return res.status(401).json('please connect wallet ...')
        }
        else {
            const character_id = req.body.character
            const wallet = address + "@" + chainId
            const user = await User.findOne({wallet: wallet}).lean()
            if(!user) {
                const newUser = await new User({
                    wallet: wallet,
                    username: wallet,
                }).save();
                return res.status(200).json(newUser)
            }
            const character = await Character.findById(character_id).lean();
            if(!character) {
                return res.status(400).json('no character')
            }
            
            const chat = await Chat.findOne({address: address, chainId: chainId, character: character_id}).lean();
            if(chat) {
                return res.status(200).json(chat._id)
            }
            const prompt = `
                Your name is ${character.name}. \n
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
            `
            const messages = [{
                role: 'system',
                content: prompt,
                timestamp: new Date()
            }]
            
            const new_chat = await new Chat({
                address: address,
                chainId: chainId,
                character: character._id,
                messages: messages
            }).save();
            return res.status(200).json(new_chat._id)
        }
    } catch(err) {
        console.log(err)
        return res.status(500).json('internal error')
    }
    
}