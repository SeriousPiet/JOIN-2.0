/**
 * is used to render the edit task section
 * @param {number} i 
 */
function loadEditTask(i) {
    renderEditTask(i)
    renderEditContacts(i);
    renderCardContactsEdit(i)
    highlightPrio(i)
}

/**
 * is used to render the edit task section
 * @param {number} i 
 */
function renderEditTask(i) {
    let content = document.getElementById('card-container')
    content.innerHTML = htmlRenderEditTask(i)
    let subtasks = document.getElementById('edit-task-subtasks-container')
    if (tasks[i].subtasks.length > 0) {
        subtasks.innerHTML = `<p>Subtasks</p>`
        for (let j = 0; j < tasks[i].subtasks.length; j++) {
            subtasks.innerHTML +=
            /*html*/`
                <div class="subtasksB">${tasks[i].subtasks[j]} <input onclick="updateSubtask(${j},${i})" id="subtask-${j}" class="checkbox" type="checkbox"></div>
            `
        }
        checkForCompletedSubtasks(i)
    }
}

/**
 * is used to check if the subtasks are completed or not and render the status
 * @param {number} i 
 */
function checkForCompletedSubtasks(i) {
    for (let j = 0; j < tasks[i].sTStatus.length; j++) {
        if (tasks[i].sTStatus[j] == true) {
            document.getElementById(`subtask-${j}`).checked = 'true'
        }
    }
}

/**
 * is used to update the subtask status in backend
 * @param {number} j 
 * @param {number} i 
 */
async function updateSubtask(j, i) {
    let checked = document.getElementById(`subtask-${j}`).checked
    if (checked) {
        tasks[i].sTStatus[j] = true;
        await backend.setItem(`tasks`, JSON.stringify(tasks));
    } else {
        tasks[i].sTStatus[j] = false;
        await backend.setItem(`tasks`, JSON.stringify(tasks));
    }
}

/**
 * is used to the change the prio of a task when clicked and update the backend
 * @param {number} i 
 * @param {string} prio 
 */
async function changePrio(i, prio) {
    tasks[i].prio = `${prio}`
    await backend.setItem(`tasks`, JSON.stringify(tasks));
    highlightPrio(i)
}

/**
 * is used to close the detailed view and load the updates on the tasks
 * @param {number} i 
 */
function closeForm(i) {
    updateInput(i)
    closeCard()
    loadTasks()
}

/**
 * is used to close the detailed view of the tasks
 */
function closeCard() {
    cardOpened = false;
    body.classList.remove('overflow-hidden')
    document.getElementById('card-container').classList.add('d-none')
    document.getElementById('overlay').classList.add('d-none')
    if (window.innerWidth < 1000) {
        main.classList.remove('d-none')
    }
}

/**
 * is used to update title, descritpion and date of every task
 * @param {number} i 
 */
async function updateInput(i) {
    let inputTitle = document.getElementById('edit-task-title')
    let inputDescription = document.getElementById('edit-task-description')
    let inputDate = document.getElementById('edit-task-date')
    if (!inputTitle.value == '')
        tasks[i].title = inputTitle.value
    if (!inputDescription.value == '')
        tasks[i].description = inputDescription.value
    if (!inputDate.value == '')
        tasks[i].date = inputDate.value
    await backend.setItem(`tasks`, JSON.stringify(tasks));
}

/**
 * is used to show the correct prio image
 * @param {number} i 
 */
function highlightPrio(i) {
    if (tasks[i].prio == 'low')
        taskPrioLow()
    else
        taskPrioNotLow()
    if (tasks[i].prio == 'medium')
        taskPrioMedium()
    else
        taskPrioNotMedium()
    if (tasks[i].prio == 'urgent')
        taskPrioUrgent()
    else
        taskPrioNotUrgent()
}

/**
 * is used to show the correct prio image
 */
function taskPrioLow() {
    let content = document.getElementById('prio-area-low')
    content.style = 'background-color:#7AE229'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0]
    let svgPath2 = content.children[1].children[1]
    text.style.color = '#FFFFFF'
    svgPath1.style.fill = '#FFFFFF'
    svgPath2.style.fill = '#FFFFFF'
}

/**
 * is used to show the correct prio image
 */
function taskPrioNotLow() {
    let content = document.getElementById('prio-area-low')
    content.style = 'background-color:#FFFFFF'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0]
    let svgPath2 = content.children[1].children[1]
    text.style.color = '#7AE229'
    svgPath1.style.fill = '#7AE229'
    svgPath2.style.fill = '#7AE229'
}

/**
 * is used to show the correct prio image
 */
function taskPrioMedium() {
    let content = document.getElementById('prio-area-medium')
    content.style = 'background-color:#FFA800'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0].children[0]
    let svgPath2 = content.children[1].children[0].children[1]
    text.style.color = '#FFFFFF'
    svgPath1.style.fill = '#FFFFFF'
    svgPath2.style.fill = '#FFFFFF'
}

/**
 * is used to show the correct prio image
 */
function taskPrioNotMedium() {
    let content = document.getElementById('prio-area-medium')
    content.style = 'background-color:#FFFFFF'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0].children[0]
    let svgPath2 = content.children[1].children[0].children[1]
    text.style.color = '#FFA800'
    svgPath1.style.fill = '#FFA800'
    svgPath2.style.fill = '#FFA800'
}

/**
 * is used to show the correct prio image
 */
function taskPrioUrgent() {
    let content = document.getElementById('prio-area-urgent')
    content.style = 'background-color:#FF3D00'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0].children[0]
    let svgPath2 = content.children[1].children[0].children[1]
    text.style.color = '#FFFFFF'
    svgPath1.style.fill = '#FFFFFF'
    svgPath2.style.fill = '#FFFFFF'
}

/**
 * is used to show the correct prio image
 */
function taskPrioNotUrgent() {
    let content = document.getElementById('prio-area-urgent')
    content.style = 'background-color:#FFFFFF'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0].children[0]
    let svgPath2 = content.children[1].children[0].children[1]
    text.style.color = '#FF3D00'
    svgPath1.style.fill = '#FF3D00'
    svgPath2.style.fill = '#FF3D00'
}
