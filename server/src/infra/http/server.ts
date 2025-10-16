import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { env } from "@/env";
import { hasZodFastifySchemaValidationErrors, jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { transformSwaggerSchema } from "./transform-swagger-schema";
import { getLinksRoute } from "./routes/get-links";
import { createLinkRoute } from "./routes/create-link";
import { removeLinkRoute } from "./routes/remove-link";
import { incrementLinkAccessCountRoute } from "./routes/increment-link-access-count";
import { getOriginalUrlRoute } from "./routes/get-original-url";
import { exportLinksRoute } from "./routes/export-links";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({ message: "Validation error.", issues: error.validation });
  }

  return reply.status(500).send({ message: "Internal server error." });
});

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

server.register(fastifyMultipart);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brevly API',
      description: 'API para o projeto Brevly',
      version: '1.0.0'
    }
  },
  transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

server.register(getLinksRoute);
server.register(getOriginalUrlRoute);
server.register(createLinkRoute);
server.register(removeLinkRoute);
server.register(incrementLinkAccessCountRoute);
server.register(exportLinksRoute);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on http://localhost:3333");
});
