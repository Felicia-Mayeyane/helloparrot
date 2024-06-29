const addBtn = document.getElementById('addBtn');
const main = document.getElementById('main');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const uploadNotesBtn = document.getElementById('uploadNotesBtn');

addBtn.addEventListener('click', () => {
    addNote();
});

saveNotesBtn.addEventListener('click', () => {
    saveNotes();
});

uploadNotesBtn.addEventListener('click', () => {
    uploadNotes();
});

function addNote() {
    const note = document.createElement('div');
    note.classList.add('note');
    note.innerHTML = `
        <div class="icons">
            <i class="fas fa-save" onclick="saveNote(this)"></i>
            <i class="fas fa-trash" onclick="deleteNote(this)"></i>
        </div>
        <textarea></textarea>
    `;
    main.appendChild(note);
}

function saveNote(element) {
    const note = element.parentElement.parentElement;
    const noteContent = note.querySelector('textarea').value;
    console.log('Saving note:', noteContent);
}

function deleteNote(element) {
    const note = element.parentElement.parentElement;
    note.remove();
}

function saveNotes() {
    const notes = document.querySelectorAll('.note textarea');
    const notesData = [];
    notes.forEach(note => {
        notesData.push(note.value);
    });

    const blob = new Blob([JSON.stringify(notesData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function uploadNotes() {
    const notes = document.querySelectorAll('.note textarea');
    const notesData = [];
    notes.forEach(note => {
        notesData.push(note.value);
    });

    try {
        const response = await fetch('/upload-notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notes: notesData }),
        });

        if (response.ok) {
            alert('Notes uploaded successfully!');
        } else {
            alert('Failed to upload notes.');
        }
    } catch (error) {
        console.error('Error uploading notes:', error);
    }
}
