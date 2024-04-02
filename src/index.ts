import server from './app';
import { prisma } from './client';
import logger from './Logger';

const PORT = process.env.PORT ||3000

  logger.info("connected to the database");
  
server.listen(3000, () => {
    logger.info(`app running on PORT:${PORT} 🔥🔥🔥`)
})




  // Shutdown hook
  const handleShutdown = async () => {
    logger.info("Shutting down server...");
    await prisma.$disconnect(); 
    server.close(() => {
      logger.info("Server is shut down");
      process.exit(0); 
    });
  };
  
  // Listen for SIGINT and SIGTERM signals
  process.on("SIGINT", handleShutdown);
  process.on("SIGTERM", handleShutdown);