import fp from "fastify-plugin";
import swagger from "@fastify/swagger";

import { jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifyApiReference from "@scalar/fastify-api-reference";

export const docsPlugin = fp(async (app) => {
  app.register(swagger, {
    openapi: {
      info: {
        title: "Portal Master — API",
        version: "0.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifyApiReference, {
    routePrefix: "/docs",
  });
});
