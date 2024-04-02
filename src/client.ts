import { PrismaClient } from "@prisma/client";
import logger from "./Logger";


// Initialize Prisma client instance with extensions and event listeners
const prismaClient = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }, { emit: 'event', level: 'error' }],
  errorFormat: 'pretty',
});


prismaClient.$on("query", (e) => logger.info(e));
prismaClient.$on("error", (e) => logger.error(e));

export const prisma = prismaClient;
