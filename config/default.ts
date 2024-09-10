import { session } from "passport";
import dotenv from "dotenv";
dotenv.config()

export default{
    privateKey: process.env.PRIVATE_KEY || '',
    publicKey: process.env.PUBLIC_KEY || '',
    port: process.env.PORT || '',
    mongoUrl: process.env.MONGO_URI || '',
    accessTokenTTL: process.env.ACCESS_KEY_TTL || "15m",
    refreshTokenTTL: process.env.REFRESH_KEY_TTL || "1y",
    salt: process.env.SALT_WORK_FACTOR || 10,
    nodeEnv: process.env.NODE_ENV ,
    sessionSecret: process.env.SESSION_SECRET ,
}