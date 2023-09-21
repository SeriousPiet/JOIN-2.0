/**
 * Description: Renders a list of contacts for editing a task's contact selections, including an option to invite a new contact.
 * @param {number} i - The index of the task for which contacts are rendered for editing.
 */
async function renderEditContacts(i) {
  let content = document.getElementById("contact");
  await downloadFromServer();
  contacts = JSON.parse(backend.getItem("contacts")) || [];
  content.innerHTML = "";
  for (let j = 0; j < contacts.length; j++) {
    let contact = contacts[j];
    content.innerHTML += `<label for="cb-contacts-${contact["ID"]}"> <div class="contacts">${contact["name"]} <input onclick="addEditContactToList(${contact["ID"]},${i})" id="cb-contacts-${contact["ID"]}" class="checkbox" type="checkbox" control-id="ControlID-12"></div></label>`;
    if (j == contacts.length - 1) {
      let j = contacts.length;
      content.innerHTML += `<label for="cb-subtask-${j}"> <div class="contacts">Intive new contact <input onclick="inviteNewContact(${i})" id="cb-subtask-${j}" class="subtask-checkbox" type="checkbox" control-id="ControlID-12"></div></label>`;
    }
  }
}

/**
 * Description: Initiates the invitation of a new contact and displays the invitation area.
 * @param {number} i - The index of the task for which a new contact is invited.
 */
function inviteNewContact(i) {
  let areaB = "contact";
  dropup(areaB);
  let content = document.getElementById("contactShow");
  content.innerHTML = renderInviteNewContactArea(i);
}

/**
 * Description: Checks for selected contacts and marks them as checked in the contact list.
 */
function checkForSelectedContacts() {
  for (let j = 0; j < contacts.length; j++) {
    let container = document.getElementById("contact-card-container");
    let i = container.className.slice(0, 1);
    let contact = contacts[j];
    if (tasks[i].contactSelection.includes(contact.ID)) {
      document.getElementById(`cb-contacts-${contact.ID}`).checked = true;
    }
  }
}

/**
 * Description: Displays a dropdown menu for editing a task at the specified index.
 * @param {number} i - The index of the task to be edited using the dropdown menu.
 */
function showDropDownB(i) {
  loadEditTask(i);
}

/**
 * Description: Initiates a dropdown animation for the specified area and updates related elements, including checking for selected contacts.
 * @param {string} areaB - The ID of the area to be animated and displayed as a dropdown.
 * @param {number} i - The index of the task used for checking selected contacts.
 */
function dropdownB(areaB, i) {
  if (!inAnim) {
    let content = document.getElementById(areaB);
    let bigArea = areaB[0].toUpperCase() + areaB.slice(1);
    content.classList.remove("d-none");
    document.getElementById(areaB + "Show").style =
      "animation: dropdown 2s ease;";
    document.getElementById(`arrow${bigArea}`).style =
      "animation: arrowUp 350ms ease; transform: rotate(180deg);";
    document
      .getElementById(`select${bigArea}`)
      .setAttribute("onclick", `dropup('${areaB}')`);
    document
      .getElementById(`arrow${bigArea}`)
      .setAttribute("onclick", `dropup('${areaB}')`);
    checkForSelectedContacts(i);
  }
}

/**
 * Description: Initiates a dropup animation for the specified area and updates related elements.
 * @param {string} areaB - The ID of the area to be animated and hidden.
 */
function dropupB(areaB) {
  let content = document.getElementById(areaB);
  let areaShow = document.getElementById(areaB + "Show");
  inAnim = true;
  let bigArea = areaB[0].toUpperCase() + areaB.slice(1);
  editEndHeight(areaShow);
  document
    .getElementById("select" + bigArea)
    .setAttribute("onclick", `dropdown('${areaB}')`);
  document
    .getElementById("arrow" + bigArea)
    .setAttribute("onclick", `dropdown('${areaB}')`);
  areaShow.style = "animation: dropup 500ms ease;";
  document.getElementById("arrow" + bigArea).style =
    "animation: arrowDown 350ms ease;";
  setTimeout(() => {
    content.classList.add("d-none");
    inAnim = false;
  }, 500);
}

/**
 * Description: Sets a CSS custom property to match the client height of the specified content element.
 * @param {HTMLElement} content - The content element whose client height is used for the CSS property.
 */
function editEndHeight(content) {
  document.documentElement.style.setProperty(
    "--end-height",
    content.clientHeight + "px"
  );
}

/**
 * Description: Adds or removes a contact from a task's contact selection list based on the checkbox state and updates the backend.
 * @param {number} j - The ID of the contact to add or remove from the list.
 * @param {number} i - The index of the task for which the contact selection is updated.
 */
async function addEditContactToList(j, i) {
  if (document.getElementById(`cb-contacts-${j}`).checked) {
    tasks[i].contactSelection.push(j);
    await backend.setItem(`tasks`, JSON.stringify(tasks));
  } else {
    let index = tasks[i].contactSelection.indexOf(j);
    tasks[i].contactSelection.splice(index, 1);
    await backend.setItem(`tasks`, JSON.stringify(tasks));
  }
  renderCardContactsEdit(i);
}

/*********Drag and Drop Function************/

/**
 * Description: Handles the "dragstart" event by setting the current dragged element.
 * @param {string} id - The ID of the element being dragged.
 */
function dragstart_handler(id) {
  currentDraggedElement = id;
}

/**
 * Description: Handles the "dragover" event by preventing the default behavior to allow for a drop event.
 * @param {Event} ev - The dragover event object.
 */
function dragover_handler(ev) {
  ev.preventDefault();
}

/**
 * Description: Handles the "drop" event by updating the status of the currently dragged task and saving changes to the backend.
 * @param {string} status - The status to which the task is dropped.
 */
async function drop_handler(status) {
  tasks[currentDraggedElement].status = status;
  await backend.setItem(`tasks`, JSON.stringify(tasks));
  loadTasks();
}

/**
 * Description: Highlights and displays a specific area with the given ID.
 * @param {string} id - The ID of the area to be highlighted and displayed.
 */
function highlightArea(id) {
  let container = document.getElementById(id);
  container.classList.remove("d-none");
  editToDoArea();
  editInProgress();
  editAwaitFeed();
  editDone();
}

/**
 * Description: Edits the "To-Do" area by checking if it's empty and adding or removing the "margin-top" class accordingly.
 */
function editToDoArea() {
  let toDo = document.getElementById("toDo-container");
  let toDoDragArea = document.getElementById("to-do-container-drag-area");
  if (toDo.innerHTML.length == 0) {
    toDoDragArea.classList.add("margin-top");
  }
}

/**
 * Description: Edits the "In Progress" area by checking if it's empty and adding or removing the "margin-top" class accordingly.
 */
function editInProgress() {
  let inProgress = document.getElementById("inProgress-container");
  let inProgressDragArea = document.getElementById(
    "in-progress-container-drag-area"
  );
  if (inProgress.innerHTML.length == 0) {
    inProgressDragArea.classList.add("margin-top");
  }
}

/**
 * Description: Edits the "Awaiting Feedback" area by checking if it's empty and adding or removing the "margin-top" class accordingly.
 */
function editAwaitFeed() {
  let awaitFeed = document.getElementById("awaitingFeedback-container");
  let awaitFeedDragArea = document.getElementById(
    "awaiting-feedback-container-drag-area"
  );
  if (awaitFeed.innerHTML.length == 0) {
    awaitFeedDragArea.classList.add("margin-top");
  }
}

/**
 * Description: Edits the "Done" area by checking if it's empty and adding or removing the "margin-top" class accordingly.
 */
function editDone() {
  let done = document.getElementById("done-container");
  let doneDragArea = document.getElementById("done-container-drag-area");
  if (done.innerHTML.length == 0) {
    doneDragArea.classList.add("margin-top");
  }
}

/**
 * Description: Removes the highlight and hides a specific area with the given ID.
 * @param {string} id - The ID of the area to be unhighlighted and hidden.
 */
function removeHighlightArea(id) {
  let container = document.getElementById(id);
  container.classList.add("d-none");
}

/**
 * Description: Highlights a specific drag area with the given ID.
 * @param {string} id - The ID of the drag area to be highlighted.
 */
function highliteDragArea(id) {
  let container = document.getElementById(id);
  container.classList.remove("d-none");
}

/**
 * Description: Removes the highlight and hides a specific drag area with the given ID.
 * @param {string} id - The ID of the drag area to be unhighlighted and hidden.
 */
function removeHighlightDragArea(id) {
  let container = document.getElementById(id);
  container.classList.add("d-none");
  container.classList.remove("margin-top");
}

/**
 * Discription: Toggles the visibility of an icon with the ID "edit-task-date-icon."
 */
function hideIcon() {
  let content = document.getElementById("edit-task-date-icon");
  if (!content.classList.contains("d-none")) {
    content.classList.add("d-none");
  } else if (content.classList.contains("d-none")) {
    content.classList.remove("d-none");
  }
}

/**
 * Discription: Hides drag areas for test containers, including "to-do," "in-progress," "awaiting-feedback," and "done."
 */
function removeTest() {
  let targetContainer = ["to-do", "in-progress", "awaiting-feedback", "done"];
  for (let i = 0; i < targetContainer.length; i++) {
    let element = document.getElementById(
      targetContainer[i] + "-container-drag-area"
    );
    element.classList.add("d-none");
  }
}

/**
 * Handles the touch start event, triggering a long touch action when applicable.
 * @param {string} id - The ID of the element being touched.
 */
function touchStart(id) {
  if (!timer) {
    timer = setTimeout(() => {
      container = document.getElementById(id);
      console.log(container.getAttribute("status"));
      if (container.getAttribute("status") == "closed") {
        onlongtouch(id);
        container.setAttribute("status", "opened");
      }
    }, duration);
  }
}

/**
 * Discription: Handles the touch end event, clearing a timer if it's active.
 */
function touchEnd() {
  if (timer) {
    clearTimeout(timer);
    timer = false;
  }
}

/**
 * Handles a long touch event on an element with the specified ID by adding opacity to its children and displaying a move-to container.
 * @param {string} id - The ID of the element being long-touched.
 */
function onlongtouch(id) {
  let container = document.getElementById(id);
  for (let j = 0; j < 5; j++) {
    container.children[j].classList.add("opacity");
  }
  container.innerHTML += /*html*/ `
  <div class="move-to-container" onclick="event.stopImmediatePropagation()">
    <div onclick="moveTo(${id}, 'toDo')"><p>To Do</p></div>
    <div onclick="moveTo(${id}, 'inProgress')"><p>In Progress</p></div>
    <div onclick="moveTo(${id}, 'awaitingFeedback')"><p>Awaiting Feedback</p></div>
    <div onclick="moveTo(${id}, 'done')"><p>Done</p></div>
  </div>
  `;
}

/**
 * Moves a task with the specified ID to a new status and updates the backend and task list.
 * @param {number} id - The ID of the task being moved.
 * @param {string} newStatus - The new status to which the task is moved.
 */
async function moveTo(id, newStatus) {
  tasks[id].status = newStatus;
  await backend.setItem(`tasks`, JSON.stringify(tasks));
  loadTasks();
}
