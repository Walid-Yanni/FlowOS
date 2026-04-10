// --- MODÈLE TASKS AVEC PRISMA ---
const prisma = require('../config/prisma');

const Task = {
    async getAll() {
        return await prisma.task.findMany();
    },

    async getById(id) {
        return await prisma.task.findUnique({
            where: { id: parseInt(id) }
        });
    },

    async create(data) {
        return await prisma.task.create({
            data: {
                text: data.text,
                category: data.category || "Général",
                priority: parseInt(data.priority) || 2,
                projectId: data.projectId ? parseInt(data.projectId) : null
            }
        });
    },

    // --- AJOUT DE LA LOGIQUE UPDATE ---
    async update(id, data) {
        return await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                text: data.text,
                category: data.category,
                priority: data.priority ? parseInt(data.priority) : undefined,
                completed: data.completed
            }
        });
    },

    async delete(id) {
        return await prisma.task.delete({
            where: { id: parseInt(id) }
        });
    }
};

module.exports = Task;