// --- LE MAGASIN DE DONNÉES (STORE) ---
// Ce fichier sert à gérer la liste des tâches (ajouter, supprimer, sauvegarder)

const store = {
    // 1. L'état actuel de nos données
    state: {
        tasks: [],
        projects: [],
        notes: []
    },

    // 2. Initialisation
    init() {
    const donneesSauvegardees = localStorage.getItem('flowos_tasks');
    const projetsSauvegardes = localStorage.getItem('flowos_projects');
    const notesSauvegardees = localStorage.getItem('flowos_notes');

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

    if (notesSauvegardees) {
        this.state.notes = JSON.parse(notesSauvegardees);
    } else {
        this.state.notes = [];
    }
},

    // 3. Sauvegarde
   save() {
    localStorage.setItem('flowos_tasks', JSON.stringify(this.state.tasks));
    localStorage.setItem('flowos_projects', JSON.stringify(this.state.projects));
    localStorage.setItem('flowos_notes', JSON.stringify(this.state.notes));
},

    // 4. Ajouter une tâche
    addTask(contenu, categorie, niveauPriorite, dateEcheance, projetId) {
        const nouvelleTache = {
            id: Date.now(),
            text: contenu,
            category: categorie || "Général",
            priority: parseInt(niveauPriorite),
            dueDate: dateEcheance || null,
            projectId: projetId ? parseInt(projetId) : null,
            completed: false
        };

        this.state.tasks.push(nouvelleTache);
        this.save();
    },

    // 5. Supprimer une tâche
    deleteTask(idTache) {
        this.state.tasks = this.state.tasks.filter(t => t.id !== idTache);
        this.save();
    },

    // 6. Nettoyer les tâches terminées
    clearCompleted() {
        this.state.tasks = this.state.tasks.filter(t => t.completed === false);
        this.save();
    },

    // 7. Modifier une tâche
    updateTask(id, nouveauTexte) {
        const laTache = this.state.tasks.find(t => t.id === id);
        if (laTache) {
            laTache.text = nouveauTexte;
            this.save();
        }
    },

    // 8. Ajouter un projet
    addProject(nom) {
        const nouveauProjet = {
            id: Date.now(),
            name: nom
        };
        this.state.projects.push(nouveauProjet);
        this.save();
    },

    // 9. Supprimer un projet
    deleteProject(id) {
        this.state.projects = this.state.projects.filter(p => p.id !== id);
        this.save();
    },
    // Ajouter une note
addNote(titre, contenu) {
    const nouvelleNote = {
        id: Date.now(),
        title: titre,
        content: contenu || '',
        createdAt: new Date().toISOString()
    };
    this.state.notes.push(nouvelleNote);
    this.save();
},

// Supprimer une note
deleteNote(id) {
    this.state.notes = this.state.notes.filter(n => n.id !== id);
    this.save();
},

// Modifier une note
updateNote(id, nouveauTitre, nouveauContenu) {
    const laNote = this.state.notes.find(n => n.id === id);
    if (laNote) {
        if (nouveauTitre !== null) laNote.title = nouveauTitre;
        if (nouveauContenu !== null) laNote.content = nouveauContenu;
        this.save();
    }
}
};

export default store;