import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { startAnalyticsWorker, stopAnalyticsWorker } from './services/analytics.service.js';
import { logger } from './utils/logger.js';

async function start() {
  await connectDB();
  startAnalyticsWorker();

  const server = app.listen(env.port, () => {
    logger.info('server_started', { port: env.port, nodeEnv: env.nodeEnv });
  });

  async function shutdown(signal: NodeJS.Signals) {
    logger.info('shutdown_started', { signal });

    const forceExit = setTimeout(() => {
      logger.error('shutdown_timeout');
      process.exit(1);
    }, 10_000);

    server.close(async (err) => {
      if (err) {
        logger.error('http_server_close_failed', { error: err.message });
        clearTimeout(forceExit);
        process.exit(1);
      }

      await stopAnalyticsWorker();
      await mongoose.disconnect();
      clearTimeout(forceExit);
      process.exit(0);
    });
  }

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

start().catch((err) => {
  logger.error('server_start_failed', { error: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
