// server.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const feedbackRouter = require('./routes/feedback');

const app = express();
app.use(express.json());

// Swagger UI no seu domínio
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Feedback endpoints
app.use('/api/feedback', feedbackRouter);

// Formulário HTML já apontando para o domínio de produção
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><meta charset="UTF-8"><title>Envio de Feedback</title></head>
      <body>
        <form id="feedbackForm">
          <input type="text" name="message" placeholder="Seu feedback" required/>
          <button type="submit">Enviar</button>
        </form>
        <script>
          document.getElementById('feedbackForm')
            .addEventListener('submit', async e => {
              e.preventDefault();
              const message = e.target.message.value;
              await fetch('https://testechorao.azurewebsites.net/api/feedback', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message })
              });
              alert('Feedback enviado!');
            });
        </script>
      </body>
    </html>
  `);
});

// Em produção, o Azure define process.env.PORT automaticamente
const port = process.env.PORT || 3000;
app.listen(port, () => 
  console.log(`Server rodando em https://testechorao.azurewebsites.net (porta ${port})`)
);
