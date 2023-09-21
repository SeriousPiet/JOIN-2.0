let contacts = [];
let alphabet = [];
let categorys = [];
let mobile = false;

/**
 * Discription: Initializes the application by setting the URL, downloading data from the server, and rendering contacts.
 */
async function init() {
  setURL(
    "https://peter-wallbaum.developerakademie.net/JOIN-2.0/smallest_backend_ever"
  );
  await downloadFromServer();
  contacts = JSON.parse(backend.getItem("contacts")) || [];
  renderContacts2();
}

/**
 * Description: Renders the contacts by sorting, creating an alphabet index, rendering the index, and displaying all contacts.
 */
function renderContacts2() {
  sortAllContacts();
  createAlphabet();
  renderAlphabet();
  renderAllContacts();
}

/**
 * Description: Sorts all contacts in the global 'contacts' array alphabetically by their names.
 */
function sortAllContacts() {
  contacts.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

/**
 * Description: Creates an alphabet index from the first letters of contact names and stores it in the global 'alphabet' array.
 */
function createAlphabet() {
  alphabet = [];
  contacts.forEach(function (contact) {
    if (alphabet.indexOf(getFirstLetter(contact)) === -1) {
      alphabet.push(getFirstLetter(contact));
    }
  });
}

/**
 * Description: Retrieves the first letter of a contact's name and converts it to uppercase.
 * @param {Object} contact - The contact object from which to extract the first letter of the name.
 * @returns {string} - The first letter of the contact's name in uppercase.
 */
function getFirstLetter(contact) {
  return contact["name"].charAt(0).toUpperCase();
}

/**
 * Description: Renders the alphabet index by populating the 'contacts-field' element with HTML templates for each letter.
 */
function renderAlphabet() {
  let contactlist = document.getElementById("contacts-field");
  contactlist.innerHTML = "";
  for (let i = 0; i < alphabet.length; i++) {
    contactlist.innerHTML += htmlTemplateRenderAlphabet(i);
  }
}

/**
 * Description: Renders all contacts by populating the corresponding alphabetically sorted groups in the HTML template.
 */
function renderAllContacts() {
  for (let i = 0; i < contacts.length; i++) {
    let firstLetter = getFirstLetter(contacts[i]);
    for (let j = 0; j < alphabet.length; j++) {
      let letterOfAlphabet = alphabet[j];
      if (letterOfAlphabet == firstLetter) {
        document.getElementById(`group-${firstLetter}`).innerHTML +=
          htmlTemplateRenderAllContacts(contacts[i], i);
      }
    }
  }
}

/**
 * Description: Adds a new contact to the contact list based on the provided name, email, and phone values.
 */
function addToContact() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;

  newContact(name, email, phone);
}

/**
 * Description: Creates a new contact with the provided name, email, and phone values, generates initials and color, sets a unique ID, and adds it to the contact list. Then, it closes the add contact form, clears input fields, displays a confirmation, and initializes the application.
 * @param {string} name - The name of the new contact.
 * @param {string} email - The email of the new contact.
 * @param {string} phone - The phone number of the new contact.
 */
async function newContact(name, email, phone) {
  let initials = getInitials(name);
  let initialColor = getColor();
  let id = Date.now();
  await setNewContact(name, email, phone, initials, initialColor, id);
  addContactClose();
  clearInput();
  displayConfirm();
  init();
}

/**
 * Description: Creates a new contact object with the provided name, email, phone, initials, initialColor, and unique ID. Then, it adds the new contact to the contact list and updates the backend storage with the updated contacts.
 * @param {string} name - The name of the new contact.
 * @param {string} email - The email of the new contact.
 * @param {string} phone - The phone number of the new contact.
 * @param {string} initials - The initials of the new contact.
 * @param {string} initialColor - The initial color assigned to the new contact.
 * @param {number} id - The unique ID of the new contact.
 */
async function setNewContact(name, email, phone, initials, initialColor, id) {
  let newContact = {
    name: name,
    email: email,
    phone: phone,
    initials: initials,
    color: initialColor,
    ID: id,
  };
  contacts.push(newContact);
  await backend.setItem("contacts", JSON.stringify(contacts));
}

/**
 * Description: Generates initials from a full name by taking the first letter of the first name and the first letter of the last name (if available) and converting them to uppercase.
 * @param {string} fullName - The full name from which initials are generated.
 * @returns {string} - The initials generated from the full name.
 */
function getInitials(fullName) {
  let names = fullName.toString().split(" ");
  if (names.length === 1) {
    initials =
      names[0].substring(0, 1).toUpperCase() + names[0].substring(1, 2);
  } else {
    initials =
      names[0].substring(0, 1).toUpperCase() +
      names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

/**
 * Description: Generates a random hexadecimal color code in the format #RRGGBB, where RR, GG, and BB are two-digit hexadecimal values representing the red, green, and blue components of the color, respectively.
 * @returns {string} - A randomly generated color code.
 */
function getColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase()
  );
}

/**
 * Description: Clears the input fields for name, email, and phone by setting their values to empty strings.
 */
function clearInput() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

/**
 * Description: Updates the information of the active contact with the provided new name, email, and phone number. It also recalculates the initials based on the new name and saves the changes to the backend storage.
 * @param {number} i - The index of the active contact to update.
 */
async function saveActiveContact(i) {
  let newName = document.getElementById("edit-name").value;
  let newEmail = document.getElementById("edit-email").value;
  let newPhone = document.getElementById("edit-phone").value;
  contacts[i].name = newName;
  contacts[i].email = newEmail;
  contacts[i].phone = newPhone;
  contacts[i].initials = getInitials(newName);
  await backend.setItem("contacts", JSON.stringify(contacts));
  closeSingleContactDesktop();
  closeSingleContactMobile();
  editContactClose();
  displayConfirmUpdate();
  init();
}

/**
 * Description: Deletes the active contact at the specified index from the contacts list, updates the indices of the remaining contacts, and saves the changes to the backend storage. Then, it closes any open contact editing or confirmation dialogs and triggers an initialization of the contacts.
 * @param {number} j - The index of the active contact to delete.
 */
async function delateActiveContact(j) {
  contacts.splice(j, 1);
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].j = i;
  }
  await backend.setItem("contacts", JSON.stringify(contacts));
  closeSingleContactDesktop();
  closeSingleContactMobile();
  editContactClose();
  displayConfirmDelete();
  init();
}

/**
 * Description: Displays a confirmation message indicating that a new contact has been successfully added.
 */
function displayConfirm() {
  let contact = document.getElementById("confirm");
  displayConformation(contact);
}

/**
 * Description: Displays a confirmation message indicating that a contact has been successfully updated.
 */
function displayConfirmUpdate() {
  let contact = document.getElementById("confirmUpdate");
  displayConformation(contact);
}

/**
 * Description: Displays a confirmation message indicating that a contact has been successfully deleted.
 */
function displayConfirmDelete() {
  let contact = document.getElementById("confirmDelete");
  displayConformation(contact);
}

/**
 * Description: Displays a confirmation message for a certain duration and then hides it.
 * @param {HTMLElement} contact - The HTML element representing the confirmation message.
 */
function displayConformation(contact) {
  setTimeout(() => {
    contact.classList.remove("d-none");
  }, 1000);
  setTimeout(() => {
    contact.classList.add("d-none");
  }, 4000);
}

let singleContactOverlay = document.getElementById("single-contact-overlay");
let contactContent = document.getElementById("show-contact");
const widths = [0, 1400];

/**
 * Description: Renders a single contact with details and actions for editing or deleting.
 * @param {number} i - The index of the contact to render.
 */
function renderSingleContact(i) {
  currentOpenContact = i;
  if (window.innerWidth > widths[1]) {
    renderSingleContactDesktop(i);
  } else {
    mobile = true;
    renderSingleContactMobile(i);
  }
}

/**
 * Description: Renders a single contact with details and actions for editing or deleting in desktop view.
 * @param {number} i - The index of the contact to render.
 */
function renderSingleContactDesktop(i) {
  singleContactOverlay.style.display = "flex";
  contactContent.style = "animation:slide-in .5s ease;";
  contactContent.innerHTML = "";
  contactContent.innerHTML += htmlTemplateRenderSingleContact(contacts[i], i);
}

/**
 * Description: Renders a single contact with details and adapts to changes in the window size in mobile view.
 * @param {number} i - The index of the contact to render.
 */
function renderSingleContactMobile(i) {
  renderSingleContactDetails(i);
  window.addEventListener("resize", function () {
    if (window.innerWidth > widths[1]) {
      document.getElementById("contacts-field").style.display = "flex";
      document.getElementById("contacts-details").style.display = "flex";
    } else {
      document.getElementById("contacts-details").style.display = "none";
      if (mobile) {
        renderSingleContactDetails(i);
      }
    }
  });
}

/**
 * Description: Renders the details of a single contact in mobile view.
 * @param {number} i - The index of the contact to render.
 */

function renderSingleContactDetails(i) {
  document.getElementById("contacts-field").style.display = "none";
  singleContactOverlay.style.display = "flex";
  contactContent.style = "animation:none;";
  contactContent.style.display = "flex";
  contactContent.innerHTML = "";
  contactContent.innerHTML += htmlTemplateRenderSingleContact(contacts[i], i);
  document.getElementById("contacts-details").style.display = "flex";
  document.getElementById("contact-btn").style.display = "none";
}

/**
 * Description: Closes the single contact view in desktop mode by animating it out and hiding the overlay.
 */
function closeSingleContactDesktop() {
  contactContent.style = "animation:slide-out .5s ease;";
  setTimeout(() => {
    singleContactOverlay.style.display = "none";
  }, 400);
}

/**
 * Description: Closes the single contact view in mobile mode, restoring the contacts list and buttons.
 */
function closeSingleContactMobile() {
  mobile = false;
  document.getElementById("contacts-field").style.display = "flex";
  singleContactOverlay.style.display = "none";
  document.getElementById("contacts-details").style.display = "none";
  document.getElementById("contact-btn").style.display = "flex";
}

/**
 * Description: Loads the edit form for a single contact and populates it with the contact's information.
 * @param {number} i - The index of the contact to be edited.
 */
function editSingleContact(i) {
  let formContent = document.getElementById("contact-field-content");
  formContent.innerHTML = "";
  formContent.innerHTML += htmlTemplateEditSingleContact(contacts[i], i);
}

const btn = document.getElementById("contact-btn");
const addContactOverlay = document.getElementById("add-contact-overlay");
const editContactOverlay = document.getElementById("edit-contact-overlay");
const addContact = document.getElementById("add-contact");
const editContact = document.getElementById("edit-contact");
const overlay = document.getElementById("bg-overlay");

/**
 * Description: Displays the contact addition form and overlay to allow users to add a new contact.
 */
function addContactOpen() {
  addContactOverlay.style.display = "flex";
  addContact.style = "animation:slide-in .5s ease;";
  overlay.style.display = "flex";
}

/**
 * Description: Closes the contact addition form and hides the overlay when adding a new contact is canceled.
 */
function addContactClose() {
  addContact.style = "animation:slide-out .5s ease;";
  setTimeout(() => {
    addContactOverlay.style.display = "none";
    overlay.style.display = "none";
  }, 300);
}

/**
 * Description: Opens the contact editing form for a specific contact and displays it over the current content.
 * @param {number} i - The index of the contact to be edited.
 */
function editContactOpen(i) {
  editContactOverlay.style.display = "flex";
  editContact.style = "animation:slide-in .5s ease;";
  overlay.style.display = "flex";
  editSingleContact(i);
}

/**
 * Description: Closes the contact editing form, hiding it from the display.
 */
function editContactClose() {
  editContact.style = "animation:slide-out .5s ease;";
  setTimeout(() => {
    editContactOverlay.style.display = "none";
    overlay.style.display = "none";
  }, 300);
}

/**
 * Description: Prevents event propagation, stopping it from bubbling up the DOM tree.
 * @param {Event} event - The event object to be stopped from propagating.
 */
function doNotClose(event) {
  event.stopPropagation();
}

/**
 * Description: Opens the "Add Task" overlay, initializes the task form,
 * and adds a selected contact to the task.
 * @param {number} id - The identifier of the selected contact to be added to the task.
 */
async function openAddTask(id) {
  let overlay = document.getElementById("overlay");
  overlay.style.display = "flex";
  document.getElementById("addTask").style = "";
  document.getElementById("addTaskOverlay").style.display = "flex";
  document.getElementById("addTask").innerHTML = renderAddTaskFromBoard();
  await initAddTask();
  selectedContacts = [];
  selectedContacts.push(id);
  renderSelectedContacts();
  let div = document.getElementById(`cb-contacts-${id}`);
  div.checked = true;
  div.setAttribute("onclick", `removeContactFromList(${id})`);
  openAddTaskMobile();
}

/**
 * Description: Adjusts the display of the user icon based on the screen width.
 * If the screen width is less than 1000 pixels, the user icon is hidden.
 */
function openAddTaskMobile() {
  if (window.screen.width < 1000) {
    document.getElementById("userIcon").style = "display: none !important;";
  }
}

/**
 * Description: Closes the task addition interface by animating its removal
 * and hiding it when the animation is complete.
 */
function addTaskClose() {
  document.getElementById("addTask").style = "animation:slide-out .5s ease;";
  setTimeout(() => {
    document.getElementById("addTaskOverlay").style.display = "none";
    overlay.style.display = "none";
  }, 300);
}
