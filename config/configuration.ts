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
  DATABASE_PASSWORD: Joi.string().empty(''),
  DATABASE_NAME: Joi.string(),
});
