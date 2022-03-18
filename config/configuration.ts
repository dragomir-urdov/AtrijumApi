import * as Joi from 'joi';

export const configuration = () => ({
  environment: process.env.NODE_ENV || 'development',

  port: parseInt(process.env.PORT, 10) || 3000,
  corsOrigin: process.env.CORS_ORIGIN,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    salt: process.env.SALT,
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  lang: {
    default: process.env.DEFAULT_LANG,
    supported: process.env.SUPPORTED_LANG.split(' '),
  },

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    sender: process.env.SENDGRID_SENDER,
    devMail: process.env.SENDGRID_DEV_MAIL,
  },

  data: {
    pageSize: process.env.PAGE_SIZE,
  },

  file: {
    dest: process.env.FILE_DESTINATION,
  },
});

export const validationSchema = Joi.object({
  // Runtime environment (OS shell)
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),

  // Environment file
  PORT: Joi.number().integer().default(3000),

  CORS_ORIGIN: Joi.string(),

  // MYSQL
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().integer().default(3306),
  DATABASE_USER: Joi.string(),
  DATABASE_PASSWORD: Joi.string().empty(''),
  DATABASE_NAME: Joi.string(),

  SALT: Joi.number().integer().default(12),
  JWT_SECRET: Joi.string(),
  JWT_EXPIRES_IN: Joi.string().default('0.5y'),

  DEFAULT_LANG: Joi.string().default('en'),
  SUPPORTED_LANG: Joi.string().default('en'),

  SENDGRID_API_KEY: Joi.string(),
  SENDGRID_SENDER: Joi.string(),
  SENDGRID_DEV_MAIL: Joi.string().optional(),

  PAGE_SIZE: Joi.number().integer().default(20),
  FILE_DESTINATION: Joi.string(),
});

export enum ConfigKey {
  NODE_ENV = 'environment',
  PORT = 'port',
  CORS_ORIGIN = 'corsOrigin',

  // DATABASE
  DATABASE_HOST = 'database.host',
  DATABASE_PORT = 'database.port',
  DATABASE_USER = 'database.user',
  DATABASE_PASSWORD = 'database.password',
  DATABASE_NAME = 'database.name',

  // JWT
  SALT = 'jwt.salt',
  JWT_SECRET = 'jwt.secret',
  JWT_EXPIRES_IN = 'jwt.expiresIn',

  // LANG
  DEFAULT_LANG = 'lang.default',
  SUPPORTED_LANG = 'lang.supported',

  // SENDGRID
  SENDGRID_API_KEY = 'sendgrid.apiKey',
  SENDGRID_SENDER = 'sendgrid.sender',
  SENDGRID_DEV_MAIL = 'sendgrid.devMail',

  PAGE_SIZE = 'data.pageSize',
  FILE_DESTINATION = 'file.dest',
}
