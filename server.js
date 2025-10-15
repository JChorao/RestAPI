// server.js

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const feedbackRouter = require('./routes/feedback');

const app = express();
app.use(express.json());

// Rotas da API
app.use('/api/feedback', feedbackRouter);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota raiz com formulário HTML
app.get('/', (req, res) => {
  res.send(`
    <h1>Formulário de Feedback</h1>
    <form id="feedbackForm">
      Diga o que achou da Apresentacao: <input type="text" name="fname" id="fname">
      <input type="submit" value="Enviar">
    </form>
    <script>
      const form = document.getElementById('feedbackForm');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = document.getElementById('fname').value;
        if (!message) {
          alert("O campo deve ser preenchido!");
          return;
        }
        // Envia o feedback para a API
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        const data = await response.json();
        alert("Feedback enviado: " + data.message);
      });
    </script>
  `);
});

// ✅ O Azure define automaticamente process.env.PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  if (process.env.WEBSITE_SITE_NAME) {
    console.log(`🌐 Executando no ambiente Azure: ${process.env.WEBSITE_SITE_NAME}`);
  } else {
    console.log("💻 Executando localmente");
  }
});
