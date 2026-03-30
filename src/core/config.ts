import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port:                   Number(process.env.SERVER_PORT) || 8000,
    nodeEnv:                process.env.NODE_ENV || 'development',
    serverHost:             process.env.SERVER_HOST || '0.0.0.0',
    serverDomain:           process.env.SERVER_DOMAIN || '',

    telerKey:               process.env.TELER_API_KEY || '',
    devnagriWsUrl:          process.env.DEVNAGRI_WS_URL || '',
    bufferSize:             Number(process.env.BUFFER_SIZE) || 60,

} as const;