import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDB() {
  mongoose.connection.on('connected', () => {
    logger.info('mongodb_connected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('mongodb_connection_error', { error: err instanceof Error ? err.message : String(err) });
  });

  await mongoose.connect(env.mongodbUri);
}
