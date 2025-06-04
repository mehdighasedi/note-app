const listNameInput = document.getElementById("listName");
const listDescriptionInput = document.getElementById("listDescription");
const addListButton = document.querySelector(".btnAddList");
const listItemsContainer = document.querySelector(".list-items");
const searchInput = document.querySelector(".search-input");
const filterSelect = document.querySelector(".filter-select");
const sortSelect = document.querySelector(".sort-select");

let notes = [];
let filteredNotes = [];

function createNote(title, description) {
  const note = {
    id: Date.now(),
    title,
    description,
    createdAt: new Date().toISOString().split("T")[0],
    isCompleted: false,
  };
  notes.push(note);
  applyFiltersAndDisplay();
}

function applyFiltersAndDisplay() {
  const filterValue = filterSelect.value;
  filteredNotes = notes.filter((note) => {
    if (filterValue === "all") return true;
    if (filterValue === "completed") return note.isCompleted;
    return true;
  });

  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm) {
    filteredNotes = filteredNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.description.toLowerCase().includes(searchTerm),
    );
  }

  const sortValue = sortSelect.value;
  filteredNotes.sort((a, b) => {
    switch (sortValue) {
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      default:
        return b.id - a.id;
    }
  });

  displayNotes();
}

function displayNotes() {
  listItemsContainer.innerHTML = "";

  const notesToDisplay = filteredNotes.length > 0 ? filteredNotes : notes;

  if (notesToDisplay.length === 0) {
    listItemsContainer.innerHTML = `
            <li class="empty-list">No items in the list</li>
        `;
    return;
  }

  notesToDisplay.forEach((note) => {
    const noteElement = `
            <li class="list-item ${note.isCompleted ? "completed" : "uncompleted"}">
                <div class="list-item-content">
                    <div class="list-item-info">
                        <h3 class="list-item-title">${note.title}</h3>
                        <p class="list-item-description">${note.description}</p>
                        <span class="list-item-status">${
                          note.isCompleted ? "Completed" : "Uncompleted"
                        }</span>
                        <span class="list-item-date">Created At ${note.createdAt}</span>
                    </div>
                </div>
                <div class="list-item-actions">
                    <button class="btnComplete" onclick="toggleComplete(${note.id})">${
      note.isCompleted ? "Undo" : "Complete"
    }</button>
                    <button class="btnDelete" onclick="deleteNote(${note.id})">Delete</button>
                </div>
            </li>
        `;
    listItemsContainer.innerHTML += noteElement;
  });
}

function toggleComplete(id) {
  const note = notes.find((note) => note.id === id);
  if (note) {
    note.isCompleted = !note.isCompleted;
    applyFiltersAndDisplay();
  }
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  applyFiltersAndDisplay();
}

addListButton.addEventListener("click", () => {
  const title = listNameInput.value.trim();
  const description = listDescriptionInput.value.trim();

  if (title && description) {
    createNote(title, description);

    listNameInput.value = "";
    listDescriptionInput.value = "";
  } else {
    alert("Please fill in both title and description");
  }
});

searchInput.addEventListener("input", applyFiltersAndDisplay);
filterSelect.addEventListener("change", applyFiltersAndDisplay);
sortSelect.addEventListener("change", applyFiltersAndDisplay);

applyFiltersAndDisplay();
