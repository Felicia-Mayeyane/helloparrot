document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main');
    const addBtn = document.getElementById('addBtn');
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    const uploadNotesBtn = document.getElementById('uploadNotesBtn');

    let notes = [];

    // Load notes from localStorage if available
    if (localStorage.getItem('notes')) {
        notes = JSON.parse(localStorage.getItem('notes'));
        renderNotes();
    }

    // Function to render notes on the page
    function renderNotes() {
        main.innerHTML = '';
        notes.forEach((note, index) => {
            const noteEl = document.createElement('div');
            noteEl.classList.add('note');
            noteEl.innerHTML = `
                <div class="note-header">
                    <h3>${note.title}</h3>
                    <i class="fas fa-trash delete-btn" data-index="${index}"></i>
                </div>
                <div class="note-content">
                    <p>${note.content}</p>
                </div>
            `;
            main.appendChild(noteEl);
        });
    }

    // Event listener for adding a new note
    addBtn.addEventListener('click', () => {
        const newNote = {
            title: 'New Note',
            content: 'Start typing here...'
        };
        notes.push(newNote);
        renderNotes();
        saveNotesLocally();
    });

    // Event delegation for deleting a note
    main.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            notes.splice(index, 1);
            renderNotes();
            saveNotesLocally();
        }
    });

    // Function to save notes to localStorage
    function saveNotesLocally() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // Event listener for saving notes
    saveNotesBtn.addEventListener('click', () => {
        alert('Notes saved locally!');
        saveNotesLocally();
    });

    // Event listener for uploading notes
    uploadNotesBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/upload-notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notes })
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Upload successful:', data);
                alert('Notes uploaded successfully!');
            } else {
                console.error('Upload failed:', response.statusText);
                alert('Failed to upload notes.');
            }
        } catch (error) {
            console.error('Error uploading notes:', error);
            alert('Error uploading notes.');
        }
    });
});