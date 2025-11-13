import type { FastifyReply, FastifyRequest } from 'fastify';
import mongoose from 'mongoose';
import type { MongoServerError } from 'mongodb';
import { ZodError } from 'zod';
import { UserModel } from './user.model.js';
import { createUserBodySchema, type CreateUserInput } from './user.schemas.js';

type CreateUserRequest = FastifyRequest<{ Body: CreateUserInput }>;
type ListUsersRequest = FastifyRequest;

export const createUser = async (request: CreateUserRequest, reply: FastifyReply) => {
  try {
    const payload = createUserBodySchema.parse(request.body);

    const alreadyExists = await UserModel.exists({ email: payload.email });
    if (alreadyExists) {
      return reply.status(409).send({ message: 'Email already registered' });
    }

    const user = await UserModel.create(payload);
    return reply.status(201).send(user);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const issues = (error as ZodError).flatten();
      return reply.status(400).send({
        message: 'Validation failed',
        issues,
      });
    }

    if (error instanceof mongoose.Error.ValidationError || isDuplicateKeyError(error)) {
      return reply.status(400).send({ message: 'Invalid user data' });
    }

    request.log.error(error, '[User] Failed to create user');
    return reply.status(500).send({ message: 'Unable to create user' });
  }
};

export const listUsers = async (_request: ListUsersRequest, reply: FastifyReply) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 }).limit(50).lean();
    return reply.status(200).send(users);
  } catch (error: unknown) {
    _request.log.error(error, '[User] Failed to list users');
    return reply.status(500).send({ message: 'Unable to list users' });
  }
};

const isDuplicateKeyError = (error: unknown): error is MongoServerError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as MongoServerError).code === 11000
  );
};
