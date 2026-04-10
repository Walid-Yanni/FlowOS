// --- CONFIGURATION DU CLIENT PRISMA ---
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;