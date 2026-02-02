import Fastify from "fastify";
import { jwtPlugin } from "./plugins/jwt.js";
import { docsPlugin } from "./plugins/docs.js";
import { prismaPlugin } from "./plugins/prisma.js";
import { authRoutes } from "./modules/auth/auth.routes.js";

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyRateLimit from "@fastify/rate-limit";
import { errorHandler } from "./errors/index.js";

export async function buildApp() {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  app.register(fastifyRateLimit, {
    max: 20,
    timeWindow: "1 minute",
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);

  await app.register(prismaPlugin);
  await app.register(jwtPlugin);
  await app.register(docsPlugin);

  await app.register(authRoutes, { prefix: "/auth" });

  return app;
}
