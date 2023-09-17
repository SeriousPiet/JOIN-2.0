let tasks = [];
let categorys = [];
let contacts = [];
let taskInProgress = [];
let taskAwaitingFeedback = [];
let taskToDo = [];
let taskDone = [];
let taskUrgent = [];
let urgentDate = [];


/**
 * is used to load the content from the backend
 */
async function init() {
    setURL('https://kevin.rohlf.io/join/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    categorys = JSON.parse(backend.getItem('categorys')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];

    summary();
}


/**
 * is used to call other functions
 */
function summary() {
    greeting();
    mobileGreeting();
    tasksInBoard();
    countTasks();
    countUrgentTasks();
    date();
}


/**
 * is used to calculate und display the amount of all tasks in board
 */
function tasksInBoard() {
    document.getElementById('tasksInBoard').innerHTML = tasks.length;
}


/**
 * is used to separate the amount of tasks in progress, 
 * tasks awaiting feedback, tasks to-do and tasks done
 */
function countTasks() {
    for (let i = 0; i < tasks.length; i++) { 
        const task = tasks[i];
        let status = task.status;
        if (status === 'inProgress') { 
            taskInProgress.push(status);
        } else if (status === 'awaitingFeedback') {
            taskAwaitingFeedback.push(status);
        } else if (status === 'toDo') {
            taskToDo.push(status);
        } else if (status === 'done') {
            taskDone.push(status);
        }
    }
    displayNumbers();
}


/**
 * is used to find the due dates of the urgent tasks
 */
function countUrgentTasks() {
    for (let i = 0; i < tasks.length; i++) { 
        const task = tasks[i];
        let prio = task.prio;
        let date = task.date;
        if (prio === 'urgent') { 
            taskUrgent.push(prio);
            urgentDate.push(date);
        }
    }
    displayNumbers();
}


/**
 * is used to find and display the nearest date of the urgent tasks
 */
function date() {
    if (urgentDate.length === 0) {
        newDate = 'No Deadline';
        document.getElementById('date').innerHTML = newDate;
    } else {
        const datesArray = urgentDate.map((element) => new Date(element));
        const minDate = new Date(Math.min(...datesArray));
        newDate = minDate.toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'});
        document.getElementById('date').innerHTML = newDate;
    }
    }
    


/**
 * is used to display the amount of tasks in progress, 
 * tasks awaiting feedback, tasks to-do, tasks done and tasks 
 */
function displayNumbers() {
    document.getElementById('tasksInProgress').innerHTML = taskInProgress.length;
    document.getElementById('awaitingFeedback').innerHTML = taskAwaitingFeedback.length;
    document.getElementById('toDo').innerHTML = taskToDo.length;
    document.getElementById('done').innerHTML = taskDone.length;
    document.getElementById('urgent').innerHTML = taskUrgent.length;
}


/**
 * is used to greet the desktop user
 */
function greeting() {
    let greet;
    let myDate = new Date();
    let hrs = myDate.getHours();

    if (hrs < 12)
        greet = 'Good Morning';
    else if (hrs >= 12 && hrs <= 18)
        greet = 'Good Afternoon';
    else if (hrs >= 18 && hrs <= 24)
        greet = 'Good Evening';

    document.getElementById('greeting').innerHTML = greet;
    document.getElementById('greetingName').innerHTML = getNameLogin();
}


/**
 * is used to return the name of user
 */
function getNameLogin() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    return user;
}


/**
 * is used to greet the mobile user
 */
function mobileGreeting() {
    if (window.innerWidth <= 1500) {
        setTimeout(mobileGreetingDisappears, 2000);
    } else {
        document.getElementById('greeting-container').classList.remove('d-none');
    }
}


/**
 * is used to hide the mobile greeting container after greeting
 */
function mobileGreetingDisappears() {
    document.getElementById('greeting-container').classList.add('d-none');
}