import type { FastifyInstance } from 'fastify';
import { createUser, listUsers } from './user.controller.js';
import type { CreateUserInput } from './user.schemas.js';

async function userRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateUserInput }>('/users', createUser);
  app.get('/users', listUsers);
}

export default userRoutes;
