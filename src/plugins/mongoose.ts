import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import type { FastifyInstance } from 'fastify';
import { env } from '../config/env.js';

mongoose.set('strictQuery', true);

let connectionPromise: Promise<typeof mongoose> | null = null;
let listenersBound = false;

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: typeof mongoose;
  }
}

async function connectToDatabase(fastify: FastifyInstance) {
  if (!listenersBound) {
    mongoose.connection.on('connected', () => fastify.log.info('[Mongo] Connection established'));
    mongoose.connection.on('error', (error) => fastify.log.error('[Mongo] Connection error', error));
    mongoose.connection.on('disconnected', () => fastify.log.warn('[Mongo] Connection lost'));
    listenersBound = true;
  }

  if (mongoose.connection.readyState === 1) {
    fastify.log.info('[Mongo] Reusing existing connection');
  } else {
    connectionPromise ??= mongoose.connect(env.MONGO_URI);
    await connectionPromise;
    fastify.log.info('[Mongo] Connected to cluster');
  }

  fastify.decorate('mongoose', mongoose);

  fastify.addHook('onClose', async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      fastify.log.info('[Mongo] Connection closed');
    }
  });
}

export default fp(connectToDatabase, {
  name: 'mongoosePlugin',
});
