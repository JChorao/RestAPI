const swaggerJsdoc = require('swagger-jsdoc');

// Detecta se está rodando no Azure
const isAzure = process.env.WEBSITE_SITE_NAME;

// Define o URL base dinamicamente
const serverUrl = isAzure
  ? `https://${process.env.WEBSITE_SITE_NAME}.azurewebsites.net`
  : 'http://localhost:3000';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuários',
      version: '1.0.0',
      description: 'Exemplo de REST API com Swagger e Azure',
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
  },
  apis: ['./routes/*.js'], // Onde estão as anotações Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
