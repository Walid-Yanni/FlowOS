// --- LE MAGASIN DE DONNÉES (STORE) ---
// Ce fichier sert à gérer la liste des tâches (ajouter, supprimer, sauvegarder)

const store = {
    // 1. L'état actuel de nos données (notre tableau de tâches)
    state: {
        tasks: [],
        projects: []
    },

    // 2. Initialisation : On récupère ce qui est stocké dans le navigateur au démarrage
    init() {
    const donneesSauvegardees = localStorage.getItem('flowos_tasks');
    const projetsSauvegardes = localStorage.getItem('flowos_projects');

    if (donneesSauvegardees) {
        this.state.tasks = JSON.parse(donneesSauvegardees);
    } else {
        this.state.tasks = [];
    }

    if (projetsSauvegardes) {
        this.state.projects = JSON.parse(projetsSauvegardes);
    } else {
        this.state.projects = [];
    }
},

    // 3. Sauvegarde : On enregistre le tableau actuel dans le navigateur
    save() {
    localStorage.setItem('flowos_tasks', JSON.stringify(this.state.tasks));
    localStorage.setItem('flowos_projects', JSON.stringify(this.state.projects));
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
    },
    // Modifier le texte d'une tâche
 updateTask(id, nouveauTexte) {
    const laTache = this.state.tasks.find(t => t.id === id);
    if (laTache) {
        laTache.text = nouveauTexte;
        this.save();
    }
   },
   // Ajouter un projet
addProject(nom) {
    const nouveauProjet = {
        id: Date.now(),
        name: nom
    };
    this.state.projects.push(nouveauProjet);
    this.save();
},

// Supprimer un projet
deleteProject(id) {
    this.state.projects = this.state.projects.filter(p => p.id !== id);
    this.save();
}
};

// On exporte le store pour l'utiliser dans app.js
export default store;
