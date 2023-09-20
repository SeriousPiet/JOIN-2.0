let tasks = []
let categorys = []
let contacts = []
let cardOpened = false;
let currentContact;
let inAnim = false;
let currentDraggedElement;
let timer = false;
let duration = 500;
let board = true;


/**
 * is used to load the content from the backend
 */
async function loadBackend() {
    setURL('https://peter-wallbaum.developerakademie.net/JOIN-2.0/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    categorys = JSON.parse(backend.getItem('categorys')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    savedTaskStatus = JSON.parse(localStorage.getItem('savedTaskStatus')) || [];
    loadTasks()
}


/**
 * is used to save the current task status in local storage
 * @param {string} savedTaskStatus 
 */
function saveTaskStatusFromBoard(savedTaskStatus) {
    savedTaskStatus[0] = savedTaskStatus
    localStorage.setItem(`savedTaskStatus`, JSON.stringify(savedTaskStatus));
    let overlay = document.getElementById('overlay')
    body.classList.add('overflow-hidden')
    setInterval(() => {
        checkAddTaskToBoardContainer();
    }, 600);
    overlay.classList.remove('d-none')
    overlay.classList.add('overlay-bg')
    overlay.classList.add('overlay-bg-white')
    overlay.innerHTML = renderAddTaskFromBoard()
    initAddTask()
}

/**
 * checkt if addTask container & manipulate the headermenu
 */
function checkAddTaskToBoardContainer() {
    if (document.getElementById('add-task-byboard-container')) {
        let headerMenu = document.getElementById('header-menu-container')
        if (window.innerWidth <= 1000) {
            headerMenu.classList.add('d-none')
        } else {
            headerMenu.classList.remove('d-none')
        }
    }
}

function closeEditTaskOnBoard() {
    body.classList.remove('overflow-hidden')
    let overlay = document.getElementById('overlay')
    overlay.classList.add('d-none')
    overlay.classList.remove('overlay-bg')
    overlay.classList.remove('overlay-bg-white')
    document.getElementById('header-menu-container').classList.remove('d-none')
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
}


/**
 * is used to get the containers which will be filled with the content from the backend
 */
function loadTasks() {
    document.getElementById('toDo-container').innerHTML = ''
    document.getElementById('inProgress-container').innerHTML = ''
    document.getElementById('awaitingFeedback-container').innerHTML = ''
    document.getElementById('done-container').innerHTML = ''
    filterTasks()
}

/**
 * is used to so sort the content from the backend
 */
function filterTasks() {
    for (let i = 0; i < tasks.length; i++) {
        let currentTask = tasks[i]
        let content = document.getElementById(`${currentTask.status}-container`)
        forwardTaskContent(currentTask, content, i)
    }
}

async function deleteTask(i) {
    tasks.splice(i, 1);
    await backend.setItem('tasks', JSON.stringify(tasks));
    loadBackend();
    loadTasks();
}


/**
 * is used to render the backend content
 * @param {object} currentTask 
 * @param {html container} content 
 * @param {number} i 
 */
function forwardTaskContent(currentTask, content, i) {
    renderAllTasks(currentTask, content, i)
    renderContactSelection(currentTask, i)
    renderProgressBar(i)
}

/**
 * is used to render the progress bar
 * 
 * @param {number} i 
 */
function renderProgressBar(i) {
    if (tasks[i].subtasks.length > 0) {
        let totalSubtasks = tasks[i].subtasks.length
        let completedSubtasks = 0
        for (let k = 0; k < tasks[i].sTStatus.length; k++) {
            if (tasks[i].sTStatus[k] == true) {
                completedSubtasks++
            }
            if (tasks[i].sTStatus[k] == false) {
            }
        }
        let progressBar = document.getElementById(`subtask-progress-bar-${i}`)
        progressBar.innerHTML =
    /*html*/`
    <progress style="margin-right:8px" id="file" value="${completedSubtasks}" max="${totalSubtasks}"> 32% </progress>
    <label for="file" id="progress-count-${i}">${completedSubtasks}/${totalSubtasks}</label>
    `
    }
}

/**
 * is used to render all tasks
 * @param {object} currentTask 
 * @param {html container} content 
 * @param {number} i 
 */
function renderAllTasks(currentTask, content, i) {
    content.innerHTML += htmlRenderAllTasks(currentTask, i)
    getPrioImage(currentTask, i)
    getTaskCategoryColor(i)
}

/**
 * is used to render the priority image 
 * @param {object} currentTask 
 * @param {number} i 
 */
function getPrioImage(currentTask, i) {
    let content = document.getElementById(`${currentTask.prio}_${i}`)
    if (content.id == `low_${i}`) {
        let img = document.createElement('img')
        img.src = 'assets/img/prio-low.svg'
        content.appendChild(img)
    } else if (content.id == `medium_${i}`) {
        let img = document.createElement('img')
        img.src = 'assets/img/prio-medium.svg'
        content.appendChild(img)
    } else if (content.id == `urgent_${i}`) {
        let img = document.createElement('img')
        img.src = 'assets/img/prio-urgent.svg'
        content.appendChild(img)
    }
}

/**
 * is used to get the corret color for every category
 * @param {number} i 
 */
function getTaskCategoryColor(i) {
    for (let j = 0; j < categorys.length; j++) {
        if (categorys[j].name == tasks[i].category) {
            document.getElementById(i).firstElementChild.style = `background-color: ${categorys[j].color}`
            if (cardOpened) {
                document.getElementById('card-container').children[1].style = `background-color: ${categorys[j].color}`
            }
        }
    }
}

/**
 * is used to render the contact selection
 * @param {object} currentTask 
 * @param {number} i 
 */
function renderContactSelection(currentTask, i) {
    for (let k = 0; k < currentTask.contactSelection.length; k++) {
        for (let j = 0; j < contacts.length; j++) {
            if (currentTask.contactSelection[k] == contacts[j].ID) {
                currentContact = contacts[j].initials
                if (currentTask.contactSelection.length < 3) {
                    showAllContacts(currentTask, i, currentContact, j)
                    getContactColor(i, k, j)
                } else {
                    showFirstTwoContacts(k, currentTask, i, currentContact, j)
                    getContactColor(i, k, j)
                }
            }
        }
    }
}

/**
 * is used to render all contacts for every task
 * @param {object} currentTask 
 * @param {number} i 
 * @param {object} currentContact 
 * @param {number} j 
 */
function showAllContacts(currentTask, i, currentContact, j) {
    document.getElementById(`contact-selection-${currentTask.status}_${i}`).innerHTML +=
    /*html*/ `
    <div class="circleB" id="${contacts[j].ID}_${i}">${currentContact}</div>
    `
}

/**
 * is used to render the first two contacts for every task, and get a counter for the remaining contacts
 * @param {number} k 
 * @param {object} currentTask 
 * @param {number} i 
 * @param {object} currentContact 
 */
function showFirstTwoContacts(k, currentTask, i, currentContact, j) {
    if (k < 2) {
        document.getElementById(`contact-selection-${currentTask.status}_${i}`).innerHTML +=
        /*html*/ `
        <div class="circleB" id="${contacts[j].ID}_${i}">${currentContact}</div>
        `
    } else if (k == 2) {
        document.getElementById(`contact-selection-${currentTask.status}_${i}`).innerHTML +=
        /*html*/ `
        <div style="background-color:#2A3647;" class="circleB" id="remaining-contacts-number-${i}">${'+' + (currentTask.contactSelection.length - 2)}</div>
        `
    }
}

/**
 * is used to render the color for every contact
 * @param {number} i 
 * @param {number} k 
 * @param {number} j 
 */
function getContactColor(i, k, j) {
    for (let l = 0; l < contacts.length; l++) {
        if (k < 2) {
            if (contacts[l].ID == tasks[i].contactSelection[k]) {
                document.getElementById(`${contacts[j].ID}_${i}`).style = `background-color: ${contacts[l].color}`
            }
        } else if (k == 3) {
            document.getElementById(`remaining-contacts-number-${i}`).style = `background-color: #2A3647; color: #FFFFFF`
        }
    }
}


/**
 * is used to render the detailed view of the clicked task
 * @param {number} i 
 */
function loadCard(i) {
    cardOpened = true
    if (window.innerWidth < 1000) {
        main.classList.add('d-none')
    }
    body.classList.add('overflow-hidden')
    let overlay = document.getElementById('overlay')
    overlay.classList.remove('d-none')
    renderCard(i, overlay)
    renderCardContacts(i)
    getCardPrioImg(i)
    getTaskCategoryColor(i)
}

/**
 * is used to render the detailed view of the clicked task
 * @param {number} i 
 * @param {html container} overlay 
 */
function renderCard(i, overlay) {
    overlay.innerHTML = htmlRenderCard(i)
    document.getElementById('card-container').classList.remove('d-none')
}

/**
 * is used to stop the overlay onclick function when pressing buttons on the card
 * @param {string} event 
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * is used to render the contacts on the card
 * @param {number} i 
 */
function renderCardContacts(i) {
    let container = document.getElementById('contact-card-container')
    tasks[i].contactSelection.forEach(element => {
        for (let j = 0; j < contacts.length; j++) {
            let contact = contacts[j]
            if (element == contacts[j].ID) {
                container.innerHTML +=
                /*html*/ `
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
 * is used to render the contacts on the card
 * @param {number} i 
 */
function renderCardContactsEdit(i) {
    let container = document.getElementById('contact-card-container')
    container.innerHTML = '';
    container.style = "display:flex"
    tasks[i].contactSelection.forEach(element => {
        for (let j = 0; j < contacts.length; j++) {
            let contact = contacts[j]
            if (element == contacts[j].ID) {
                container.innerHTML +=
                /*html*/ `
                <div class="contact-card-content">
                    <p class="circleB" style="background-color:${contact.color}">${contact.initials}</p> 
                </div>
                `
            }
        }
    });
}

/**
 * is used to render the correct prio image on the card
 * @param {number} i 
 */
function getCardPrioImg(i) {
    let content = document.getElementById(`card-${tasks[i].prio}`)
    let img = document.createElement('img')
    img.src = `assets/img/${content.id}.svg`
    content.appendChild(img)
}

/**
 * is used to search all tasks
 */
function searchTasks() {
    let input = document.getElementById('find-task-input')
    for (let i = 0; i < tasks.length; i++) {
        let content = document.getElementById(`${i}`)
        if ((tasks[i].title.toLowerCase().includes(input.value.toLowerCase()))) {
            content.classList.remove('d-none')
        } else if ((tasks[i].description.toLowerCase().includes(input.value.toLowerCase()))) {
            content.classList.remove('d-none')
        } else {
            content.classList.add('d-none')
        }
    }
}



