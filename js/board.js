let tasks = [];
let categorys = [];
let contacts = [];
let cardOpened = false;
let currentContact;
let inAnim = false;
let currentDraggedElement;
let timer = false;
let duration = 500;
let board = true;

/**
 * Description: Loads data from the backend and initializes various variables.
 */
async function loadBackend() {
  setURL(
    "https://peter-wallbaum.developerakademie.net/JOIN-2.0/smallest_backend_ever"
  );
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem("tasks")) || [];
  categorys = JSON.parse(backend.getItem("categorys")) || [];
  contacts = JSON.parse(backend.getItem("contacts")) || [];
  savedTaskStatus = JSON.parse(localStorage.getItem("savedTaskStatus")) || [];
  loadTasks();
}

/**
 * Description: Saves the task status from the board to localStorage and displays an overlay for adding tasks.
 * @param {object[]} savedTaskStatus - An array containing saved task status.
 */
function saveTaskStatusFromBoard(savedTaskStatus) {
  savedTaskStatus[0] = savedTaskStatus;
  localStorage.setItem(`savedTaskStatus`, JSON.stringify(savedTaskStatus));
  let overlay = document.getElementById("overlay");
  body.classList.add("overflow-hidden");
  setInterval(() => {
    checkAddTaskToBoardContainer();
  }, 600);
  overlay.classList.remove("d-none");
  overlay.classList.add("overlay-bg");
  overlay.classList.add("overlay-bg-white");
  overlay.innerHTML = renderAddTaskFromBoard();
  initAddTask();
}

/**
 * Description: Checks and adjusts the display of the header menu container based on screen width.
 */
function checkAddTaskToBoardContainer() {
  if (document.getElementById("add-task-byboard-container")) {
    let headerMenu = document.getElementById("header-menu-container");
    if (window.innerWidth <= 1000) {
      headerMenu.classList.add("d-none");
    } else {
      headerMenu.classList.remove("d-none");
    }
  }
}

/**
 * Description: Closes the editing task on the board.
 */
function closeEditTaskOnBoard() {
  body.classList.remove("overflow-hidden");
  let overlay = document.getElementById("overlay");
  overlay.classList.add("d-none");
  overlay.classList.remove("overlay-bg");
  overlay.classList.remove("overlay-bg-white");
  document.getElementById("header-menu-container").classList.remove("d-none");
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Description: Clears the content of task containers and triggers the task filtering backend process.
 */
function loadTasks() {
  document.getElementById("toDo-container").innerHTML = "";
  document.getElementById("inProgress-container").innerHTML = "";
  document.getElementById("awaitingFeedback-container").innerHTML = "";
  document.getElementById("done-container").innerHTML = "";
  filterTasks();
}

/**
 * Description: Filters and displays tasks based on their status.
 */
function filterTasks() {
  for (let i = 0; i < tasks.length; i++) {
    let currentTask = tasks[i];
    let content = document.getElementById(`${currentTask.status}-container`);
    forwardTaskContent(currentTask, content, i);
  }
}

/**
 * Description: Deletes a task at the specified index and updates the data in the backend.
 * @param {number} i - The index of the task to delete.
 */
async function deleteTask(i) {
  tasks.splice(i, 1);
  await backend.setItem("tasks", JSON.stringify(tasks));
  loadBackend();
  loadTasks();
}

/**
 * Description: Forwards task content to various rendering functions.
 */
function forwardTaskContent(currentTask, content, i) {
  renderAllTasks(currentTask, content, i);
  renderContactSelection(currentTask, i);
  renderProgressBar(i);
}

/**
 * Description: Renders a progress bar for a task based on the completion status of its subtasks.
 * @param {number} i - The index of the task for which the progress bar is being rendered.
 */
function renderProgressBar(i) {
  if (tasks[i].subtasks.length > 0) {
    let totalSubtasks = tasks[i].subtasks.length;
    let completedSubtasks = 0;
    for (let k = 0; k < tasks[i].sTStatus.length; k++) {
      if (tasks[i].sTStatus[k] == true) {
        completedSubtasks++;
      }
      if (tasks[i].sTStatus[k] == false) {
      }
    }
    let progressBar = document.getElementById(`subtask-progress-bar-${i}`);
    progressBar.innerHTML = /*html*/ `
    <progress style="margin-right:8px" id="file" value="${completedSubtasks}" max="${totalSubtasks}"> 32% </progress>
    <label for="file" id="progress-count-${i}">${completedSubtasks}/${totalSubtasks}</label>
    `;
  }
}

/**
 * Description: Renders a task and its associated elements, such as priority and category, within a specified content container.
 * @param {object} currentTask - The task object to render.
 * @param {HTMLElement} content - The container element where the task is rendered.
 * @param {number} i - The index of the task in the list.
 */
function renderAllTasks(currentTask, content, i) {
  console.log(content);
  content.innerHTML += htmlRenderAllTasks(currentTask, i);
  getPrioImage(currentTask, i);
  getTaskCategoryColor(i);
}

/**
 * Description: Gets and appends the appropriate priority image to the specified content container for a task.
 * @param {object} currentTask - The task object containing priority information.
 * @param {number} i - The index of the task.
 */
function getPrioImage(currentTask, i) {
  let content = document.getElementById(`${currentTask.prio}_${i}`);
  if (content.id == `low_${i}`) {
    let img = document.createElement("img");
    img.src = "assets/img/prio-low.svg";
    content.appendChild(img);
  } else if (content.id == `medium_${i}`) {
    let img = document.createElement("img");
    img.src = "assets/img/prio-medium.svg";
    content.appendChild(img);
  } else if (content.id == `urgent_${i}`) {
    let img = document.createElement("img");
    img.src = "assets/img/prio-urgent.svg";
    content.appendChild(img);
  }
}

/**
 * Description: Retrieves and sets the category color for a task based on its category name.
 * @param {number} i - The index of the task for which the category color is retrieved and set.
 */
function getTaskCategoryColor(i) {
  for (let j = 0; j < categorys.length; j++) {
    if (categorys[j].name == tasks[i].category) {
      document.getElementById(
        i
      ).firstElementChild.style = `background-color: ${categorys[j].color}`;
      if (cardOpened) {
        document.getElementById(
          "card-container"
        ).children[1].style = `background-color: ${categorys[j].color}`;
      }
    }
  }
}

/**
 * Description: Renders contact selections for a task, displaying initials and handling contact color based on the selection.
 * @param {object} currentTask - The task object for which contact selections are rendered.
 * @param {number} i - The index of the task.
 */
function renderContactSelection(currentTask, i) {
  for (let k = 0; k < currentTask.contactSelection.length; k++) {
    for (let j = 0; j < contacts.length; j++) {
      if (currentTask.contactSelection[k] == contacts[j].ID) {
        currentContact = contacts[j].initials;
        if (currentTask.contactSelection.length < 3) {
          showAllContacts(currentTask, i, currentContact, j);
          getContactColor(i, k, j);
        } else {
          showFirstTwoContacts(k, currentTask, i, currentContact, j);
          getContactColor(i, k, j);
        }
      }
    }
  }
}

/**
 * Description: Displays all contact selections for a task, showing the initials within circles.
 * @param {object} currentTask - The task object for which contact selections are displayed.
 * @param {number} i - The index of the task.
 * @param {string} currentContact - The initials of the current contact.
 * @param {number} j - The index of the contact in the contacts array.
 */
function showAllContacts(currentTask, i, currentContact, j) {
  document.getElementById(
    `contact-selection-${currentTask.status}_${i}`
  ).innerHTML += /*html*/ `
    <div class="circleB" id="${contacts[j].ID}_${i}">${currentContact}</div>
    `;
}

/**
 * Description: Displays the first two contact selections for a task, showing the initials within circles, and an indicator for remaining contacts if applicable.
 * @param {number} k - The index of the current contact selection.
 * @param {object} currentTask - The task object for which contact selections are displayed.
 * @param {number} i - The index of the task.
 * @param {string} currentContact - The initials of the current contact.
 * @param {number} j - The index of the contact in the contacts array.
 */
function showFirstTwoContacts(k, currentTask, i, currentContact, j) {
  if (k < 2) {
    document.getElementById(
      `contact-selection-${currentTask.status}_${i}`
    ).innerHTML += /*html*/ `
        <div class="circleB" id="${contacts[j].ID}_${i}">${currentContact}</div>
        `;
  } else if (k == 2) {
    document.getElementById(
      `contact-selection-${currentTask.status}_${i}`
    ).innerHTML += /*html*/ `
        <div style="background-color:#2A3647;" class="circleB" id="remaining-contacts-number-${i}">${
      "+" + (currentTask.contactSelection.length - 2)
    }</div>
        `;
  }
}

/**
 * Description: Sets the background color of the contact selection element based on the contact's color.
 * @param {number} i - The index of the task.
 * @param {number} k - The index of the current contact selection.
 * @param {number} j - The index of the contact in the contacts array.
 */
function getContactColor(i, k, j) {
  for (let l = 0; l < contacts.length; l++) {
    if (k < 2) {
      if (contacts[l].ID == tasks[i].contactSelection[k]) {
        document.getElementById(
          `${contacts[j].ID}_${i}`
        ).style = `background-color: ${contacts[l].color}`;
      }
    } else if (k == 3) {
      document.getElementById(
        `remaining-contacts-number-${i}`
      ).style = `background-color: #2A3647; color: #FFFFFF`;
    }
  }
}

/**
 * Description: Loads and displays a card for a task with additional details and contacts.
 * @param {number} i - The index of the task for which the card is loaded.
 */
function loadCard(i) {
  cardOpened = true;
  if (window.innerWidth < 1000) {
    main.classList.add("d-none");
  }
  body.classList.add("overflow-hidden");
  let overlay = document.getElementById("overlay");
  overlay.classList.remove("d-none");
  renderCard(i, overlay);
  renderCardContacts(i);
  getCardPrioImg(i);
  getTaskCategoryColor(i);
}

/**
 * Description: Renders a card for a task with additional details and displays it within the specified overlay.
 * @param {number} i - The index of the task for which the card is rendered.
 * @param {HTMLElement} overlay - The overlay element where the card is displayed.
 */
function renderCard(i, overlay) {
  overlay.innerHTML = htmlRenderCard(i);
  document.getElementById("card-container").classList.remove("d-none");
}

/**
 * Description: Stops event propagation to prevent it from bubbling up the DOM tree.
 * @param {Event} event - The event object for which propagation is stopped.
 */
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * Description: Renders contact cards for a task's selected contacts within the card container.
 * @param {number} i - The index of the task for which contact cards are rendered.
 */
function renderCardContacts(i) {
  let container = document.getElementById("contact-card-container");
  tasks[i].contactSelection.forEach((element) => {
    for (let j = 0; j < contacts.length; j++) {
      let contact = contacts[j];
      if (element == contacts[j].ID) {
        container.innerHTML += /*html*/ `
                <div class="contact-card-content">
                    <p class="circleB" style="background-color:${contact.color}">${contact.initials}</p> 
                    <p>${contact.name}</p>
                </div>
                `;
      }
    }
  });
}

/**
 * Description: Renders contact cards for editing a task's selected contacts within the card container.
 * @param {number} i - The index of the task for which contact cards are rendered.
 */
function renderCardContactsEdit(i) {
  let container = document.getElementById("contact-card-container");
  container.innerHTML = "";
  container.style = "display:flex";
  tasks[i].contactSelection.forEach((element) => {
    for (let j = 0; j < contacts.length; j++) {
      let contact = contacts[j];
      if (element == contacts[j].ID) {
        container.innerHTML += /*html*/ `
                <div class="contact-card-content">
                    <p class="circleB" style="background-color:${contact.color}">${contact.initials}</p> 
                </div>
                `;
      }
    }
  });
}

/**
 * Description: Gets and appends the priority image to the card content based on the task's priority.
 * @param {number} i - The index of the task for which the priority image is obtained and added.
 */
function getCardPrioImg(i) {
  let content = document.getElementById(`card-${tasks[i].prio}`);
  let img = document.createElement("img");
  img.src = `assets/img/${content.id}.svg`;
  content.appendChild(img);
}

/**
 * Description: Searches for tasks based on the input value and displays or hides tasks accordingly.
 */
function searchTasks() {
  let input = document.getElementById("find-task-input");
  for (let i = 0; i < tasks.length; i++) {
    let content = document.getElementById(`${i}`);
    if (tasks[i].title.toLowerCase().includes(input.value.toLowerCase())) {
      content.classList.remove("d-none");
    } else if (
      tasks[i].description.toLowerCase().includes(input.value.toLowerCase())
    ) {
      content.classList.remove("d-none");
    } else {
      content.classList.add("d-none");
    }
  }
}
