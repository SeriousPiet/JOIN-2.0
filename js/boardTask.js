/**
 * Description: Loads the edit task interface for the task at the specified index, including rendering task details, contacts, and highlighting priority.
 * @param {number} i - The index of the task to be edited.
 */
function loadEditTask(i) {
  renderEditTask(i);
  renderEditContacts(i);
  renderCardContactsEdit(i);
  highlightPrio(i);
}

/**
 * Description: Renders the edit task interface for the task at the specified index, including task details, subtasks, and their status.
 * @param {number} i - The index of the task to be edited.
 */
function renderEditTask(i) {
  let content = document.getElementById("card-container");
  content.innerHTML = htmlRenderEditTask(i);
  let subtasks = document.getElementById("edit-task-subtasks-container");
  if (tasks[i].subtasks.length > 0) {
    subtasks.innerHTML = `<p>Subtasks</p>`;
    for (let j = 0; j < tasks[i].subtasks.length; j++) {
      subtasks.innerHTML += /*html*/ `
                <div class="subtasksB">${tasks[i].subtasks[j]} <input onclick="updateSubtask(${j},${i})" id="subtask-${j}" class="checkbox" type="checkbox"></div>
            `;
    }
    checkForCompletedSubtasks(i);
  }
}

/**
 * Description: Checks and updates the state of subtask checkboxes based on the status of subtasks in a task at the specified index.
 * @param {number} i - The index of the task for which subtask checkboxes are checked.
 */
function checkForCompletedSubtasks(i) {
  for (let j = 0; j < tasks[i].sTStatus.length; j++) {
    if (tasks[i].sTStatus[j] == true) {
      document.getElementById(`subtask-${j}`).checked = "true";
    }
  }
}

/**
 * Description: Updates the status of a subtask for a task at the specified indexes and syncs the change with the backend.
 * @param {number} j - The index of the subtask to be updated.
 * @param {number} i - The index of the task containing the subtask.
 */
async function updateSubtask(j, i) {
  let checked = document.getElementById(`subtask-${j}`).checked;
  if (checked) {
    tasks[i].sTStatus[j] = true;
    await backend.setItem(`tasks`, JSON.stringify(tasks));
  } else {
    tasks[i].sTStatus[j] = false;
    await backend.setItem(`tasks`, JSON.stringify(tasks));
  }
}

/**
 * Description: Changes the priority of a task at the specified index and syncs the change with the backend.
 * @param {number} i - The index of the task for which the priority is changed.
 * @param {string} prio - The new priority value for the task.
 */
async function changePrio(i, prio) {
  tasks[i].prio = `${prio}`;
  await backend.setItem(`tasks`, JSON.stringify(tasks));
  highlightPrio(i);
}

/**
 * Description: Closes the form for editing a task at the specified index, updates input values, closes the card, and reloads the task list.
 * @param {number} i - The index of the task for which the form is closed.
 */
function closeForm(i) {
  updateInput(i);
  closeCard();
  loadTasks();
}

/**
 * Description: Closes the task card, removes overflow-hidden class, and hides the card container and overlay.
 */
function closeCard() {
  cardOpened = false;
  body.classList.remove("overflow-hidden");
  document.getElementById("card-container").classList.add("d-none");
  document.getElementById("overlay").classList.add("d-none");
  if (window.innerWidth < 1000) {
    main.classList.remove("d-none");
  }
}

/**
 * Description: Updates the title, description, and date of a task at the specified index based on input values and syncs the changes with the backend.
 * @param {number} i - The index of the task to be updated.
 */
async function updateInput(i) {
  let inputTitle = document.getElementById("edit-task-title");
  let inputDescription = document.getElementById("edit-task-description");
  let inputDate = document.getElementById("edit-task-date");
  if (!inputTitle.value == "") tasks[i].title = inputTitle.value;
  if (!inputDescription.value == "")
    tasks[i].description = inputDescription.value;
  if (!inputDate.value == "") tasks[i].date = inputDate.value;
  await backend.setItem(`tasks`, JSON.stringify(tasks));
}

/**
 * Description: Highlights the priority of a task at the specified index by applying relevant styles based on its priority level.
 * @param {number} i - The index of the task to highlight its priority.
 */
function highlightPrio(i) {
  if (tasks[i].prio == "low") taskPrioLow();
  else taskPrioNotLow();
  if (tasks[i].prio == "medium") taskPrioMedium();
  else taskPrioNotMedium();
  if (tasks[i].prio == "urgent") taskPrioUrgent();
  else taskPrioNotUrgent();
}

/**
 * Description: Applies styles to highlight a task with low priority.
 */
function taskPrioLow() {
  let content = document.getElementById("prio-area-low");
  content.style = "background-color:#7AE229";
  contentSummary(content)
  text.style.color = "#FFFFFF";
  svgPath1.style.fill = "#FFFFFF";
  svgPath2.style.fill = "#FFFFFF";
}

/**
 * Description: Removes the highlight styles for a task with low priority.
 */
function taskPrioNotLow() {
  let content = document.getElementById("prio-area-low");
  content.style = "background-color:#FFFFFF";
  contentSummary(content)
  text.style.color = "#7AE229";
  svgPath1.style.fill = "#7AE229";
  svgPath2.style.fill = "#7AE229";
}

/**
 * Description: Applies styles to highlight a task with medium priority.
 */
function taskPrioMedium() {
  let content = document.getElementById("prio-area-medium");
  content.style = "background-color:#FFA800";
  contentSummary(content)
  text.style.color = "#FFFFFF";
  svgPath1.style.fill = "#FFFFFF";
  svgPath2.style.fill = "#FFFFFF";
}

/**
 * Description: Removes the highlight styles for a task with medium priority.
 */
function taskPrioNotMedium() {
  let content = document.getElementById("prio-area-medium");
  content.style = "background-color:#FFFFFF";
  contentSummary(content)
  text.style.color = "#FFA800";
  svgPath1.style.fill = "#FFA800";
  svgPath2.style.fill = "#FFA800";
}

/**
 * Description: Applies styles to highlight a task with urgent priority.
 */
function taskPrioUrgent() {
  let content = document.getElementById("prio-area-urgent");
  content.style = "background-color:#FF3D00";
  contentSummary(content)
  text.style.color = "#FFFFFF";
  svgPath1.style.fill = "#FFFFFF";
  svgPath2.style.fill = "#FFFFFF";
}

/**
 * Description: Removes the highlight styles for a task with urgent priority.
 */
function taskPrioNotUrgent() {
  let content = document.getElementById("prio-area-urgent");
  content.style = "background-color:#FFFFFF";
  contentSummary(content)
  text.style.color = "#FF3D00";
  svgPath1.style.fill = "#FF3D00";
  svgPath2.style.fill = "#FF3D00";
}

/**
 * Extracts specific child elements from a given content element.
 * @param {HTMLElement} content - The content element containing child elements.
 * @returns {Object} An object containing the extracted child elements.
 */
function contentSummary(content) {
  let text = content.children[0];
  let svgPath1 = content.children[1].children[0].children[0];
  let svgPath2 = content.children[1].children[0].children[1];
  return   text, svgPath1, svgPath2;
}
