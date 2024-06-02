import server from './app';
import { prisma } from './client';
import logger from './Logger';

const PORT = process.env.PORT ||3000

 
 
const startServer = () => {
  logger.info("connected to the database");
  server.listen(PORT, () => {
    logger.info(`App is running @localhost:${PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      logger.info("Server is shut down");
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer();