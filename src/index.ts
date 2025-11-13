import { env } from './config/env.js';
import { buildServer } from './server/buildServer.js';

const start = async () => {
  try {
    const server = await buildServer();
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    server.log.info(`🚀 Server listening on port ${env.PORT}`);
  } catch (error) {
    console.error('[Startup] Failed to initialize server', error);
    process.exitCode = 1;
  }
};

void start();
