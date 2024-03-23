const BASE_URL = 'https://notes-api.dicoding.dev/v2';
const notesListContainer = document.getElementById('notesListContainer');

function hideLoader() {
  const loader = document.getElementById("loader"); 
  
  setTimeout(() => {
    loader.addEventListener("transitionend", () => {
      // Pastikan elemen loader sudah dimasukkan ke dalam DOM
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    });
    loader.classList.add("hidden");
  }, 1000); 


}

function showLoader() {
  // Buat elemen section baru
  const newLoader = document.createElement("section");
  newLoader.setAttribute("id", "loader");

  // Tambahkan elemen loader ke dalam section
  newLoader.innerHTML = `
      <div class="loader"></div>
      <p>Loading</p>
  `;

  // Tambahkan elemen loader ke dalam DOM (misalnya, ke dalam elemen body)
  document.body.appendChild(newLoader);
}

const showResponseMessage = (message = 'Check your internet connection') => {
  if (message === 'Check your internet connection') {
    Swal.fire({
      title: "Message",
      text: message,
    });
  } 
  // else if (message === 'No notes available.') {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve();
  //       Swal.fire({
  //         title: "Message",
  //         text: message,
  //       });
  //     }, 1500);
  //   }); 
  // }
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

};

// Menghapus elemen note yang dipilih
notesListContainer.addEventListener('click', event => {
  if (event.target.classList.contains('fa-trash')) {
    const noteId = event.target.id;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        removeNote(noteId);
        
      }
    });
  }
});

const getNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();
    if (responseJson.error) {
      showResponseMessage(responseJson.message);
    } else {
      if (responseJson.data.length === 0) {
        showResponseMessage("No notes available.");
      } else {
        renderAllNotes(responseJson.data);
      }
    }
  } catch (error) {
    showResponseMessage(error);
  }
  hideLoader()
};

const removeNote = async (noteId) => {
  try {
    const options = {
      method: 'DELETE'
    };

    const response = await fetch(`${BASE_URL}/notes/${noteId}`, options);
    const responseJson = await response.json();
    showLoader();
    showResponseMessage(responseJson.message);
    getNotes();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }, 1500);
    });
    
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

    showLoader();
    const response = await fetch(`${BASE_URL}/notes`, options);
    const responseJson = await response.json();
    showResponseMessage(responseJson.message);
    getNotes();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        Swal.fire({
          title: "Successfull Adding Note!",
          text: "Your file has been added.",
          icon: "success"
        });
      }, 1500);
    });

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

    // Sembunyikan popup dan aktifkan scrolling kembali
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
  });
});

getNotes();