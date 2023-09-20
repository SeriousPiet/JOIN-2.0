let contacts = [];
let alphabet = [];
let categorys = [];
let mobile = false;


/**
 * is used to load content from backend server
 */
async function init() {
    setURL('https://peter-wallbaum.developerakademie.net/JOIN-2.0/smallest_backend_ever');
    await downloadFromServer();
	contacts = JSON.parse(backend.getItem('contacts')) || [];
	renderContacts2();
}


/**
 * is used to call other functions
 */
function renderContacts2() {
	sortAllContacts();
	createAlphabet();
	renderAlphabet();
	renderAllContacts();
}


/**
 * is used to sort all contact first names alphabetically
 */
function sortAllContacts() {
	contacts.sort((a, b) => {
		return a.name.localeCompare(b.name);
	  });
}


/**
 * is used to push all not yet existing first letters of all contact names in an array
 */
function createAlphabet() {
	alphabet = [];
	contacts.forEach(function(contact) {
		if (alphabet.indexOf(getFirstLetter(contact)) === -1) {
			alphabet.push(getFirstLetter(contact));
			}
		});
	}


/**
 * is used to return the first letter of a contact name
 */
function getFirstLetter(contact) {
	return contact["name"].charAt(0).toUpperCase();
}


/**
 * is used to render all letters from array
 */
function renderAlphabet() {
	let contactlist = document.getElementById("contacts-field");
	contactlist.innerHTML = "";
	for (let i = 0; i < alphabet.length; i++) {
		contactlist.innerHTML += htmlTemplateRenderAlphabet(i);
	}
}


/**
 * is used to render all contacts in letter structure
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
		};
	};
}


/**
 * is used to read new contact values
 */
function addToContact() {
	let name = document.getElementById('name').value;
	let email = document.getElementById('email').value;
	let phone = document.getElementById('phone').value;
	
	newContact(name, email, phone);
}


/**
 * is used to create a new contact
 * @param {string} name - full name of new contact
 * @param {string} email - email of new contact
 * @param {string} phone - phone number of new contact
 */
async function newContact(name, email, phone) {
	let initials = getInitials(name);
	let initialColor = getColor();
	let id = Date.now();
	await setNewContact(name, email, phone, initials ,initialColor, id);
	addContactClose();
	clearInput();
	displayConfirm();
	init();
}

async function setNewContact(name, email, phone, initials ,initialColor, id) {
	let newContact = {
        'name': name,
        'email': email,
        'phone': phone,
		'initials': initials,
		'color': initialColor,
		'ID': id
    };
    contacts.push(newContact);
    await backend.setItem('contacts', JSON.stringify(contacts));
}


/**
 * is used to seperate initials of all names
 * @param {string} fullName - full name of new contact
 */
function getInitials(fullName) {
	let names = fullName.toString().split(' ');
	if (names.length === 1) {
		initials = names[0].substring(0, 1).toUpperCase() 
		+ names[0].substring(1, 2);
	} else {
		initials = names[0].substring(0, 1).toUpperCase() 
		+ names[names.length - 1].substring(0, 1).toUpperCase();
	}
	return initials;
}


/**
 * is used to return a random color
 */
function getColor() {
	return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}


/**
 * is used to clear input fields
 */
function clearInput() {
	document.getElementById('name').value = '';
	document.getElementById('email').value = '';
	document.getElementById('phone').value = '';
}


/**
 * is used to save a new contact on the backend server
 * @param {number} i - the index of contact
 */
async function saveActiveContact(i) {
	let newName = document.getElementById('edit-name').value;
	let newEmail = document.getElementById('edit-email').value;
	let newPhone = document.getElementById('edit-phone').value;
	contacts[i].name = newName;
	contacts[i].email = newEmail;
	contacts[i].phone = newPhone;
	contacts[i].initials = getInitials(newName);

	await backend.setItem('contacts', JSON.stringify(contacts));

	closeSingleContactDesktop();
	closeSingleContactMobile();
	editContactClose();
	displayConfirmUpdate();
	init();
}


/**
 * is used to delete a contact on the backend server
 * @param {number} j - the index of contact
 */
async function delateActiveContact(j) {
	contacts.splice(j, 1);
	for (let i = 0; i < contacts.length; i++) {
		contacts[i].j = i;
	}
	await backend.setItem('contacts', JSON.stringify(contacts));
	closeSingleContactDesktop();
	closeSingleContactMobile();
	editContactClose();
	displayConfirmDelete();
	init();
}


/**
 * is used to display conformation "Contact succesfully created"
 */
function displayConfirm() {
    let contact = document.getElementById('confirm');

	displayConformation(contact);
}


/**
 * is used to display conformation "Contact succesfully updated"
 */
function displayConfirmUpdate() {
    let contact = document.getElementById('confirmUpdate');

	displayConformation(contact);
}


/**
 * is used to display conformation "Contact succesfully deleted"
 */
function displayConfirmDelete() {
    let contact = document.getElementById('confirmDelete');

	displayConformation(contact);
}


/**
 * is used to display conformation only for a few seconds
 * @param {string} contact - conformation text
 */
function displayConformation(contact) {
    setTimeout(() => {
        contact.classList.remove('d-none');
    }, 1000);
    setTimeout(() => {
		contact.classList.add('d-none');
    }, 4000);
}


/**
 * The next function is used to call another function with desktop or mobile features
 *	@param {number} i - the index of contact
 */
let singleContactOverlay = document.getElementById('single-contact-overlay');
let contactContent = document.getElementById('show-contact');
const widths = [0, 1400];

function renderSingleContact(i) {
	currentOpenContact = i;
	if (window.innerWidth>widths[1]) {
			renderSingleContactDesktop(i);
		} else {
			mobile = true;
			renderSingleContactMobile(i);
		}
}


/**
 * is used to render single contacts with desktop features
 *	@param {number} i - the index of contact
 */
function renderSingleContactDesktop(i) {
	singleContactOverlay.style.display = 'flex';
	contactContent.style = 'animation:slide-in .5s ease;';
	contactContent.innerHTML = '';
	contactContent.innerHTML += htmlTemplateRenderSingleContact(contacts[i], i);
}


/**
 * is used to render single contacts with mobile features
 *	@param {number} i - the index of contact
 */
function renderSingleContactMobile(i) {
	renderSingleContactDetails(i);
	window.addEventListener('resize', function () {
		if (window.innerWidth>widths[1]) {
			document.getElementById('contacts-field').style.display = 'flex';
			document.getElementById('contacts-details').style.display = 'flex';
		} else {
			document.getElementById('contacts-details').style.display = 'none';
			if (mobile) {
				renderSingleContactDetails(i);
			}
		}
	});
}


/**
 * is used to render single contacts with mobile features
 *	@param {number} i - the index of contact
 */
function renderSingleContactDetails(i) {
	document.getElementById('contacts-field').style.display = 'none';
	singleContactOverlay.style.display = 'flex';
	contactContent.style = 'animation:none;';
	contactContent.style.display = 'flex';
	contactContent.innerHTML = '';
	contactContent.innerHTML += htmlTemplateRenderSingleContact(contacts[i], i);
	document.getElementById('contacts-details').style.display = 'flex';
	document.getElementById('contact-btn').style.display = 'none';
}


/**
 * is used to close single contacts with desktop features
 */
function closeSingleContactDesktop() {
	contactContent.style = 'animation:slide-out .5s ease;';
	setTimeout(() => {
		singleContactOverlay.style.display = "none";
	}, 400);
}


/**
 * is used to close single contacts with mobile features
 */
function closeSingleContactMobile() {
	mobile = false;
	document.getElementById('contacts-field').style.display = 'flex';
	singleContactOverlay.style.display = 'none';
	document.getElementById('contacts-details').style.display = 'none';
	document.getElementById('contact-btn').style.display = 'flex';
}

	
/**
 * is used to open single contact form to edit contact
 *	@param {number} i - the index of contact
 */
function editSingleContact(i) {
	let formContent = document.getElementById('contact-field-content');
	formContent.innerHTML = '';
	formContent.innerHTML += htmlTemplateEditSingleContact(contacts[i], i);
}


/**
 * The next function is used to open a contact form to create new contacts
 */
const btn = document.getElementById("contact-btn");
const addContactOverlay = document.getElementById('add-contact-overlay');
const editContactOverlay = document.getElementById('edit-contact-overlay');
const addContact = document.getElementById('add-contact');
const editContact = document.getElementById('edit-contact');
const overlay = document.getElementById('bg-overlay');


function addContactOpen() {
	addContactOverlay.style.display = 'flex';
	addContact.style = 'animation:slide-in .5s ease;';
	overlay.style.display = 'flex';
}


/**
 * is used to close contact form without saving
 */
function addContactClose() {
	addContact.style = 'animation:slide-out .5s ease;';
	setTimeout(() => {
		addContactOverlay.style.display = "none";
		overlay.style.display = 'none';	
	}, 300);
}


/**
 * is used to open a contact form to edit contact
 *	@param {number} i - the index of contact
 */
function editContactOpen(i) {
	editContactOverlay.style.display = 'flex';
	editContact.style = 'animation:slide-in .5s ease;';
	overlay.style.display = 'flex';
	editSingleContact(i);
}


/**
 * is used to close contact form without saving
 */
function editContactClose() {
	editContact.style = 'animation:slide-out .5s ease;';
	setTimeout(() => {
		editContactOverlay.style.display = "none";
		overlay.style.display = 'none';	
	}, 300);
}


/**
 * is used to stop the overlay onclick function when pressing buttons on the card
 * @param {string} event
 */
function doNotClose(event) {
    event.stopPropagation();
}




async function openAddTask(id) {
    let overlay = document.getElementById('overlay')
    overlay.style.display = 'flex';
	document.getElementById('addTask').style = '';
	document.getElementById('addTaskOverlay').style.display = 'flex';
    document.getElementById('addTask').innerHTML = renderAddTaskFromBoard();
    await initAddTask();
	selectedContacts = [];
	selectedContacts.push(id);
	renderSelectedContacts();
	let div = document.getElementById(`cb-contacts-${id}`);
	div.checked = true;
	div.setAttribute('onclick', `removeContactFromList(${id})`);
	openAddTaskMobile();
}

function openAddTaskMobile() {
	if (window.screen.width < 1000) {
		document.getElementById('userIcon').style = 'display: none !important;';
	}
}


function addTaskClose() {
	document.getElementById('addTask').style = 'animation:slide-out .5s ease;';
	setTimeout(() => {
		document.getElementById('addTaskOverlay').style.display = "none";
		overlay.style.display = 'none';	
	}, 300);
}


