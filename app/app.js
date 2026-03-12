import store from './store.js';

store.init();
let currentSearch = "";

// --- FONCTIONS GLOBALES ---
window.toggleTask = (id) => {
    const task = store.state.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        store.save();
        renderTasks();
    }
};

window.deleteTask = (id) => {
    store.deleteTask(id);
    renderTasks();
};

// --- RENDU ---
function renderTasks(filter = localStorage.getItem('activeFilter') || 'all') {
    const list = document.getElementById('task-list');
    if (!list) return;

    list.innerHTML = '';
    const allTasks = store.state.tasks; 

    const filteredTasks = allTasks.filter(t => {
        const matchesCategory = filter === 'all' || t.category.toLowerCase() === filter.toLowerCase();
        const taskText = (t.text || "").toLowerCase();
        return matchesCategory && taskText.includes(currentSearch.toLowerCase());
    }).sort((a, b) => {
        // 1. On trie d'abord par statut (les non-terminées en premier)
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        // 2. Puis par priorité (de 3 à 1)
        return b.priority - a.priority;
    });
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        const priorityClass = task.priority == 3 ? 'prio-high' : task.priority == 1 ? 'prio-low' : 'prio-med';
        const categoryClass = (task.category || 'général').toLowerCase();
        const dueDateHtml = task.dueDate ? `<span class="due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}">📅 ${formatDate(task.dueDate)}</span>` : '';
        
        li.className = `task-item ${task.completed ? 'completed' : ''} ${priorityClass}`;
        li.setAttribute('data-id', task.id);

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <div class="task-content">
                <span class="category-badge ${categoryClass}">${task.category}</span>
                <div class="task-info">
                    <span class="task-text" ondblclick="window.editTask(${task.id})">${task.text}</span>
                    ${dueDateHtml}
                </div>
            </div>
            <button onclick="deleteTask(${task.id})" class="delete-btn">🗑️</button>
        `;
        list.appendChild(li);
    });

    updateStats();
    updateDashboard();
}

function updateDashboard() {
    const tasks = store.state.tasks;
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    const urgentElement = document.getElementById('urgent-count');

    if (!fill || !text || !urgentElement) return;

    if (tasks.length === 0) {
        fill.style.width = '0%';
        text.innerText = '0% complété';
        urgentElement.innerText = '0';
        return;
    }

    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);
    fill.style.width = `${percent}%`;
    text.innerText = `${percent}% complété`;

    const urgents = tasks.filter(t => t.priority === 3 && !t.completed).length;
    urgentElement.innerText = urgents;
}

function updateStats() {
    const countElement = document.getElementById('task-count');
    if (countElement) {
        const remaining = store.state.tasks.filter(t => !t.completed).length;
        countElement.innerText = remaining;
    }
}

// --- EVENEMENTS ---
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();

    const taskForm = document.getElementById('todo-form');
    if (taskForm) {
        taskForm.onsubmit = (e) => {
            e.preventDefault();
            const text = document.getElementById('task-input').value.trim();
            const category = document.getElementById('category-input').value;
            const priority = document.getElementById('priority-input').value;
            const dueDate = document.getElementById('date-input').value;

            if (text) {
                store.addTask(text, category, priority, dueDate);
                if (priority === "3") sendUrgentNotification(text);
                e.target.reset();
                renderTasks();
            }
        };
    }

    document.getElementById('search-input').oninput = (e) => {
        currentSearch = e.target.value;
        renderTasks();
    };

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            const filter = btn.getAttribute('data-filter');
            localStorage.setItem('activeFilter', filter);
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(filter);
        };
    });

    document.getElementById('enable-notifs').onclick = requestNotifPermission;
    document.getElementById('clear-completed').onclick = () => {
        store.clearCompleted();
        renderTasks();
    };
    const focusBtn = document.getElementById('focus-mode-btn');
if (focusBtn) {
    focusBtn.onclick = () => {
        document.body.classList.toggle('focus-active');
        
        // On change le texte du bouton selon l'état
        if (document.body.classList.contains('focus-active')) {
            focusBtn.innerText = "✖ Quitter Focus";
            // On s'assure qu'on voit bien le bouton pour quitter
            document.getElementById('app').prepend(focusBtn); 
        } else {
            focusBtn.innerText = "🎯 Mode Focus";
            // On le remet à sa place d'origine
            document.querySelector('.header-flex').appendChild(focusBtn);
            renderTasks();
        }
    };
}
});

// --- UTILS ---
function isOverdue(dateString) {
    if (!dateString) return false;
    return new Date(dateString).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

const requestNotifPermission = () => {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") new Notification("FlowOS", { body: "Alertes activées !" });
        });
    }
};

const sendUrgentNotification = (name) => {
    if (Notification.permission === "granted") {
        new Notification("🚨 Urgent", { body: `Tâche critique : ${name}` });
    }
};

// --- EDITION ---
window.editTask = (id) => {
    const taskTextElement = document.querySelector(`li[data-id="${id}"] .task-text`);
    if (!taskTextElement) return;
    const currentText = taskTextElement.innerText;
    taskTextElement.innerHTML = `<input type="text" class="edit-input" id="editing-${id}" value="${currentText}">`;
    const input = document.getElementById(`editing-${id}`);
    input.focus();
    input.onblur = () => window.saveEdit(id, input.value);
    input.onkeydown = (e) => { if (e.key === 'Enter') window.saveEdit(id, input.value); };
};

window.saveEdit = (id, newText) => {
    const task = store.state.tasks.find(t => t.id === id);
    if (task && newText.trim() !== "") {
        task.text = newText;
        store.save();
    }
    renderTasks();
};