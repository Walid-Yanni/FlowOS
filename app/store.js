// --- LE MAGASIN DE DONNÉES (STORE) ---
// Ce fichier sert à gérer la liste des tâches (ajouter, supprimer, sauvegarder)

const store = {
    // 1. L'état actuel de nos données (notre tableau de tâches)
    state: {
        tasks: []
    },

    // 2. Initialisation : On récupère ce qui est stocké dans le navigateur au démarrage
    init() {
        const donneesSauvegardees = localStorage.getItem('flowos_tasks');
        
        if (donneesSauvegardees) {
            // On transforme le texte JSON en véritable tableau JavaScript
            this.state.tasks = JSON.parse(donneesSauvegardees);
        } else {
            // Si rien n'est stocké, on commence avec une liste vide
            this.state.tasks = [];
        }
    },

    // 3. Sauvegarde : On enregistre le tableau actuel dans le navigateur
    save() {
        // On transforme le tableau en texte (JSON) pour que le navigateur puisse le garder
        const texteAEnregistrer = JSON.stringify(this.state.tasks);
        localStorage.setItem('flowos_tasks', texteAEnregistrer);
    },

    // 4. Ajouter une tâche
    addTask(contenu, categorie, niveauPriorite, dateEcheance) {
        const nouvelleTache = {
            id: Date.now(), // On génère un identifiant unique avec l'heure actuelle
            text: contenu,
            category: categorie || "Général",
            priority: parseInt(niveauPriorite), // On s'assure que c'est un nombre
            dueDate: dateEcheance || null,
            completed: false // Par défaut, une tâche n'est pas terminée
        };

        this.state.tasks.push(nouvelleTache); // On l'ajoute au tableau
        this.save(); // On enregistre tout de suite
    },

    // 5. Supprimer une tâche
    deleteTask(idTache) {
        // On ne garde que les tâches qui n'ont PAS l'ID qu'on veut supprimer
        this.state.tasks = this.state.tasks.filter(t => t.id !== idTache);
        this.save();
    },

    // 6. Nettoyer (supprimer toutes les tâches terminées)
    clearCompleted() {
        // On ne garde que les tâches qui ne sont pas finies (completed === false)
        this.state.tasks = this.state.tasks.filter(t => t.completed === false);
        this.save();
    }
};

// On exporte le store pour l'utiliser dans app.js
export default store;