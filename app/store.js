const store = {
    state: {
        tasks: []
    },

    init() {
        const saved = localStorage.getItem('flowos_tasks');
        if (saved) {
            this.state.tasks = JSON.parse(saved);
        }
    },

    save() {
        localStorage.setItem('flowos_tasks', JSON.stringify(this.state.tasks));
    },

    addTask(text, category, priority, dueDate) {
    const newTask = {
        id: Date.now(),
        text: text,
        category: category || "Général",
        priority: parseInt(priority),
        dueDate: dueDate || null, // On stocke la date
        completed: false
    };
    this.state.tasks.push(newTask);
    this.save();
},

    deleteTask(id) {
        this.state.tasks = this.state.tasks.filter(t => t.id !== id);
        this.save();
    },

    clearCompleted() {
        this.state.tasks = this.state.tasks.filter(t => !t.completed);
        this.save();
    }
};

export default store;