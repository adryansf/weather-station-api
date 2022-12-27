import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connect = () => {
  prisma
    .$connect()
    .then(() => console.log('📦 Successfully connected with database.'))
    .catch(() => console.log('❌ Error to connect with Database.'));
};

export default prisma;
