// routes/feedback.js

const express = require('express');
const router = express.Router();
const swaggerSpec = require('../swagger');

const feedbacks = [];

/**
 * Atualiza de forma segura o exemplo do GET /api/feedback no swaggerSpec
 */
function updateSwaggerExample(path, method, statusCode, exampleValue) {
  try {
    const pathDef = swaggerSpec.paths[path];
    if (!pathDef) return;
    const opDef = pathDef[method];
    if (!opDef) return;
    const respDef = opDef.responses[statusCode];
    if (!respDef) return;
    const contentDef = respDef.content && respDef.content['application/json'];
    if (!contentDef) return;
    contentDef.example = exampleValue;
  } catch (err) {
    console.error('Erro ao atualizar Swagger example:', err);
  }
}

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Recebe feedback do formulário
 */

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Recebe feedback do formulário
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Texto do feedback
 *     responses:
 *       200:
 *         description: Feedback recebido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post('/', (req, res) => {
  const { message } = req.body || {};
  if (!message) {
    return res
      .status(400)
      .json({ error: 'O campo message é obrigatório' });
  }

  const newFeedback = {
    id: feedbacks.length + 1,
    message,
    date: new Date().toISOString()
  };
  feedbacks.push(newFeedback);

  // Atualiza o exemplo do GET /api/feedback no Swagger UI
  updateSwaggerExample('/api/feedback', 'get', '200', feedbacks);

  console.log('Feedback recebido:', newFeedback);
  res.json({ status: 'ok', message: newFeedback.message });
});

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Lista todos os feedbacks recebidos
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Lista de feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 */
router.get('/', (req, res) => {
  res.json(feedbacks);
});

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Busca um feedback pelo ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Feedback não encontrado
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const fb = feedbacks.find(f => f.id === id);
  if (!fb) {
    return res
      .status(404)
      .json({ error: 'Feedback não encontrado' });
  }
  res.json(fb);
});

/**
 * @swagger
 * /api/feedback/{id}:
 *   put:
 *     summary: Atualiza um feedback pelo ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback atualizado
 *       404:
 *         description: Feedback não encontrado
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const fb = feedbacks.find(f => f.id === id);
  if (!fb) {
    return res
      .status(404)
      .json({ error: 'Feedback não encontrado' });
  }

  const { message } = req.body || {};
  if (message) fb.message = message;
  res.json({ status: 'ok', feedback: fb });
});

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Remove um feedback pelo ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback removido
 *       404:
 *         description: Feedback não encontrado
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = feedbacks.findIndex(f => f.id === id);
  if (idx === -1) {
    return res
      .status(404)
      .json({ error: 'Feedback não encontrado' });
  }

  const [deleted] = feedbacks.splice(idx, 1);
  res.json({ status: 'ok', deleted });
});

module.exports = router;
