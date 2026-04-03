import store from './store.js';
import router from './router.js';
import { renderTasks, updateDashboard, toggleTask, deleteTask, editTask, renderProjectOptions } from '../modules/tasks/tasks.js';
import { renderProjects, deleteProject } from '../modules/projects/projects.js';
import { renderNotes, deleteNote, editNote, editNoteContent } from '../modules/notes/notes.js';
import { renderAnalytics } from '../modules/analytics/analytics.js';


// --- INITIALISATION ---
store.init();
let rechercheEnCours = "";
let filtreActuel = localStorage.getItem('activeFilter') || 'all';

// On rend les fonctions accessibles depuis le HTML (les onclick)
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.editTask = editTask;
window.deleteProject = deleteProject;

// --- EVENEMENTS ---
document.addEventListener('DOMContentLoaded', () => {

    // Ajout d'une tâche
    const form = document.getElementById('todo-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const texte = document.getElementById('task-input').value;
        const cat = document.getElementById('category-input').value;
        const prio = document.getElementById('priority-input').value;
        const date = document.getElementById('date-input').value;
        const projetId = document.getElementById('project-input-task').value;

        if (texte.trim() !== "") {
            store.addTask(texte, cat, prio, date, projetId);
            form.reset();
            renderTasks(filtreActuel, rechercheEnCours);
            renderProjectOptions();
        }
    };

    // Recherche
    document.getElementById('search-input').oninput = (e) => {
        rechercheEnCours = e.target.value;
        renderTasks(filtreActuel, rechercheEnCours);
    };

    // Filtres
    const boutonsFiltre = document.querySelectorAll('.filter-btn');
    boutonsFiltre.forEach(btn => {
        btn.onclick = () => {
            filtreActuel = btn.getAttribute('data-filter');
            localStorage.setItem('activeFilter', filtreActuel);
            boutonsFiltre.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(filtreActuel, rechercheEnCours);
        };
    });

    // Nettoyer les tâches terminées
    document.getElementById('clear-completed').onclick = () => {
        store.clearCompleted();
        renderTasks(filtreActuel, rechercheEnCours);
    };

    // Mode Focus
    const btnFocus = document.getElementById('focus-mode-btn');
    btnFocus.onclick = () => {
        document.body.classList.toggle('focus-active');
        const estActif = document.body.classList.contains('focus-active');
        btnFocus.textContent = estActif ? '❌ Quitter Focus' : '🎯 Mode Focus';
    };

    // Gestion du formulaire de projet
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.onsubmit = (e) => {
            e.preventDefault();
            const nom = document.getElementById('project-input').value;
            if (nom.trim() !== "") {
                store.addProject(nom);
                projectForm.reset();
                renderProjects();
            }
        };
    }

    // Premier affichage
    renderTasks(filtreActuel, rechercheEnCours);
    renderProjects();
    renderProjectOptions();
// Gestion du formulaire de notes
const noteForm = document.getElementById('note-form');
if (noteForm) {
    noteForm.onsubmit = (e) => {
        e.preventDefault();
        const titre = document.getElementById('note-title-input').value;
        const contenu = document.getElementById('note-content-input').value;
        if (titre.trim() !== '') {
            store.addNote(titre, contenu);
            noteForm.reset();
            renderNotes();
        }
    };
}

// Premier affichage des notes
renderNotes();
// Premier affichage analytics
renderAnalytics();
// Gestion du dark mode
const themeBtn = document.getElementById('theme-btn');
const themeSauvegarde = localStorage.getItem('theme') || 'dark';

// On applique le thème sauvegardé au démarrage
if (themeSauvegarde === 'light') {
    document.body.classList.add('light-mode');
    themeBtn.textContent = '🌙 Mode Sombre';
}

// Au clic on bascule
themeBtn.onclick = () => {
    document.body.classList.toggle('light-mode');
    const estClair = document.body.classList.contains('light-mode');
    themeBtn.textContent = estClair ? '🌙 Mode Sombre' : '☀️ Mode Clair';
    localStorage.setItem('theme', estClair ? 'light' : 'dark');
};
// Export JSON
document.getElementById('export-btn').onclick = () => {
    const donnees = {
        tasks: store.state.tasks,
        projects: store.state.projects,
        notes: store.state.notes,
        exportDate: new Date().toLocaleDateString('fr-FR')
    };

    // On convertit en texte JSON lisible
    const json = JSON.stringify(donnees, null, 2);

    // On crée un fichier téléchargeable
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // On déclenche le téléchargement
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowos-export.json';
    a.click();

    URL.revokeObjectURL(url);
};
    // Démarrage du router
    router.init();

});
window.filtrerParProjet = (projetId, projetNom) => {
    // On navigue vers la vue tâches
    router.navigate('tasks');
    
    // On attend que la vue soit affichée avant de filtrer
    setTimeout(() => {
        const tachesDuProjet = store.state.tasks.filter(t => t.projectId === projetId);
        const listeUl = document.getElementById('task-list');
        if (!listeUl) return;

        listeUl.innerHTML = '';

        if (tachesDuProjet.length === 0) {
            listeUl.innerHTML = '<p style="color: var(--text-muted)">Aucune tâche pour ce projet.</p>';
        } else {
            tachesDuProjet.forEach(task => {
                const li = document.createElement('li');
                const classePriorite = task.priority == 3 ? 'prio-high' : task.priority == 1 ? 'prio-low' : 'prio-med';
                const estFinie = task.completed ? 'completed' : '';
                li.className = `task-item ${estFinie} ${classePriorite}`;
                li.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <div class="task-content">
                        <span class="category-badge">${task.category}</span>
                        <span class="task-text">${task.text}</span>
                    </div>
                    <button onclick="deleteTask(${task.id})" class="delete-btn">🗑️</button>
                `;
                listeUl.appendChild(li);
            });
        }

        // On met à jour le titre
        document.querySelector('#tasks-section h2').textContent = `Tâches — ${projetNom}`;
    }, 100);
};
window.deleteNote = deleteNote;
window.editNote = editNote;
window.editNoteContent = editNoteContent;