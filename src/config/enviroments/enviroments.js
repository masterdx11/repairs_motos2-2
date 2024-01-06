import 'dotenv/config';
import env from 'env-var';
console.log(process.env.SECRET_JWT_SEED);
const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  DB_URI: env.get('DB_URI').required().asString(),
  NODE_ENV: env.get('NODE_ENV').required().asString(),
  SECRET_JWT_SEED: env.get('SECRET_JWT_SEED').required().asString(),
  JWT_EXPIRE_IN: env.get('JWT_EXPIRE_IN').required().asString(),
};

export default envs;
