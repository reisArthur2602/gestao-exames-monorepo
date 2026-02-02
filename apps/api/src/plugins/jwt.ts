import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { type FastifyInstance } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: "ADMIN" | "MEMBER";
      email: string;
    };
    user: {
      sub: string;
      role: "ADMIN" | "MEMBER";
      email: string;
    };
  }
}

export const jwtPlugin = fp(async (app: FastifyInstance) => {
  app.register(jwt, {
    secret: process.env.JWT_SECRET!,
    sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? "15m" },
  });

  app.decorate("authenticate", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ message: "Não autenticado." });
    }
  });
});

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: any, reply: any) => Promise<void>;
  }
}
