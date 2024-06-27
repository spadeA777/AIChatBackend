import dotenv from 'dotenv';
dotenv.config();

const toInt = (envVar: string | undefined) => (envVar ? parseInt(envVar) : null)

export default {
  mongodb: {
    uri: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/projectbae',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    },
  },
  openai_key: process.env.OPENAI_KEY || '',
  cloudinary: {
    name: process.env.CLOUDINARY_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
  },
  system: {
    server: process.env.SERVER || 'http://127.0.0.1:8000',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
  },
  redis: {
    session: {
      name: 'session',
      host: process.env.REDIS_HOST,
      port: toInt(process.env.REDIS_PORT) || 6379,
      pass: process.env.REDIS_PASS,
    },
    sockets: {
      name: 'sockets',
      host: process.env.REDIS_SOCKETS_HOST || process.env.REDIS_HOST,
      port:
        toInt(process.env.REDIS_SOCKETS_PORT) ||
        toInt(process.env.REDIS_PORT) ||
        6379,
      pass: process.env.REDIS_SOCKETS_PASS || process.env.REDIS_PASS,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ffds9fdsfdskljfsdkldsnkcnv,mmcvx,m,vnclkjdfsljk',
  },
  session: {
    key: 'session.sid',
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: true,
  },
}