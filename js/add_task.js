let prio;
let selectedColor;
let selectedCategory;
let selectedContacts = [];
let inAnimation = false;
let sTStatus = [];
let taskStatus;
let subtasks = [];



async function initAddTask() {
    setURL('https://peter-wallbaum.developerakademie.net/JOIN-2.0/smallest_backend_ever');
    renderCategorys();
    await renderContacts();
    editCreateBtnOnMobile();
    setToday();
    getSavedTaskStatus()
}

/**
 * read the inputfields
 */
function readForm() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let date = document.getElementById('date');
    addTask(title, description, date);
}


function getSavedTaskStatus() {
    savedTaskStatus = JSON.parse(localStorage.getItem('savedTaskStatus')) || [];
    if (savedTaskStatus.length > 0) {
        taskStatus = savedTaskStatus;
    } else {
        taskStatus = 'toDo';
    }
}

function scriptDetection(text) {
    let newText = text
    for (let i = 0; i < newText.length; i++) {
        if (newText.includes('<'))
            newText = newText.replace('<', '&lt');
        if (newText.includes('>'))
            newText = newText.replace('>', '&gt');
        
    }
    return newText
}

/**
 * create the task and send it to the backend
 * @param {*} title - title input
 * @param {*} description - description input
 * @param {*} date - date input
 */
async function addTask(title, description, date) {
    if (prio == undefined || selectedCategory == undefined) {
        errorMassage('errorTask', "select category and priority")
    } else {
        await setNewTask(title, description, date)
        clearSavedTaskStatus()
        clearForm();
        showTaskAdded();
        intervalsAndNextPage();
    }
}

/**
 * set the new task and push to the backend
 * @param {*} title 
 * @param {*} description 
 * @param {*} date 
 */
async function setNewTask(title, description, date) {
    let newTask = {
        'status': taskStatus,
        'title': scriptDetection(title.value),
        'description': scriptDetection(description.value),
        'category': selectedCategory,
        'contactSelection': selectedContacts,
        'date': date.value,
        'prio': prio,
        'subtasks': subtasks,
        'sTStatus': sTStatus
    };
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    tasks.push(newTask);
    await backend.setItem('tasks', JSON.stringify(tasks));
}

/**
 * set the error message
 * @param {*} div 
 * @param {*} message 
 */
function errorMassage(div, message) {
    let content = document.getElementById(div);
    content.style = 'color: red;';
    content.innerHTML = message;
    setTimeout(() => {
        content.style = 'display: none;'
    }, 3000);
}

/**
 * is used to stop all intervals and go to board
 */
function intervalsAndNextPage() {
    if (document.getElementById('add-task-byboard-container')) {
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }
    setTimeout(() => {
        window.document.location.href = "./board.html";
    }, 1000);
}


/**
 * is used to clear the status from local storage
 */
function clearSavedTaskStatus() {
    savedTaskStatus = '';
    localStorage.setItem(`savedTaskStatus`, JSON.stringify(savedTaskStatus));
}


/**
 * the function added the css class btn-on-focus to the selected button
 * @param {string} i - name of the button 
 */
function setprio(i) {
    let btns = ['urgent', 'medium', 'low'];
    let btnColor = ['#FF3D00', '#FFA800', '#7AE229'];
    if (i) {
        let selectedBtn = btns.indexOf(i)
        btns.splice(selectedBtn, 1)
        document.getElementById(i).classList.add('btn-on-focus');
        document.getElementById(i).style = `background-color: ${btnColor[selectedBtn]};`;
    }
    btns.forEach(e => {
        document.getElementById(e).classList.remove('btn-on-focus');
        document.getElementById(e).style = ``;
    });
    prio = i;
}

/**
 * this fuction clear the Inputfields & all the selections
 */
async function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('subtasks').innerHTML = '';
    prio = '';
    subtasks = [];
    selectedCategory = [];
    selectedContacts = [];
    sTStatus = [];
    await backend.setItem('selectedContacts', JSON.stringify(selectedContacts));
    renderSelectedContacts();
    renderContacts();
    selectCategory('reload');
    setprio();
}


/**
 * added the subtasks
 */
function addSubtask() {

    let subTask = document.getElementById('subtask');
    let content = document.getElementById('subtasks');
    content.innerHTML = '';
    if (subTask.value.length < 2) {
        content.innerHTML += `<div style="color: red;">length to small</div>`;
    }
    else {
        let newSubTask = scriptDetection(subTask.value)
        subtasks.push(newSubTask);
        sTStatus.push(false);
        subTask.value = '';
    };
    renderSubTasks();
}


/**
 * show the inputfield to create a new category & hide the dropdown menu 
 */
function showNewCategoryInput() {
    let content = document.getElementById('categoryShow');
    document.getElementById('newCategoryInput').classList.remove('d-none');
    content.classList.add('d-none');
    renderCategoryColors();
}

/**
 * add a new Category & push it to the backend
 */
async function addNewCategory() {
    let content = document.getElementById('newCategory').value;
    let newCategory = {
        'name': content,
        'color': selectedColor
    };
    content.value = '';
    categorys.push(newCategory);
    await backend.setItem('categorys', JSON.stringify(categorys));
    closeNewCategoryInput();
    renderCategorys();
}

/**
 * hide the inputfield & show the dropdown menu
 */
function closeNewCategoryInput() {
    document.getElementById('newCategoryInput').classList.add('d-none');
    document.getElementById('categoryShow').classList.remove('d-none');
}

/**
 * render the subtasks
 */
function renderSubTasks() {
    let content = document.getElementById('subtasks');
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        content.innerHTML += `<li><input onclick="checkSubTask(${i})" id="cb-subtask-${i}" class="checkbox" type="checkbox" control-id="ControlID-12"> ${subtask}</li>`;
    }
}

/**
 * set the array on the position from the subtask to true
 * @param {int} id number in the array
 */
function checkSubTask(id) {
    sTStatus[id] = true;
    document.getElementById('cb-subtask-' + id).setAttribute('onclick', `uncheckSubTask(${id})`);
}

/**
 * set the array on the position from the subtask to false
 * @param {int} id number in the array
 */
function uncheckSubTask(id) {
    sTStatus[id] = false;
    document.getElementById('cb-subtask-' + id).setAttribute('onclick', `checkSubTask(${id})`);
}

/**
 * render the categorys
 */
async function renderCategorys() {
    let content = document.getElementById('category');
    content.innerHTML = '';
    content.innerHTML += `<div class="categorys" onclick="showNewCategoryInput()">New Category</div>`
    await downloadFromServer();
    categorys = JSON.parse(backend.getItem('categorys')) || [];
    for (let i = 0; i < categorys.length; i++) {
        let category = categorys[i];
        content.innerHTML += `<div class="categorys" onclick="selectCategory(${i})">${category['name']} <div style="background-color: ${category['color']}; width: 15px;
            height: 15px; border-radius: 100%;"></div></div>`
    }
}

/**
 * render the color buttons to select the color for a new category
 */
function renderCategoryColors() {
    let colors = ['#8AA4FF', '#FF0000', '#2AD300', '#FF8A00', '#E200BE', '#0038FF'];
    let content = document.getElementById('categoryColors');
    content.innerHTML = '';
    for (let i = 0; i < colors.length; i++) {
        content.innerHTML += `<div class="color-circle" onclick="selectColor('${colors[i]}')" style="background-color: ${colors[i]};">`
    }
}

/**
 * is for the color select buttons 
 * @param {string} color - color hexcode
 */
function selectColor(color) {
    selectedColor = color;
}

/**
 * select the category
 * @param {*} i - the category number
 */
function selectCategory(i) {
    if (i == 'reload') {
        document.getElementById('selectCategory').innerHTML = 'Select task category';
    } else {
        selectedCategory = categorys[i]['name'];
        document.getElementById('selectCategory').innerHTML = `${categorys[i]['name']} <div style="background-color: ${categorys[i]['color']}; width: 15px;
        height: 15px; border-radius: 100%;"></div> `;
    }
    dropup('category');
}

/**
 * render the contacts to dropdown menu
 */
async function renderContacts() {
    let content = document.getElementById('contact');
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    content.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        content.innerHTML += `<label for="cb-contacts-${contacts[i]['ID']}"> <div class="contacts">${contact['name']} <input onclick="addContactToList(${contacts[i]['ID']})" id="cb-contacts-${contacts[i]['ID']}" class="checkbox" type="checkbox" control-id="ControlID-12"></div></label>`
    }
}

/**
 * open the dropdown
 * @param {string} area - contact or category to open the right dropdown
 */
function dropdown(area) {
    if (!inAnimation) {
        let content = document.getElementById(area);
        let bigArea = area[0].toUpperCase() + area.slice(1);
        content.classList.remove('d-none')
        document.getElementById(area + 'Show').style = 'animation: dropdown 2s ease;'
        document.getElementById(`arrow${bigArea}`).style = 'animation: arrowUp 350ms ease; transform: rotate(180deg);'
        document.getElementById(`select${bigArea}`).setAttribute('onclick', `dropup('${area}')`);
        document.getElementById(`arrow${bigArea}`).setAttribute('onclick', `dropup('${area}')`);
    }
}

/**
 * close the dropdown
 * @param {string} area - contact or category to close the right dropdown
 */
function dropup(area) {
    let content = document.getElementById(area);
    let areaShow = document.getElementById(area + 'Show')
    inAnimation = true;
    let bigArea = area[0].toUpperCase() + area.slice(1);
    editEndHeight(areaShow);
    document.getElementById('select' + bigArea).setAttribute('onclick', `dropdown('${area}')`);
    document.getElementById('arrow' + bigArea).setAttribute('onclick', `dropdown('${area}')`);
    areaShow.style = 'animation: dropup 500ms ease;';
    document.getElementById('arrow' + bigArea).style = 'animation: arrowDown 350ms ease;';
    setTimeout(() => {
        content.classList.add('d-none');
        inAnimation = false;
    }, 500);
}

/**
 * add the contact ID to selectedContacts variable
 * @param {int} id - the contact ID
 */
function addContactToList(id) {
    let contact = document.getElementById(`cb-contacts-${id}`);
    selectedContacts.push(id);
    contact.setAttribute('onclick', `removeContactFromList(${id})`);
    renderSelectedContacts();
}

/**
 * remove the contact ID from selectedContacts variable
 * @param {int} id - the contact ID
 */
function removeContactFromList(id) {
    let contact = document.getElementById(`cb-contacts-${id}`);
    contact.setAttribute('onclick', `addContactToList(${id})`);
    for (let i = 0; i < contacts.length; i++) {
        let index = selectedContacts.indexOf(id);
        if (index != -1) {
            selectedContacts.splice(index, 1);
        }
    };
    renderSelectedContacts();
}

/**
 * render the selectedcontacts
 */
function renderSelectedContacts() {
    let content = document.getElementById('selectContact');
    content.innerHTML = '';
    if (selectedContacts.length > 0) {
        for (let i = 0; i < contacts.length; i++) {
            let contact = contacts[i]['ID'];
            for (let j = 0; j < selectedContacts.length; j++) {
                if (contact == selectedContacts[j]) {
                    content.innerHTML += `<div class="circle" style="background-color: ${contacts[i]['color']};": >${contacts[i]['initials']}</div>`
                }
            }
        }
    } else {
        content.innerHTML = 'Select contacts to assign';
    }
}

/**
 * shows the task added div if the task created and hide it with animation
 */
function showTaskAdded() {
    let taskAdded = document.getElementById('taskAdded');
    taskAdded.classList.remove('d-none');
    taskAdded.style = 'animation: comeIn 1s ease;';
    setTimeout(() => {
        taskAdded.style = 'animation: comeOut 1s ease;';
    }, 2000);
    setTimeout(() => {
        taskAdded.classList.add('d-none');
    }, 2500);
}

/**
 * edit the css variable --end-height to the height from the div
 * @param {string} content - div id
 */
function editEndHeight(content) {
    document.documentElement.style.setProperty('--end-height', content.clientHeight + 'px')
}

/**
 * edit the create button if the max display width is < 1000px
 */
function editCreateBtnOnMobile() {
    setInterval(() => {
        let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        if (width < 1000) {
            document.getElementById('createBtn').innerHTML = `Create
        <svg width="18" height="15" viewBox="0 0 18 15" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7.5L7 13.5L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
    	`
        } else {
            document.getElementById('createBtn').innerHTML = `Create Task
            <svg width="18" height="15" viewBox="0 0 18 15" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7.5L7 13.5L17 1.5" stroke="white" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>`
        }
    }, 500);

}

/**
 * this fuction set the min date from the date input to today
 */
function setToday() {
    let today = new Date()
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('date').setAttribute('min', today)
}
