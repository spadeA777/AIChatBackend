import config from '@/config';
import mongoose from 'mongoose';
import { logger } from '@/utils/logger';

export async function initializeMongo() {
    mongoose.set('strictQuery', true);
    mongoose.connection.on("connected", () => {
        logger.info(`Connected to MongoDB on `, config.mongodb.uri);
    });
    mongoose.connection.on("error", (error) => {
        logger.info(`MongoDB error on config.mongodb.uri`);
        logger.error(error)
    });

    await mongoose.connect(config.mongodb.uri)
}