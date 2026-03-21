import store from './store.js';
import router from './router.js';
import { renderTasks, updateDashboard, toggleTask, deleteTask } from '../modules/tasks/tasks.js';

// --- INITIALISATION ---
store.init();
let rechercheEnCours = "";
let filtreActuel = localStorage.getItem('activeFilter') || 'all';

// On rend les fonctions accessibles depuis le HTML (les onclick)
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

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

        if (texte.trim() !== "") {
            store.addTask(texte, cat, prio, date);
            form.reset();
            renderTasks(filtreActuel, rechercheEnCours);
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

    // Premier affichage
    renderTasks(filtreActuel, rechercheEnCours);

    // Démarrage du router
    router.init();
});