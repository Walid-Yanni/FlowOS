// --- ROUTES TASKS ---
// Ce fichier définit les URLs disponibles pour les tâches

const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.js');

// GET /tasks — Récupérer toutes les tâches
router.get('/', tasksController.getAll);

// GET /tasks/:id — Récupérer une tâche par son ID
router.get('/:id', tasksController.getById);

// POST /tasks — Créer une tâche
router.post('/', tasksController.create);

// PUT /tasks/:id — Modifier une tâche
router.put('/:id', tasksController.update);

// DELETE /tasks/:id — Supprimer une tâche
router.delete('/:id', tasksController.delete);

module.exports = router;