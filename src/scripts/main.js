import "./popup.js";
import "./components.js";

const notesData = [
  {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome to Notes, Dimas!",
    body: "Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.",
    createdAt: "2022-07-28T10:03:12.594Z",
    archived: false,
  },
  {
    id: "notes-aB-cdefg12345",
    title: "Meeting Agenda",
    body: "Discuss project updates and assign tasks for the upcoming week.",
    createdAt: "2022-08-05T15:30:00.000Z",
    archived: false,
  },
  {
    id: "notes-XyZ-789012345",
    title: "Shopping List",
    body: "Milk, eggs, bread, fruits, and vegetables.",
    createdAt: "2022-08-10T08:45:23.120Z",
    archived: false,
  },
  {
    id: "notes-1a-2b3c4d5e6f",
    title: "Personal Goals",
    body: "Read two books per month, exercise three times a week, learn a new language.",
    createdAt: "2022-08-15T18:12:55.789Z",
    archived: false,
  },
  {
    id: "notes-LMN-456789",
    title: "Recipe: Spaghetti Bolognese",
    body: "Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...",
    createdAt: "2022-08-20T12:30:40.200Z",
    archived: false,
  },
  {
    id: "notes-QwErTyUiOp",
    title: "Workout Routine",
    body: "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.",
    createdAt: "2022-08-25T09:15:17.890Z",
    archived: false,
  },
  {
    id: "notes-abcdef-987654",
    title: "Book Recommendations",
    body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
    createdAt: "2022-09-01T14:20:05.321Z",
    archived: false,
  },
  {
    id: "notes-zyxwv-54321",
    title: "Daily Reflections",
    body: "Write down three positive things that happened today and one thing to improve tomorrow.",
    createdAt: "2022-09-07T20:40:30.150Z",
    archived: false,
  },
  {
    id: "notes-poiuyt-987654",
    title: "Travel Bucket List",
    body: "1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA",
    createdAt: "2022-09-15T11:55:44.678Z",
    archived: false,
  },
  {
    id: "notes-asdfgh-123456",
    title: "Coding Projects",
    body: "1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project",
    createdAt: "2022-09-20T17:10:12.987Z",
    archived: false,
  },
  {
    id: "notes-5678-abcd-efgh",
    title: "Project Deadline",
    body: "Complete project tasks by the deadline on October 1st.",
    createdAt: "2022-09-28T14:00:00.000Z",
    archived: false,
  },
  {
    id: "notes-9876-wxyz-1234",
    title: "Health Checkup",
    body: "Schedule a routine health checkup with the doctor.",
    createdAt: "2022-10-05T09:30:45.600Z",
    archived: false,
  },
  {
    id: "notes-qwerty-8765-4321",
    title: "Financial Goals",
    body: "1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.",
    createdAt: "2022-10-12T12:15:30.890Z",
    archived: false,
  },
  {
    id: "notes-98765-54321-12345",
    title: "Holiday Plans",
    body: "Research and plan for the upcoming holiday destination.",
    createdAt: "2022-10-20T16:45:00.000Z",
    archived: false,
  },
  {
    id: "notes-1234-abcd-5678",
    title: "Language Learning",
    body: "Practice Spanish vocabulary for 30 minutes every day.",
    createdAt: "2022-10-28T08:00:20.120Z",
    archived: false,
  },
];

// function animation(){
//   const card = document.getElementById('card');

//   card.addEventListener('mouseenter', () => {
//     gsap.to(card, { duration: 0.3, scale: 1.1 });
//   });

//   card.addEventListener('mouseleave', () => {
//     gsap.to(card, { duration: 0.3, scale: 1 });
//   });
// }

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

document.addEventListener("DOMContentLoaded", function () {
  loadAddBoxEventListener();
});

function loadNotes() {
  const notesListContainer = document.getElementById("notesListContainer");

  notesListContainer.innerHTML = "";

  // Tambahkan kembali elemen add-box setelah menambahkan catatan
  const addBox = document.createElement("li");
  addBox.classList.add("add-box");
  addBox.innerHTML = `
      <div class="icon"><i class="fa-solid fa-plus"></i></div>
      <p>Add new note</p>`;
  notesListContainer.appendChild(addBox);

  const archiveBox = document.createElement("li");
  archiveBox.classList.add("archive-box");
  archiveBox.innerHTML = `
      <div class="icon"><i class="fa-solid fa-inbox"></i></div>
      <p>See Archived Note</p>`;
  notesListContainer.appendChild(archiveBox);

  archiveBox.addEventListener("click", () => {
    window.location.href = "archive.html";
  });

  // Menambahkan catatan ke dalam notesListContainer
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
              <div class="delete">
                <i onclick="delete(this)" class="fa-solid fa-trash"></i> 
              </div>
          </div>`;
    notesListContainer.appendChild(noteElement);
  });

  // Tambahkan kembali event listener ke elemen add-box
  loadAddBoxEventListener();
}

function generateNote(title, body) {
  return {
    id: `notes-${Math.random().toString(36).substring(2, 9)}`,
    title: title,
    body: body,
    createdAt: new Date().toISOString(),
    archived: false,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  loadNotes();
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

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value;
    const body = descriptionTextarea.value;

    // Periksa apakah input terisi atau tidak
    if (!title.trim() || !body.trim()) {
      errorTitle.textContent = titleInput.validity.valueMissing
        ? "Field is required."
        : "";
      errorDescription.textContent = descriptionTextarea.validity.valueMissing
        ? "Field is required."
        : "";
      return;
    }

    // Periksa apakah catatan dengan judul yang sama sudah ada
    const existingNoteIndex = notesData.findIndex(
      (note) => note.title === title,
    );
    if (existingNoteIndex !== -1) {
      errorTitle.textContent = "A note with the same title already exists.";
      return;
    }

    const notesObject = generateNote(title, body);
    notesData.push(notesObject);
    loadNotes();

    titleInput.value = "";
    descriptionTextarea.value = "";
    alert("Successfull Add Note");

    // Sembunyikan popup dan aktifkan scrolling kembali
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
  });
});
