// --- ROUTER (Système de navigation) ---
// Ce fichier gère quelle vue afficher selon l'URL

const router = {

    // Les routes disponibles : nom => id de la section HTML
    routes: {
        'dashboard': 'view-dashboard',
        'tasks':     'view-tasks',
        'projects':  'view-projects',
        'notes':     'view-notes',
        'analytics': 'view-analytics'
    },

    // Naviguer vers une route
   navigate(route) {
    window.location.hash = route;
    localStorage.setItem('lastRoute', route); // On mémorise la dernière page
},

    // Afficher la bonne vue selon le hash de l'URL
   render() {
    // On lit ce qu'il y a après le # dans l'URL
    const hash = window.location.hash.replace('#', '') || 'tasks';

    // On cache toutes les vues
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');

    // On affiche uniquement la bonne
    const idVue = this.routes[hash];
    const vue = document.getElementById(idVue);
    if (vue) vue.style.display = 'block';

    // On met à jour le lien actif dans la sidebar
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('data-route') === hash) {
            a.classList.add('active');
        }
    });

    // Si on est sur la vue tâches, on rafraîchit la liste
    if (hash === 'tasks') {
        const filtreActuel = localStorage.getItem('activeFilter') || 'all';
        const rechercheEnCours = document.getElementById('search-input')?.value || '';
        // On importe renderTasks dynamiquement
        import('../modules/tasks/tasks.js').then(module => {
            module.renderTasks(filtreActuel, rechercheEnCours);
        });
    }
},

    // Démarrer le router
  init() {
    // Si l'URL n'a pas de hash, on reprend la dernière page visitée
    if (!window.location.hash) {
        const dernierePage = localStorage.getItem('lastRoute') || 'tasks';
        window.location.hash = dernierePage;
    }
    window.addEventListener('hashchange', () => this.render());
    this.render();
}
};

export default router;