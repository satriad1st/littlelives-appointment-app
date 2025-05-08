import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import appMeta from "@@/package.json";

const fileExtension = process.env.NODE_ENV == "production" ? "js" : "ts";
const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: appMeta.name,
      version: appMeta.version,
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, `../routes/*.${fileExtension}`),
    path.resolve(__dirname, `../routes/admin/*.${fileExtension}`)
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerRouter = swaggerUi.serve;
export const swaggerOptions = swaggerUi.setup(swaggerSpec);
