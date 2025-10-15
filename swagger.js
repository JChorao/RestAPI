// swagger.js
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Feedback API',
      version: '1.0.0',
      description: 'API para envio de feedbacks'
    },
    servers: [
      // força o URL do Azure como padrão
      { url: 'https://testechorao.azurewebsites.net' }
    ]
  },
  apis: [path.join(__dirname, 'routes/*.js')]
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
