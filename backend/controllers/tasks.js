// --- CONTRÔLEUR TASKS AVEC PRISMA ---
const Task = require('../models/tasks.js');

const tasksController = {
    async getAll(req, res) {
        try {
            const taches = await Task.getAll();
            res.json(taches);
        } catch (erreur) {
            res.status(500).json({ message: 'Erreur récupération', erreur: erreur.message });
        }
    },

    async getById(req, res) {
        try {
            const tache = await Task.getById(req.params.id);
            if (!tache) return res.status(404).json({ message: "Non trouvée" });
            res.json(tache);
        } catch (erreur) {
            res.status(500).json({ message: 'Erreur serveur', erreur: erreur.message });
        }
    },

    async create(req, res) {
        try {
            const nouvelleTache = await Task.create(req.body);
            res.status(201).json(nouvelleTache);
        } catch (erreur) {
            res.status(500).json({ message: 'Erreur création', erreur: erreur.message });
        }
    },

    // --- CETTE FONCTION ÉTAIT PEUT-ÊTRE MANQUANTE ---
    async update(req, res) {
        try {
            const result = await Task.update(req.params.id, req.body);
            res.json({ message: '✅ Tâche modifiée !', data: result });
        } catch (erreur) {
            res.status(500).json({ message: 'Erreur modification', erreur: erreur.message });
        }
    },

    async delete(req, res) {
        try {
            await Task.delete(req.params.id);
            res.json({ message: '✅ Tâche supprimée !' });
        } catch (erreur) {
            res.status(500).json({ message: 'Erreur suppression', erreur: erreur.message });
        }
    }
};

module.exports = tasksController;