import Announcement from '@/models/Announcement';

export const createAnnouncement = async (req: any, res: any) => {
    const title = req.body.title || ''
    const description = req.body.description || ''
    const button = req.body.button || ''
    const img = req.body.img || ''
    const url = req.body.url || ''
    
    const news = await new Announcement({
        title: title,
        description: description,
        button: button,
        img: img,
        url: url
    }).save()
    return res.status(200).json(news)
}

export const deleteAnnouncement = async (req: any, res: any) => {

    const _id = req.body._id || ''
    await Announcement.findByIdAndDelete(_id)
    return res.status(200).json('success')
}

export const getAnnouncement = async (req: any, res: any) => {
    const announcements = await Announcement.find().lean()
    return res.status(200).json(announcements) 
}