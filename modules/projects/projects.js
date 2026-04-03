import store from '../../app/store.js';

export function renderProjects() {
    const liste = document.getElementById('projects-list');
    if (!liste) return;

    liste.innerHTML = '';
    const projets = store.state.projects;

    if (projets.length === 0) {
        liste.innerHTML = '<p class="empty-msg">Aucun projet pour l\'instant.</p>';
        return;
    }

    projets.forEach(projet => {
        const div = document.createElement('div');
        div.className = 'project-card';
        div.innerHTML = `
            <div class="project-header">
                <h3>${projet.name}</h3>
                <button onclick="deleteProject(${projet.id})" class="delete-btn">🗑️</button>
            </div>
            <p class="project-task-count">${countTasksForProject(projet.id)} tâche(s)</p>
            <button onclick="filtrerParProjet(${projet.id}, '${projet.name}')" class="filter-project-btn">
                🔍 Voir les tâches
            </button>
        `;
        liste.appendChild(div);
    });
}

function countTasksForProject(projetId) {
    return store.state.tasks.filter(t => t.projectId === projetId).length;
}

export function deleteProject(id) {
    store.deleteProject(id);
    renderProjects();
}