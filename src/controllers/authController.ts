import User from '@/models/User';
import { generateSlug } from "random-word-slugs";
import config from '@/config';
import jwt from 'jsonwebtoken';

export const connectWallet = async (req: any, res: any) => {

    const address = req.body.address;
    const chainId = req.body.chainId;
    if(!address || !chainId) return res.status(400).json('failed')
    const wallet = address + "@" + chainId

    try {
        const user = await User.findOne({ wallet: wallet }).lean()
        if(!user) {
            console.log('creating new user')
            const nickName = generateSlug(2, {
                format: "camel",
                partsOfSpeech: ["adjective", "noun"],
                categories: {
                    adjective: ["color", "appearance", "personality"],
                    noun: ["animals"],
                },
            });
            const newUser = await new User({
                wallet: wallet,
                nickName: nickName,
                balance: {
                    "BAE": 0,
                    "BTC": 0,
                    "ETH": 0,
                    "BNB": 0,
                    "SOL": 0,
                    "TRX": 0
                },
            }).save()
            console.log('new user is created = ', address, '@', chainId)
            // Generate JWT token
            const token = jwt.sign({ wallet }, config.jwt.secret, { expiresIn: '1h' });
            return res.status(200).json({ user: newUser, token }); // Sending user object and token
        } 

        return res.status(200).json(user.balance)
    } catch (err) {
        console.log(err)
        return res.status(500).json('internal error')
    }
    
}

export const getProfile = async (req: any, res: any) => {
    return res.json("success")
}

export const updateProfile = async (req: any, res: any) => {
    return res.json("success")
}