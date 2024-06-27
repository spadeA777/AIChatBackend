
import config from '@/config';
import Character from "@/models/Character";
import User from "@/models/User";
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

export const createCharacter = async (req: any, res: any) => {
    const name = req.body.name
    const address = req.body.address
    const chainId = req.body.chainId
    if(!address || !chainId) {
        return res.status(401).json('please connect wallet ...')
    } else if(!name) {
        return res.status(400).json('please give name ...')
    } else {
        const wallet = address + "@" + chainId
        const nft = req.body.nft || ''
        const owner = await  User.findOne({wallet: wallet})
        if(!owner) {
            return res.status(400).json("you can't create character")
        }
        // check owner and nft info
        const price = 0 // set base price
        // check if there is the same nft info in characters
        const character = await Character.findOne({ nft: { $ne: "" , $eq: nft }}).lean()

        if(!character) {
            
            let avatar_img = "", cover_img = "", back_img = "";

            if(req.body.avatar && req.body.avatar != "") {
                const  res = await  cloudinary.uploader.upload(req.body.avatar, { resource_type: 'image', folder: owner._id.toString() })
                avatar_img = res.secure_url
            }
            if(req.body.cover && req.body.cover != "") {
                const  res = await  cloudinary.uploader.upload(req.body.cover, { resource_type: 'image', folder: owner._id.toString() })
                cover_img = res.secure_url
            }
            if(req.body.background && req.body.background != "") {
                const  res = await  cloudinary.uploader.upload(req.body.background, { resource_type: 'image', folder: owner._id.toString() })
                back_img = res.secure_url
            }

            const type = req.body.type || ''
            const model = req.body.model || ''
            const description = req.body.description || ''
            const config = req.body.config || null
            const accessories = req.body.accessories || []
            
            const intro = req.body.intro || ''
            const bio = req.body.bio || ''
            const prompt = req.body.prompt || ''
            const chatmodel = req.body.chatmodel || ''
            const lang = req.body.lang || ''
            const voice = req.body.voice || ''
            const isPublished = req.body.isPublished || "false"
            
            const exp = 0
            const votes = 0
            const unvotes = 0
            const created_at = new Date().toISOString()

            const newCharacter = await new Character({
                owner: owner._id,
                name: name,
                type: type,
                model: model,
                description: description,
                avatar_img: avatar_img,
                cover_img: cover_img,
                back_img: back_img,
                intro: intro,
                bio: bio,
                prompt: prompt,
                chatmodel: chatmodel,
                lang: lang,
                voice: voice,
                isPublished: isPublished,
                
                config: config,
                nft: nft,
                accessories: accessories,

                exp: exp,
                votes: votes,
                unvotes: unvotes,
                price: price,
                created_at: created_at
            }).save()
            return res.status(200).json(newCharacter);

        } else {
            return res.status(400).json("Duplicated NFT BAE Character")
        }
    }  
}

export const updateCharacter = async (req: any, res: any) => {
    const name = req.body.name
    const address = req.body.address
    const chainId = req.body.chainId
    const _id = req.body._id
    if(!address || !chainId) {
        return res.status(401).json('please connect wallet ...')
    } else if(!_id || !name) {
        return res.status(400).json('failed')
    } else {
        const wallet = address + "@" + chainId
        const owner = await  User.findOne({wallet: wallet})
        if(!owner) {
            return res.status(400).json("you can't create character")
        }
        // check if there is the same nft info in characters
        // not able to change nft character model
        const character = await Character.findById(_id)

        if(character) {

            if(req.body.avatar && req.body.avatar != "") {
                const  res = await  cloudinary.uploader.upload(req.body.avatar, { resource_type: 'image', folder: owner._id.toString() })
                character.avatar_img = res.secure_url
            }
            if(req.body.cover && req.body.cover != "") {
                const  res = await  cloudinary.uploader.upload(req.body.cover, { resource_type: 'image', folder: owner._id.toString() })
                character.cover_img = res.secure_url
            }
            if(req.body.description) character.description = req.body.description
            if(req.body.intro) character.intro = req.body.intro
            if(req.body.bio) character.bio = req.body.bio
            if(req.body.prompt) character.prompt = req.body.prompt
            if(req.body.config) character.config = req.body.config
            if(req.body.accessories) character.accessories = req.body.accessories
            if(req.body.voice) character.voice = req.body.voice
            if(req.body.lang) character.lang = req.body.lang
            if(req.body.chatmodel) character.chatmodel = req.body.chatmodel
            if(req.body.isPublished) character.isPublished = req.body.isPublished || "false"
        
            await character.save()
            return res.status(200).json(character)

        } else {
            return res.status(400).json("Character is not exist")
        }
    }
}

export const getMyCharacter = async (req: any, res: any) => {
    const address = req.body.address
    const chainId = req.body.chainId
    if(!address || !chainId) {
        return res.status(400).json('failed')
    } else {
        const wallet = address + "@" + chainId
        const owner = await User.findOne({wallet: wallet}).lean()
        if(!owner) {
            console.log('user is not existed')
            return res.status(400).json('failed')
        } else {
            const characters = await Character.find({owner: owner._id})
            return res.status(200).json(characters)
        }
    }
}

// search by keywords
export const getCharacters = async (req: any, res: any) => {
    const keywords = req.body.keywords || ''
    const tags = req.body.tags || []
    const langs = req.body.langs || []

    const query: any = {}
    if(keywords != "" ) {
        query.name = new RegExp(keywords, 'i')
    }
    if(langs.length > 0) {
        query.lang = {$in: langs}
    }
    if(tags.length > 0) {
        query.tags = {$in: tags}
    }
    const characters = await Character.find(query).lean()
    return res.status(200).json(characters)
}

export const getHotCharacters = async (req: any, res: any) => {
    const characters = await Character.find({ tags: "hot" }).lean()
    return res.status(200).json(characters)
}

export const getFeaturedCharacters = async (req: any, res: any) => {
    const characters = await Character.find({ tags: "featured" }).lean()
    return res.status(200).json(characters)
}

export const getNewestCharacters = async (req: any, res: any) => {
    const characters = await Character.find({ tags: "new" }).lean()
    return res.status(200).json(characters)
}

export const getTrendingCharacters = async (req: any, res: any) => {
    const hotCharacters = await Character.find({
        isPublished: "true", 
        tags: { $elemMatch: {
            $eq: 'hot'
        }}
    })

    const featuredCharacters = await Character.find({
        isPublished: "true", 
        tags: { $elemMatch: {
            $eq: 'featured'
        }}
    })

    return res.status(200).json({
        'hotCharacters': hotCharacters,
        'featuredCharacters': featuredCharacters
    })
}