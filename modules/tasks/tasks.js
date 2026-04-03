// --- MODULE TÂCHES ---
// Ce fichier gère tout ce qui concerne les tâches

import store from '../../app/store.js';

// Inverser l'état (Fait / À faire)
export function toggleTask(id) {
    const laTache = store.state.tasks.find(t => t.id === id);
    if (laTache) {
        laTache.completed = !laTache.completed;
        store.save();
        renderTasks();
    }
}

// Supprimer une tâche
export function deleteTask(id) {
    store.deleteTask(id);
    renderTasks();
}

// Afficher les tâches
export function renderTasks(filtreActuel = 'all', rechercheEnCours = '') {
    const listeUl = document.getElementById('task-list');
    if (!listeUl) return;

    listeUl.innerHTML = '';
    const toutesLesTaches = store.state.tasks;

    // Filtrage
    const tachesFiltrees = toutesLesTaches.filter(t => {
        const correspondCategorie = (filtreActuel === 'all') || (t.category.toLowerCase() === filtreActuel.toLowerCase());
        const correspondRecherche = t.text.toLowerCase().includes(rechercheEnCours.toLowerCase());
        return correspondCategorie && correspondRecherche;
    });

    // Tri
    tachesFiltrees.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.priority - a.priority;
    });

    // Affichage
    tachesFiltrees.forEach(task => {
        const li = document.createElement('li');
        const classePriorite = task.priority == 3 ? 'prio-high' : task.priority == 1 ? 'prio-low' : 'prio-med';
        const estFinie = task.completed ? 'completed' : '';

        li.className = `task-item ${estFinie} ${classePriorite}`;
        li.setAttribute('data-id', task.id);

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <div class="task-content">
                <span class="category-badge">${task.category}</span>
                <span class="task-text" ondblclick="editTask(${task.id}, this)">${task.text}</span>
            </div>
            <button onclick="deleteTask(${task.id})" class="delete-btn">🗑️</button>
        `;
        listeUl.appendChild(li);
    });

    updateDashboard();
}
// Modifier une tâche au double clic
export function editTask(id, element) {
    // On rend le texte modifiable
    element.contentEditable = true;
    element.focus();

    // On sélectionne tout le texte pour faciliter la modification
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);

    // Quand on appuie sur Entrée, on sauvegarde
    element.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nouveauTexte = element.innerText.trim();
            if (nouveauTexte !== "") {
                store.updateTask(id, nouveauTexte);
            }
            element.contentEditable = false;
        }
    };

    // Quand on clique ailleurs, on sauvegarde aussi
    element.onblur = () => {
        const nouveauTexte = element.innerText.trim();
        if (nouveauTexte !== "") {
            store.updateTask(id, nouveauTexte);
        }
        element.contentEditable = false;
    };
}

// Mettre à jour les stats du dashboard
export function updateDashboard() {
    const tasks = store.state.tasks;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const urgentCount = document.getElementById('urgent-count');
    const remainingCount = document.getElementById('task-count');

    if (tasks.length === 0) return;

    const terminees = tasks.filter(t => t.completed).length;
    const pourcentage = Math.round((terminees / tasks.length) * 100);

    if (progressFill) progressFill.style.width = `${pourcentage}%`;
    if (progressText) progressText.innerText = `${pourcentage}% complété`;

    const urgentes = tasks.filter(t => t.priority === 3 && !t.completed).length;
    if (urgentCount) urgentCount.innerText = urgentes;

    const restantes = tasks.filter(t => !t.completed).length;
    if (remainingCount) remainingCount.innerText = restantes;
}
// Remplir le menu déroulant des projets dans le formulaire des tâches
export function renderProjectOptions() {
    const select = document.getElementById('project-input-task');
    if (!select) return;

    // On garde uniquement l'option "Aucun projet"
    select.innerHTML = '<option value="">Aucun projet</option>';

    // On ajoute un projet par option
    store.state.projects.forEach(projet => {
        const option = document.createElement('option');
        option.value = projet.id;
        option.textContent = projet.name;
        select.appendChild(option);
    });
}