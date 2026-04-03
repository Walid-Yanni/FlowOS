// --- MODULE ANALYTICS ---
import store from '../../app/store.js';

export function renderAnalytics() {
    const tasks = store.state.tasks;
    const projects = store.state.projects;
    const notes = store.state.notes;

    // Calculs
    const totalTaches = tasks.length;
    const terminees = tasks.filter(t => t.completed).length;
    const restantes = totalTaches - terminees;
    const tauxCompletion = totalTaches === 0 ? 0 : Math.round((terminees / totalTaches) * 100);

    // Conteneur principal
    const container = document.getElementById('analytics-container');
    if (!container) return;

    container.innerHTML = `
        <div class="analytics-grid">

            <div class="analytics-card">
                <span class="analytics-label">Total Tâches</span>
                <span class="analytics-value">${totalTaches}</span>
            </div>

            <div class="analytics-card">
                <span class="analytics-label">Terminées</span>
                <span class="analytics-value" style="color: var(--success)">${terminees}</span>
            </div>

            <div class="analytics-card">
                <span class="analytics-label">Restantes</span>
                <span class="analytics-value" style="color: var(--warning)">${restantes}</span>
            </div>

            <div class="analytics-card">
                <span class="analytics-label">Projets</span>
                <span class="analytics-value" style="color: var(--accent)">${projects.length}</span>
            </div>

            <div class="analytics-card">
                <span class="analytics-label">Notes</span>
                <span class="analytics-value" style="color: var(--accent)">${notes.length}</span>
            </div>

        </div>

        <div class="analytics-progress">
            <h3>Taux de complétion global</h3>
            <div class="progress-bar-container">
                <div class="progress-fill" style="width: ${tauxCompletion}%"></div>
            </div>
            <span>${tauxCompletion}% complété</span>
        </div>

        <div class="analytics-projects">
            <h3>Tâches par projet</h3>
            ${renderTasksParProjet(tasks, projects)}
        </div>
    `;
}

// Tâches par projet
function renderTasksParProjet(tasks, projects) {
    if (projects.length === 0) return '<p class="empty-msg">Aucun projet créé.</p>';

    return projects.map(projet => {
        const tachesProjet = tasks.filter(t => t.projectId === projet.id);
        const terminees = tachesProjet.filter(t => t.completed).length;
        const total = tachesProjet.length;
        const pourcentage = total === 0 ? 0 : Math.round((terminees / total) * 100);

        return `
            <div class="project-analytics">
                <span>${projet.name}</span>
                <div class="progress-bar-container">
                    <div class="progress-fill" style="width: ${pourcentage}%"></div>
                </div>
                <span>${terminees}/${total} tâches</span>
            </div>
        `;
    }).join('');
}