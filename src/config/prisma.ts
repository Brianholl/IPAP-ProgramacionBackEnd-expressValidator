import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

// pool de conexiones (maximo 10)
const pool = mariadb.createPool({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  connectionLimit: 10,
  allowPublicKeyRetrieval: true
});

const adapter = new PrismaMariaDb(pool);

export const prisma = new PrismaClient({ adapter });
