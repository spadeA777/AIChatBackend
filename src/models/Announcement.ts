import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    title: String,
    description: String,
    button: String,
    url: String,
    img: String,
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema)

export default Announcement;
 