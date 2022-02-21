import * as Joi from 'joi';

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
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
});

export const validationSchema = Joi.object({
  // Runtime environment (OS shell)
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),

  // Environment file
  PORT: Joi.number().default(3000),

  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.number(),
  DATABASE_USER: Joi.string(),
  DATABASE_PASSWORD: Joi.string().empty('').optional(),
  DATABASE_NAME: Joi.string(),

  SALT: Joi.number().integer(),
  JWT_SECRET: Joi.string(),
  JWT_EXPIRES_IN: Joi.string(),

  DEFAULT_LANG: Joi.string().default('en'),
  SUPPORTED_LANG: Joi.string(),
});
