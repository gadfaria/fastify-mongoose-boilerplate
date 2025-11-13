import fastify from 'fastify';
import mongoosePlugin from '../plugins/mongoose.js';
import userRoutes from '../modules/user/user.routes.js';

export async function buildServer() {
  const app = fastify({ logger: true });

  await app.register(mongoosePlugin);

  app.get('/health', async () => ({ status: 'ok' }));

  await app.register(userRoutes);

  return app;
}
