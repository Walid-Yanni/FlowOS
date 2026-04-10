const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import des routes
const tasksRoutes = require('./routes/tasks.js');
app.use('/tasks', tasksRoutes);

app.get('/', (req, res) => {
    res.json({ message: '✅ FlowOS Backend avec Prisma fonctionne !' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});