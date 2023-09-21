let prio;
let selectedColor;
let selectedCategory;
let selectedContacts = [];
let inAnimation = false;
let sTStatus = [];
let taskStatus;
let subtasks = [];

async function initAddTask() {
  setURL(
    "https://peter-wallbaum.developerakademie.net/JOIN-2.0/smallest_backend_ever"
  );
  renderCategorys();
  await renderContacts();
  editCreateBtnOnMobile();
  setToday();
  getSavedTaskStatus();
}

/**
 * read the inputfields
 */
function readForm() {
  let title = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("date");
  addTask(title, description, date);
}

/**
 * Description: Retrieves and initializes the task status from local storage.
 */
function getSavedTaskStatus() {
  savedTaskStatus = JSON.parse(localStorage.getItem("savedTaskStatus")) || [];
  if (savedTaskStatus.length > 0) {
    taskStatus = savedTaskStatus;
  } else {
    taskStatus = "toDo";
  }
}

/**
 * Description: Detects and replaces HTML angle brackets (< and >) with their HTML entity equivalents to prevent script injection.
 * @param {string} text - The text to be checked for angle brackets.
 * @returns {string} - The text with angle brackets replaced by HTML entities.
 */
function scriptDetection(text) {
  let newText = text;
  for (let i = 0; i < newText.length; i++) {
    if (newText.includes("<")) newText = newText.replace("<", "&lt");
    if (newText.includes(">")) newText = newText.replace(">", "&gt");
  }
  return newText;
}

/**
 * Description: Adds a new task with the provided details if priority and category are selected; otherwise, displays an error message.
 * @param {string} title - The title of the new task.
 * @param {string} description - The description of the new task.
 * @param {string} date - The date for the new task.
 */
async function addTask(title, description, date) {
  if (prio == undefined || selectedCategory == undefined) {
    errorMassage("errorTask", "select category and priority");
  } else {
    await setNewTask(title, description, date);
    clearSavedTaskStatus();
    clearForm();
    showTaskAdded();
    intervalsAndNextPage();
  }
}

/**
 * Description: Sets a new task with the provided details and saves it to the server.
 * @param {string} title - The title of the new task.
 * @param {string} description - The description of the new task.
 * @param {string} date - The date for the new task.
 */
async function setNewTask(title, description, date) {
  let newTask = {
    status: taskStatus,
    title: scriptDetection(title.value),
    description: scriptDetection(description.value),
    category: selectedCategory,
    contactSelection: selectedContacts,
    date: date.value,
    prio: prio,
    subtasks: subtasks,
    sTStatus: sTStatus,
  };
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem("tasks")) || [];
  tasks.push(newTask);
  await backend.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Description: Displays an error message in the specified HTML element for a limited time.
 * @param {string} div - The ID of the HTML element to display the error message.
 * @param {string} message - The error message to be displayed.
 */
function errorMassage(div, message) {
  let content = document.getElementById(div);
  content.style = "color: red;";
  content.innerHTML = message;
  setTimeout(() => {
    content.style = "display: none;";
  }, 3000);
}

/**
 * Description: Clears intervals and navigates to the next page after a delay.
 */
function intervalsAndNextPage() {
  if (document.getElementById("add-task-byboard-container")) {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }
  setTimeout(() => {
    window.document.location.href = "./board.html";
  }, 1000);
}

/**
 * Description: Clears the saved task status in local storage.
 */
function clearSavedTaskStatus() {
  savedTaskStatus = "";
  localStorage.setItem(`savedTaskStatus`, JSON.stringify(savedTaskStatus));
}

/**
 * Description: Sets the priority of a task by highlighting the selected priority button.
 * @param {string} i - The priority level ("urgent", "medium", "low") to set or null to clear.
 */
function setprio(i) {
  let btns = ["urgent", "medium", "low"];
  let btnColor = ["#FF3D00", "#FFA800", "#7AE229"];
  if (i) {
    let selectedBtn = btns.indexOf(i);
    btns.splice(selectedBtn, 1);
    document.getElementById(i).classList.add("btn-on-focus");
    document.getElementById(
      i
    ).style = `background-color: ${btnColor[selectedBtn]};`;
  }
  btns.forEach((e) => {
    document.getElementById(e).classList.remove("btn-on-focus");
    document.getElementById(e).style = ``;
  });
  prio = i;
}

/**
 * Description: Clears form inputs and resets related variables and selections.
 */
async function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("subtasks").innerHTML = "";
  prio = "";
  subtasks = [];
  selectedCategory = [];
  selectedContacts = [];
  sTStatus = [];
  await backend.setItem("selectedContacts", JSON.stringify(selectedContacts));
  renderSelectedContacts();
  renderContacts();
  selectCategory("reload");
  setprio();
}

/**
 * Description: Adds a subtask to the list of subtasks.
 */
function addSubtask() {
  let subTask = document.getElementById("subtask");
  let content = document.getElementById("subtasks");
  content.innerHTML = "";
  if (subTask.value.length < 2) {
    content.innerHTML += `<div style="color: red;">length to small</div>`;
  } else {
    let newSubTask = scriptDetection(subTask.value);
    subtasks.push(newSubTask);
    sTStatus.push(false);
    subTask.value = "";
  }
  renderSubTasks();
}

/**
 * Displays the new category input field and hides the category display.
 */
function showNewCategoryInput() {
  let content = document.getElementById("categoryShow");
  document.getElementById("newCategoryInput").classList.remove("d-none");
  content.classList.add("d-none");
  renderCategoryColors();
}

/**
 * Description: Adds a new category with the provided name and selected color.
 */
async function addNewCategory() {
  let content = document.getElementById("newCategory").value;
  let newCategory = {
    name: content,
    color: selectedColor,
  };
  content.value = "";
  categorys.push(newCategory);
  await backend.setItem("categorys", JSON.stringify(categorys));
  closeNewCategoryInput();
  renderCategorys();
}

/**
 * Description: Closes the new category input field and shows the category display.
 */
function closeNewCategoryInput() {
  document.getElementById("newCategoryInput").classList.add("d-none");
  document.getElementById("categoryShow").classList.remove("d-none");
}

/**
 * Description: Renders the list of subtasks in the designated HTML element.
 */
function renderSubTasks() {
  let content = document.getElementById("subtasks");
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    content.innerHTML += `<li><input onclick="checkSubTask(${i})" id="cb-subtask-${i}" class="checkbox" type="checkbox" control-id="ControlID-12"> ${subtask}</li>`;
  }
}

/**
 * Description: Checks a subtask by updating its status and click behavior.
 * @param {number} id - The ID of the subtask to check.
 */
function checkSubTask(id) {
  sTStatus[id] = true;
  document
    .getElementById("cb-subtask-" + id)
    .setAttribute("onclick", `uncheckSubTask(${id})`);
}

/**
 * Description: Unchecks a subtask by updating its status and click behavior.
 * @param {number} id - The ID of the subtask to uncheck.
 */
function uncheckSubTask(id) {
  sTStatus[id] = false;
  document
    .getElementById("cb-subtask-" + id)
    .setAttribute("onclick", `checkSubTask(${id})`);
}

/**
 * Description: Renders the list of categories in the designated HTML element.
 */
async function renderCategorys() {
  let content = document.getElementById("category");
  content.innerHTML = "";
  content.innerHTML += `<div class="categorys" onclick="showNewCategoryInput()">New Category</div>`;
  await downloadFromServer();
  categorys = JSON.parse(backend.getItem("categorys")) || [];
  for (let i = 0; i < categorys.length; i++) {
    let category = categorys[i];
    content.innerHTML += `<div class="categorys" onclick="selectCategory(${i})">${category["name"]} <div style="background-color: ${category["color"]}; width: 15px;
            height: 15px; border-radius: 100%;"></div></div>`;
  }
}

/**
 * Description: Renders the available category color options for selection.
 */
function renderCategoryColors() {
  let colors = [
    "#8AA4FF",
    "#FF0000",
    "#2AD300",
    "#FF8A00",
    "#E200BE",
    "#0038FF",
  ];
  let content = document.getElementById("categoryColors");
  content.innerHTML = "";
  for (let i = 0; i < colors.length; i++) {
    content.innerHTML += `<div class="color-circle" onclick="selectColor('${colors[i]}')" style="background-color: ${colors[i]};">`;
  }
}

/**
 * Description: Selects a color for a category.
 * @param {string} color - The color of the selected category
 */
function selectColor(color) {
  selectedColor = color;
}

/**
 * Description: Selects a task category by updating the displayed category name and color.
 * @param {number} i - The index of the selected category or "reload" to reset.
 */
function selectCategory(i) {
  if (i == "reload") {
    document.getElementById("selectCategory").innerHTML =
      "Select task category";
  } else {
    selectedCategory = categorys[i]["name"];
    document.getElementById(
      "selectCategory"
    ).innerHTML = `${categorys[i]["name"]} <div style="background-color: ${categorys[i]["color"]}; width: 15px;
        height: 15px; border-radius: 100%;"></div> `;
  }
  dropup("category");
}

/**
 * Description: Renders the list of contacts for selection.
 */
async function renderContacts() {
  let content = document.getElementById("contact");
  await downloadFromServer();
  contacts = JSON.parse(backend.getItem("contacts")) || [];
  content.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    content.innerHTML += `<label for="cb-contacts-${contacts[i]["ID"]}"> <div class="contacts">${contact["name"]} <input onclick="addContactToList(${contacts[i]["ID"]})" id="cb-contacts-${contacts[i]["ID"]}" class="checkbox" type="checkbox" control-id="ControlID-12"></div></label>`;
  }
}

/**
 * Description: Animates the downward dropping of a specified area, shows it up and updating related elements.
 * @param {string} area - The ID of the area to be animated and shown.
 */
function dropdown(area) {
  if (!inAnimation) {
    let content = document.getElementById(area);
    let bigArea = area[0].toUpperCase() + area.slice(1);
    content.classList.remove("d-none");
    document.getElementById(area + "Show").style =
      "animation: dropdown 2s ease;";
    document.getElementById(`arrow${bigArea}`).style =
      "animation: arrowUp 350ms ease; transform: rotate(180deg);";
    document
      .getElementById(`select${bigArea}`)
      .setAttribute("onclick", `dropup('${area}')`);
    document
      .getElementById(`arrow${bigArea}`)
      .setAttribute("onclick", `dropup('${area}')`);
  }
}

/**
 * Description: Animates the upward dropping of a specified area, hiding it and updating related elements.
 * @param {string} area - The ID of the area to be animated and hidden.
 */
function dropup(area) {
  let content = document.getElementById(area);
  let areaShow = document.getElementById(area + "Show");
  inAnimation = true;
  let bigArea = area[0].toUpperCase() + area.slice(1);
  editEndHeight(areaShow);
  document
    .getElementById("select" + bigArea)
    .setAttribute("onclick", `dropdown('${area}')`);
  document
    .getElementById("arrow" + bigArea)
    .setAttribute("onclick", `dropdown('${area}')`);
  areaShow.style = "animation: dropup 500ms ease;";
  document.getElementById("arrow" + bigArea).style =
    "animation: arrowDown 350ms ease;";
  setTimeout(() => {
    content.classList.add("d-none");
    inAnimation = false;
  }, 500);
}

/**
 * Description: Adds a contact to the selected contacts list and updates the click event to remove it.
 * @param {string} id - The ID of the contact to be added.
 */
function addContactToList(id) {
  let contact = document.getElementById(`cb-contacts-${id}`);
  selectedContacts.push(id);
  contact.setAttribute("onclick", `removeContactFromList(${id})`);
  renderSelectedContacts();
}

/**
 * Discription: Removes a contact with the specified ID from the list and updates the selected contacts.
 * @param {string} id - The ID of the contact to be removed.
 */
function removeContactFromList(id) {
  let contact = document.getElementById(`cb-contacts-${id}`);
  contact.setAttribute("onclick", `addContactToList(${id})`);
  for (let i = 0; i < contacts.length; i++) {
    let index = selectedContacts.indexOf(id);
    if (index != -1) {
      selectedContacts.splice(index, 1);
    }
  }
  renderSelectedContacts();
}

/**
 * Description: Renders the selected contacts for display.
 */
function renderSelectedContacts() {
  let content = document.getElementById("selectContact");
  content.innerHTML = "";
  if (selectedContacts.length > 0) {
    for (let i = 0; i < contacts.length; i++) {
      let contact = contacts[i]["ID"];
      for (let j = 0; j < selectedContacts.length; j++) {
        if (contact == selectedContacts[j]) {
          content.innerHTML += `<div class="circle" style="background-color: ${contacts[i]["color"]};": >${contacts[i]["initials"]}</div>`;
        }
      }
    }
  } else {
    content.innerHTML = "Select contacts to assign";
  }
}

/**
 * Description: Displays a notification to indicate that a task has been added.
 */
function showTaskAdded() {
  let taskAdded = document.getElementById("taskAdded");
  taskAdded.classList.remove("d-none");
  taskAdded.style = "animation: comeIn 1s ease;";
  setTimeout(() => {
    taskAdded.style = "animation: comeOut 1s ease;";
  }, 2000);
  setTimeout(() => {
    taskAdded.classList.add("d-none");
  }, 2500);
}

/**
 * Sets a CSS custom property to the client height of the given content element.
 * @param {HTMLElement} content - The content element whose client height will be used.
 */
function editEndHeight(content) {
  document.documentElement.style.setProperty(
    "--end-height",
    content.clientHeight + "px"
  );
}

/**
 * Description: Modifies the create button text based on the screen width.
 */
function editCreateBtnOnMobile() {
  setInterval(() => {
    let width = window.innerWidth > 0 ? window.innerWidth : screen.width;
    if (width < 1000) {
      document.getElementById("createBtn").innerHTML = `Create
        <svg width="18" height="15" viewBox="0 0 18 15" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7.5L7 13.5L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
    	`;
    } else {
      document.getElementById("createBtn").innerHTML = `Create Task
            <svg width="18" height="15" viewBox="0 0 18 15" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7.5L7 13.5L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>`;
    }
  }, 500);
}

/**
 * Description: Sets the minimum date for an input field to the current date.
 */
function setToday() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;
  document.getElementById("date").setAttribute("min", today);
}
