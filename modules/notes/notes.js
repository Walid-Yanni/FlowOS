// --- MODULE NOTES ---
import store from '../../app/store.js';

// Afficher les notes
export function renderNotes() {
    const liste = document.getElementById('notes-list');
    if (!liste) return;

    liste.innerHTML = '';
    const notes = store.state.notes;

    if (notes.length === 0) {
        liste.innerHTML = '<p class="empty-msg">Aucune note pour l\'instant.</p>';
        return;
    }

    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-card';
        div.innerHTML = `
            <div class="note-header">
                <h3 ondblclick="editNote(${note.id}, this)">${note.title}</h3>
                <button onclick="deleteNote(${note.id})" class="delete-btn">🗑️</button>
            </div>
            <p ondblclick="editNoteContent(${note.id}, this)">${note.content}</p>
            <span class="note-date">${formaterDate(note.createdAt)}</span>
        `;
        liste.appendChild(div);
    });
}

// Formater la date
function formaterDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// Supprimer une note
export function deleteNote(id) {
    store.deleteNote(id);
    renderNotes();
}

// Modifier le titre d'une note
export function editNote(id, element) {
    element.contentEditable = true;
    element.focus();
    element.onblur = () => {
        const nouveau = element.innerText.trim();
        if (nouveau !== '') store.updateNote(id, nouveau, null);
        element.contentEditable = false;
    };
}

// Modifier le contenu d'une note
export function editNoteContent(id, element) {
    element.contentEditable = true;
    element.focus();
    element.onblur = () => {
        const nouveau = element.innerText.trim();
        if (nouveau !== '') store.updateNote(id, null, nouveau);
        element.contentEditable = false;
    };
}