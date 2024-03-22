const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const showResponseMessage = (message = 'Check your internet connection') => {
  alert(message);
};

function loadAddBoxEventListener() {
  const addBox = document.querySelector(".add-box");
  addBox.addEventListener("click", () => {
    const popupBox = document.querySelector(".popup-box");
    const popupTitle = popupBox.querySelector("header p");
    const addBtn = popupBox.querySelector("button");

    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
  });
}

const renderAllNotes = (notesData) => {
  const notesListContainer = document.getElementById('notesListContainer');

  notesListContainer.innerHTML = '';

  // Tambahkan kembali elemen add-box setelah menambahkan catatan
  const addBox = document.createElement('li');
  addBox.classList.add('add-box');
  addBox.innerHTML = `
      <div class="icon"><i class="fa-solid fa-plus"></i></div>
      <p>Add new note</p>`;
  notesListContainer.appendChild(addBox);

  // Mendapatkan Seluruh Notes
  notesData.forEach(note => {
    const noteElement = document.createElement('li')
    noteElement.classList.add('note');
    noteElement.innerHTML = `
      <div class="details">
        <p>${note.title}</p>
        <span>${note.body}</span>
      </div>
      <div class="bottom-content">
        <span>${new Date(note.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <div class="delete">
          <i id="${note.id}" class="fa-solid fa-trash"></i>
        </div>
      </div>`;
    notesListContainer.appendChild(noteElement);
    });

    loadAddBoxEventListener();

    // Menghapus elemen note yang dipilih
    notesListContainer.addEventListener('click', event => {
      if (event.target.classList.contains('fa-trash')) {
        const noteId = event.target.id;
        const confirmation = confirm("Are you sure to delete this note?");
        if (confirmation) {
          removeNote(noteId);
        }
      }
    });
};

const getNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();
    console.log(responseJson);
    if (responseJson.error) {
      showResponseMessage(responseJson.message);
    } else {
      if (responseJson.data.length === 0) {
        // showResponseMessage("No notes available.");
        console.log("No notes available.");
      } else {
        renderAllNotes(responseJson.data);
      }
    }
  } catch (error) {
    showResponseMessage(error);
  }
};

const removeNote = async (noteId) => {
  try {
    const options = {
      method: 'DELETE'
    };

    const response = await fetch(`${BASE_URL}/notes/${noteId}`, options);
    const responseJson = await response.json();

    showResponseMessage(responseJson.message);
    getNotes();
  } catch (error) {
    showResponseMessage(error);
  }
};

const addNote = async (note) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note)
    };
 
    const response = await fetch(`${BASE_URL}/notes`, options);
    const responseJson = await response.json();
    showResponseMessage(responseJson.message);
    getNotes();
  } catch (error) {
    showResponseMessage(error);
  }
};

function generateNote(title,body){
  return{
      title: title,
      body: body,
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('inputNote');
  const popupBox = document.querySelector('.popup-box');
  const errorTitle = document.getElementById('validationTitle');
  const errorDescription = document.getElementById('validationDescription');
  const titleInput = document.querySelector('custom-input-title').shadowRoot.querySelector('input');
  const descriptionTextarea = document.querySelector('custom-textarea').shadowRoot.querySelector('textarea');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = titleInput.value;
    const body = descriptionTextarea.value;
    
    // Periksa apakah input terisi atau tidak
    if (!title.trim() || !body.trim()) {
        errorTitle.textContent = titleInput.validity.valueMissing ? 'Field is required.' : '';
        errorDescription.textContent = descriptionTextarea.validity.valueMissing ? 'Field is required.' : '';
        return;
    }

    const notesObject = generateNote(title, body);
    addNote(notesObject);
    titleInput.value = '';
    descriptionTextarea.value = '';
    alert('Successfull Add Note')

    // Sembunyikan popup dan aktifkan scrolling kembali
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
  });
});

const manualNambah = async () => {
  try {
    // Data catatan yang akan ditambahkan secara manual
    const noteData = {
      title: "Hello, Notes!",
      body: "My new notes."
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData)
    };

    const response = await fetch(`${BASE_URL}/notes`, options);
    const responseJson = await response.json();
    
    // Memeriksa jika respons memiliki properti data
    if (responseJson.data) {
      const addedNote = responseJson.data; 
      console.log('New note added:', addedNote);
    }

    showResponseMessage(responseJson.message);
    getNotes();
  } catch (error) {
    showResponseMessage(error);
  }
};

getNotes();