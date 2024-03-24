const BASE_URL = "https://notes-api.dicoding.dev/v2";
const notesListContainer = document.getElementById("notesListContainer");

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
  }, 500);
}

function showLoader() {
  const newLoader = document.createElement("section");
  newLoader.setAttribute("id", "loader");

  newLoader.innerHTML = `
      <div class="loader"></div>
      <p>Loading</p>
  `;

  document.body.appendChild(newLoader);
}

function generateNote(title, body) {
  return {
    title: title,
    body: body,
  };
}

function seeArchive() {
  const archiveBox = document.createElement("li");
  archiveBox.classList.add("archive-box");
  archiveBox.innerHTML = `
      <div class="icon"><i class="fa-solid fa-inbox"></i></div>
      <p>See Archived Note</p>`;
  notesListContainer.appendChild(archiveBox);

  archiveBox.addEventListener("click", () => {
    getArchivedNotes();
  });
}

const showResponseMessage = (message = "Check your internet connection") => {
  if (message === "Check your internet connection") {
    Swal.fire({
      title: "Message",
      text: message,
    });
  } else if (message === "No notes available.") {
    return;
  } else {
    Swal.fire({
      title: "Message",
      text: message,
    });
  }
};

function loadAddBoxEventListener() {
  const addBox = document.createElement("li");
  addBox.classList.add("add-box");
  addBox.innerHTML = `
      <div class="icon"><i class="fa-solid fa-plus"></i></div>
      <p>Add new note</p>`;
  notesListContainer.appendChild(addBox);

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

const getNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();
    if (responseJson.error) {
      showResponseMessage(responseJson.message);
    } else {
      if (responseJson.data.length === 0) {
        showResponseMessage("No notes available.");
        renderAllNotes(responseJson.data);
      } else {
        renderAllNotes(responseJson.data);
      }
    }
  } catch (error) {
    showResponseMessage(error);
  }
  hideLoader();
};

const removeNote = async (noteId) => {
  try {
    const options = {
      method: "DELETE",
    };

    const response = await fetch(`${BASE_URL}/notes/${noteId}`, options);
    const responseJson = await response.json();
    showLoader();
    getNotes();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }, 1000);
    });
  } catch (error) {
    showResponseMessage(error);
  }
};

const addNote = async (note) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    };

    showLoader();
    const response = await fetch(`${BASE_URL}/notes`, options);
    const responseJson = await response.json();
    getNotes();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        Swal.fire({
          title: "Successfull Adding Note!",
          text: "Your file has been added.",
          icon: "success",
        });
      }, 1000);
    });
  } catch (error) {
    showResponseMessage(error);
  }
};

const archiveNote = async (noteId) => {
  try {
    const options = {
      method: "POST",
    };

    const response = await fetch(
      `${BASE_URL}/notes/${noteId}/archive`,
      options,
    );
    const responseJson = await response.json();
    showLoader();
    getNotes();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        Swal.fire({
          title: "Note Archived!",
          text: "Your Note has been Archived.",
          icon: "success",
        });
      }, 1000);
    });
  } catch (error) {
    showResponseMessage(error);
  }
};

const unarchiveNote = async (noteId) => {
  try {
    const options = {
      method: "POST",
    };

    const response = await fetch(
      `${BASE_URL}/notes/${noteId}/unarchive`,
      options,
    );
    const responseJson = await response.json();
    getArchivedNotes();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        Swal.fire({
          title: "Note Unarchived!",
          text: "Your Note has been Unarchived.",
          icon: "success",
        });
      }, 1000);
    });
  } catch (error) {
    showResponseMessage(error);
  }
};

const getArchivedNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const responseJson = await response.json();
    showLoader();
    if (responseJson.error) {
      showResponseMessage(responseJson.message);
    } else {
      if (responseJson.data.length === 0) {
        showResponseMessage("No archived notes available.");
        renderArchivedNotes(responseJson.data);
      } else {
        renderArchivedNotes(responseJson.data);
      }
    }
  } catch (error) {
    showResponseMessage(error);
  }
};

const renderAllNotes = (notesData) => {
  notesListContainer.innerHTML = "";
  loadAddBoxEventListener();
  seeArchive();

  notesData.forEach((note) => {
    const noteElement = document.createElement("li");
    noteElement.classList.add("card");
    noteElement.innerHTML = `
      <div class="details">
        <p>${note.title}</p>
        <span>${note.body}</span>
      </div>
      <div class="bottom-content">
        <span>${new Date(note.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        <div class="settings">
            <i class="fa-solid fa-ellipsis"></i>
            <ul class="menu">
                <li class="archive" id="${note.id}"><i class="fa-solid archive fa-inbox"></i>Archive Note</li>
                <li class="delete" id="${note.id}"> <i class="fa-solid delete fa-trash"></i>Delete Note</li>
            </ul>
        </div>`;
    notesListContainer.appendChild(noteElement);
  });
};

const renderArchivedNotes = (archivedNotesData) => {
  hideLoader();
  notesListContainer.innerHTML = "";
  const backButton = document.createElement("li");
  backButton.classList.add("archive-box");
  backButton.innerHTML = `
    <div class="icon"><i class="fa-solid fa-arrow-left"></i></div>
    <p>Back to Notes</p>`;
  notesListContainer.appendChild(backButton);

  backButton.addEventListener("click", () => {
    showLoader();
    getNotes();
  });

  archivedNotesData.forEach((note) => {
    const noteElement = document.createElement("li");
    noteElement.classList.add("card");
    noteElement.innerHTML = `
      <div class="details">
        <p>${note.title}</p>
        <span>${note.body}</span>
      </div>
      <div class="bottom-content">
        <span>${new Date(note.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        <div class="settings">
            <i class="fa-solid fa-ellipsis"></i>
            <ul class="menu">
                <li class="unarchive" id="${note.id}"><i class="fa-solid unarchive fa-inbox"></i>Unarchive Note</li>
                <li class="delete" id="${note.id}"> <i class="fa-solid delete fa-trash"></i>Delete Note</li>
            </ul>
        </div>`;
    notesListContainer.appendChild(noteElement);
  });
};

// Show Menu
notesListContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-ellipsis")) {
    const elem = event.target;
    elem.parentElement.classList.add("show");
    document.addEventListener("click", (e) => {
      if (e.target.tagName != "I" || e.target != elem) {
        elem.parentElement.classList.remove("show");
      }
    });
  }
});

// Delete Note
notesListContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    const noteId = event.target.id;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeNote(noteId);
      }
    });
  }
});

// Archive Note
notesListContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("archive")) {
    const noteId = event.target.id;
    Swal.fire({
      title: "Archive Note",
      text: "You want to archive this note?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, archive it!",
    }).then((result) => {
      if (result.isConfirmed) {
        archiveNote(noteId);
      }
    });
  }
});

// Unarchive Note
notesListContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("unarchive")) {
    const noteId = event.target.id;
    Swal.fire({
      title: "Unarchive Note",
      text: "You want to Unarchive this note?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Unarchive!",
    }).then((result) => {
      if (result.isConfirmed) {
        unarchiveNote(noteId);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inputNote");
  const popupBox = document.querySelector(".popup-box");
  const errorTitle = document.getElementById("validationTitle");
  const errorDescription = document.getElementById("validationDescription");
  const titleInput = document
    .querySelector("custom-input-title")
    .shadowRoot.querySelector("input");
  const descriptionTextarea = document
    .querySelector("custom-textarea")
    .shadowRoot.querySelector("textarea");
  const closeIcon = popupBox.querySelector("header i");

  closeIcon.addEventListener("click", () => {
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
  });

  loadAddBoxEventListener();
  seeArchive();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = titleInput.value;
    const body = descriptionTextarea.value;

    if (!title.trim() || !body.trim()) {
      errorTitle.textContent = titleInput.validity.valueMissing
        ? "Field is required."
        : "";
      errorDescription.textContent = descriptionTextarea.validity.valueMissing
        ? "Field is required."
        : "";
      return;
    }

    const notesObject = generateNote(title, body);
    addNote(notesObject);
    titleInput.value = "";
    descriptionTextarea.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
  });
});

getNotes();