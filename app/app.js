import store from './store.js';

// --- INITIALISATION ---
store.init();
let rechercheEnCours = ""; // Plus clair que currentSearch
let filtreActuel = localStorage.getItem('activeFilter') || 'all';

// --- FONCTIONS POUR LES TACHES (Action sur les données) ---

// Inverser l'état (Fait / À faire)
window.toggleTask = (id) => {
    const laTache = store.state.tasks.find(t => t.id === id);
    if (laTache) {
        laTache.completed = !laTache.completed;
        store.save(); // On enregistre
        renderTasks(); // On rafraîchit l'affichage
    }
};

// Supprimer une tâche
window.deleteTask = (id) => {
    store.deleteTask(id);
    renderTasks();
};

// --- LE RENDU (Affichage sur l'écran) ---

function renderTasks() {
    const listeUl = document.getElementById('task-list');
    if (!listeUl) return;

    listeUl.innerHTML = ''; // On vide la liste avant de la reconstruire
    const toutesLesTaches = store.state.tasks; 

    // 1. On filtre les tâches selon la catégorie ET la recherche
    const tachesFiltrees = toutesLesTaches.filter(t => {
        // Est-ce que la catégorie correspond ?
        const correspondCategorie = (filtreActuel === 'all') || (t.category.toLowerCase() === filtreActuel.toLowerCase());
        
        // Est-ce que le texte contient ce qu'on cherche ?
        const correspondRecherche = t.text.toLowerCase().includes(rechercheEnCours.toLowerCase());

        return correspondCategorie && correspondRecherche;
    });

    // 2. On trie : Les non-terminées en haut, et par priorité (3=Haut, 1=Bas)
    tachesFiltrees.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.priority - a.priority;
    });

    // 3. On crée le HTML pour chaque tâche
    tachesFiltrees.forEach(task => {
        const li = document.createElement('li');
        
        // Gestion des classes CSS simples pour les couleurs
        const classePriorite = task.priority == 3 ? 'prio-high' : task.priority == 1 ? 'prio-low' : 'prio-med';
        const estFinie = task.completed ? 'completed' : '';
        
        li.className = `task-item ${estFinie} ${classePriorite}`;
        li.setAttribute('data-id', task.id);

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

    updateDashboard(); // On met à jour les compteurs en même temps
}

// --- LES COMPTEURS ET STATISTIQUES ---

function updateDashboard() {
    const tasks = store.state.tasks;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const urgentCount = document.getElementById('urgent-count');
    const remainingCount = document.getElementById('task-count');

    if (tasks.length === 0) return;

    // Calcul du pourcentage de progression
    const terminees = tasks.filter(t => t.completed).length;
    const pourcentage = Math.round((terminees / tasks.length) * 100);
    
    if(progressFill) progressFill.style.width = `${pourcentage}%`;
    if(progressText) progressText.innerText = `${pourcentage}% complété`;

    // Calcul des urgences (Prio 3 et non finies)
    const urgentes = tasks.filter(t => t.priority === "3" && !t.completed).length;
    if(urgentCount) urgentCount.innerText = urgentes;

    // Tâches restantes
    const restantes = tasks.filter(t => !t.completed).length;
    if(remainingCount) remainingCount.innerText = restantes;
}

// --- EVENEMENTS (Ce qui se passe quand on clique) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // Au clic sur le formulaire d'ajout
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
            renderTasks();
        }
    };

    // Gestion de la barre de recherche
    document.getElementById('search-input').oninput = (e) => {
        rechercheEnCours = e.target.value;
        renderTasks();
    };

    // Gestion des boutons de FILTRE (CCNA, Stage, Perso)
    const boutonsFiltre = document.querySelectorAll('.filter-btn');
    boutonsFiltre.forEach(btn => {
        btn.onclick = () => {
            // 1. On change le filtre actuel
            filtreActuel = btn.getAttribute('data-filter');
            localStorage.setItem('activeFilter', filtreActuel);

            // 2. On change l'apparence des boutons
            boutonsFiltre.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 3. On recharge la liste
            renderTasks();
        };
    });

    // Nettoyer les tâches terminées
    document.getElementById('clear-completed').onclick = () => {
        store.clearCompleted();
        renderTasks();
    };

    // Lancer le premier affichage
    renderTasks();
});