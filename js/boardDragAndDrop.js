/*********Edit Task Dropdown Menu************/

/**
 * is used to render the contacts in the drop down menu
 * @param {number} i 
 */
async function renderEditContacts(i) {
    let content = document.getElementById('contact');
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    content.innerHTML = '';
    for (let j = 0; j < contacts.length; j++) {
        let contact = contacts[j];
        content.innerHTML += `<label for="cb-contacts-${contact['ID']}"> <div class="contacts">${contact['name']} <input onclick="addEditContactToList(${contact['ID']},${i})" id="cb-contacts-${contact['ID']}" class="checkbox" type="checkbox" control-id="ControlID-12"></div></label>`
        if (j == contacts.length - 1) {
            let j = contacts.length
            content.innerHTML += `<label for="cb-subtask-${j}"> <div class="contacts">Intive new contact <input onclick="inviteNewContact(${i})" id="cb-subtask-${j}" class="subtask-checkbox" type="checkbox" control-id="ControlID-12"></div></label>`
        }
    }
}

/**
 * is used to invite a new contact to the task
 * @param {number} i 
 */
function inviteNewContact(i) {
    let areaB = 'contact'
    dropup(areaB)
    let content = document.getElementById('contactShow')
    content.innerHTML = renderInviteNewContactArea(i)
}

/**
 * is used to check if contacts are already part of task
 * @param {number} i 
 */
function checkForSelectedContacts() {
    for (let j = 0; j < contacts.length; j++) {
        let container = document.getElementById('contact-card-container')
        let i = container.className.slice(0, 1)
        let contact = contacts[j];
        if (tasks[i].contactSelection.includes(contact.ID)) {
            document.getElementById(`cb-contacts-${contact.ID}`).checked = true
        }
    }
}

/**
 * is used to show all contacts in drop down menu
 * @param {number} i 
 */
function showDropDownB(i) {
    loadEditTask(i)
}

/**
 * is used to open the drop down menu
 * @param {string} areaB 
 * @param {number} i 
 */
function dropdownB(areaB, i) {
    if (!inAnim) {
        let content = document.getElementById(areaB);
        let bigArea = areaB[0].toUpperCase() + areaB.slice(1);
        content.classList.remove('d-none')
        document.getElementById(areaB + 'Show').style = 'animation: dropdown 2s ease;'
        document.getElementById(`arrow${bigArea}`).style = 'animation: arrowUp 350ms ease; transform: rotate(180deg);'
        document.getElementById(`select${bigArea}`).setAttribute('onclick', `dropup('${areaB}')`);
        document.getElementById(`arrow${bigArea}`).setAttribute('onclick', `dropup('${areaB}')`);
        checkForSelectedContacts(i)
    }
}

/**
 * is used to close the drop down menu
 * @param {string} areaB 
 */
function dropupB(areaB) {
    let content = document.getElementById(areaB);
    let areaShow = document.getElementById(areaB + 'Show')
    inAnim = true;
    let bigArea = areaB[0].toUpperCase() + areaB.slice(1);
    editEndHeight(areaShow);
    document.getElementById('select' + bigArea).setAttribute('onclick', `dropdown('${areaB}')`);
    document.getElementById('arrow' + bigArea).setAttribute('onclick', `dropdown('${areaB}')`);
    areaShow.style = 'animation: dropup 500ms ease;';
    document.getElementById('arrow' + bigArea).style = 'animation: arrowDown 350ms ease;';
    setTimeout(() => {
        content.classList.add('d-none');
        inAnim = false;
    }, 500);
}

/**
 * is used to 
 * @param {string} content 
 */
function editEndHeight(content) {
    document.documentElement.style.setProperty('--end-height', content.clientHeight + 'px')
}

/**
 * is used to add contacts to the task
 * @param {number} j 
 * @param {number} i 
 */
async function addEditContactToList(j, i) {
    if (document.getElementById(`cb-contacts-${j}`).checked) {
        tasks[i].contactSelection.push(j)
        await backend.setItem(`tasks`, JSON.stringify(tasks));
    } else {
        let index = tasks[i].contactSelection.indexOf(j)
        tasks[i].contactSelection.splice(index, 1)
        await backend.setItem(`tasks`, JSON.stringify(tasks));
    }
    renderCardContactsEdit(i);
}


/*********Drag and Drop Function************/


/**
 * is used to get the dragged Element in a parameter
 * @param {string} id 
 */
function dragstart_handler(id) {
    currentDraggedElement = id
}

/**
 * is used to stop events while dragging
 * @param {string} ev 
 */
function dragover_handler(ev) {
    ev.preventDefault();
}

/**
 * is used to drop tasks in a new area
 * @param {string} status 
 */
async function drop_handler(status) {
    tasks[currentDraggedElement].status = status;
    await backend.setItem(`tasks`, JSON.stringify(tasks));
    loadTasks()
}

/**
 * is used to highlight the areas where tasks can be dropped
 * @param {string} id 
 */
function highlightArea(id) {
    let container = document.getElementById(id)
    container.classList.remove('d-none')
    editToDoArea()
    editInProgress()
    editAwaitFeed()
    editDone()
}

/**
 * is used to highlight the hovered area, when it has no content
 */
function editToDoArea() {
    let toDo = document.getElementById('toDo-container')
    let toDoDragArea = document.getElementById('to-do-container-drag-area')
    if (toDo.innerHTML.length == 0) {
        toDoDragArea.classList.add('margin-top')
    }
}

/**
 * is used to highlight the hovered area, when it has no content
 */
function editInProgress() {
    let inProgress = document.getElementById('inProgress-container')
    let inProgressDragArea = document.getElementById('in-progress-container-drag-area')
    if (inProgress.innerHTML.length == 0) {
        inProgressDragArea.classList.add('margin-top')
    }
}

/**
 * is used to highlight the hovered area, when it has no content
 */
function editAwaitFeed() {
    let awaitFeed = document.getElementById('awaitingFeedback-container')
    let awaitFeedDragArea = document.getElementById('awaiting-feedback-container-drag-area')
    if (awaitFeed.innerHTML.length == 0) {
        awaitFeedDragArea.classList.add('margin-top')
    }
}

/**
 * is used to highlight the hovered area, when it has no content
 */
function editDone() {
    let done = document.getElementById('done-container')
    let doneDragArea = document.getElementById('done-container-drag-area')
    if (done.innerHTML.length == 0) {
        doneDragArea.classList.add('margin-top')
    }
}

/**
 * is used to remove the highlited areas
 * @param {string} id 
 */
function removeHighlightArea(id) {
    let container = document.getElementById(id)
    container.classList.add('d-none')

}

/**
 * is used to highlight the areas where tasks can be dropped
 * @param {number} id 
 */
function highliteDragArea(id) {
    let container = document.getElementById(id)
    container.classList.remove('d-none')
}

/**
 * is used to remove the highlited areas
 * @param {string} id 
 */
function removeHighlightDragArea(id) {
    let container = document.getElementById(id)
    container.classList.add('d-none')
    container.classList.remove('margin-top')
}

/**
 * is used to hide and make visible the date icon
 */
function hideIcon() {
    let content = document.getElementById('edit-task-date-icon')
    if (!content.classList.contains('d-none')) {
        content.classList.add('d-none')
    } else if (content.classList.contains('d-none')) {
        content.classList.remove('d-none')
    }
}

/**
 * is used to hide the drag container
 */
function removeTest(id) {
    let targetContainer = ['to-do', 'in-progress', 'awaiting-feedback', 'done']
    for (let i = 0; i < targetContainer.length; i++) {
        let element = document.getElementById(targetContainer[i] + '-container-drag-area');
        element.classList.add('d-none')
    }
}

/**
 * is used for mobile change task
 * @param {string} id 
 */
function touchStart(id) {
    if (!timer) {
        timer = setTimeout(() => {
            container = document.getElementById(id)
            console.log(container.getAttribute('status'))
            if (container.getAttribute('status') == 'closed') {
                onlongtouch(id)
                container.setAttribute('status', 'opened')
            }
        }, duration);
    }
}

/**
 * is used for mobile change task
 * @param {string} id 
 */
function touchEnd(id) {
    if (timer) {
        clearTimeout(timer)
        timer = false;
    }
}

/**
 * is used for mobile change task
 * @param {string} id 
 */
function onlongtouch(id) {
    let container = document.getElementById(id)
    for (let j = 0; j < 5; j++) {
        container.children[j].classList.add('opacity')
    }
    container.innerHTML +=
  /*html*/ `
  <div class="move-to-container" onclick="event.stopImmediatePropagation()">
    <div onclick="moveTo(${id}, 'toDo')"><p>To Do</p></div>
    <div onclick="moveTo(${id}, 'inProgress')"><p>In Progress</p></div>
    <div onclick="moveTo(${id}, 'awaitingFeedback')"><p>Awaiting Feedback</p></div>
    <div onclick="moveTo(${id}, 'done')"><p>Done</p></div>
  </div>
  `
}

/**
 * is used for mobile change task
 * @param {string} id 
 * @param {string} newStatus 
 */
async function moveTo(id, newStatus) {
    tasks[id].status = newStatus
    await backend.setItem(`tasks`, JSON.stringify(tasks));
    loadTasks()
}