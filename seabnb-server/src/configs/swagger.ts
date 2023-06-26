import swaggerJsdoc from "swagger-jsdoc"
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./routers/**.js', './routers/**.ts'], // files containing annotations as above
};

export const openapiSpecification = swaggerJsdoc(options);