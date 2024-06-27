import config from '@/config';
import express, { type CookieOptions } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import http from 'http';
import cors from 'cors';
import ConnectRedis from 'connect-redis'
import { sessionClient } from '@/system/redis';
import { logger } from '@/utils/logger';

import authRoute from '@/routes/authRoute';
import characterRoute from '@/routes/characterRoute';
import chatRoute from '@/routes/chatRoute';
import announcementRoute from '@/routes/announcementRoute'

const sessionCookieOptions: CookieOptions = {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3, // Set max age/ttl to 3 days
}

export const runServer = async () => {
    
	const app = express()
	
	app.use(helmet());
    app.use(cors({
        credentials: true,
        origin: true
    }));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser(config.session.secret))

	await sessionClient.connect()
    const RedisStore = ConnectRedis(session)
    const sessionStore = new RedisStore({
        client: sessionClient
    })

    app.use(session({
        ...config.session,
        store: sessionStore,
        cookie: sessionCookieOptions
    }))

    app.use('/auth', authRoute)
    app.use('/chat', chatRoute)
    app.use('/character', characterRoute)
    app.use('/announcement', announcementRoute)

    const httpServer = http.createServer(app)

	httpServer.listen(config.system.port, () => {
		logger.info(`Server is started at ${config.system.port} port`)
	});

    return httpServer;
};