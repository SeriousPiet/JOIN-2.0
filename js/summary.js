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
 * Description: Initializes the application by setting up the backend URL, downloading data from the server, and populating tasks, categories, and contacts.
 */
async function init() {
  setURL(
    "https://its-getting-serious.de/JOIN-2.0/smallest_backend_ever"
  );
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem("tasks")) || [];
  categorys = JSON.parse(backend.getItem("categorys")) || [];
  contacts = JSON.parse(backend.getItem("contacts")) || [];
  summary();
}

/**
 * Description: Callfunction.
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
 * Description:  Calculates und displays the amount of all tasks in board.
 */
function tasksInBoard() {
  document.getElementById("tasksInBoard").innerHTML = tasks.length;
}

/**
 * Description: Categorizes tasks based on their status and counts them in respective arrays.
 */
function countTasks() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    let status = task.status;
    if (status === "inProgress") {
      taskInProgress.push(status);
    } else if (status === "awaitingFeedback") {
      taskAwaitingFeedback.push(status);
    } else if (status === "toDo") {
      taskToDo.push(status);
    } else if (status === "done") {
      taskDone.push(status);
    }
  }
  displayNumbers();
}

/**
 * Description: Counts and tracks tasks with an 'urgent' priority.
 */
function countUrgentTasks() {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    let prio = task.prio;
    let date = task.date;
    if (prio === "urgent") {
      taskUrgent.push(prio);
      urgentDate.push(date);
    }
  }
  displayNumbers();
}

/**
 * Description: Updates the display of the earliest deadline date among urgent tasks.
 */
function date() {
  if (urgentDate.length === 0) {
    newDate = "No Deadline";
    document.getElementById("date").innerHTML = newDate;
  } else {
    const datesArray = urgentDate.map((element) => new Date(element));
    const minDate = new Date(Math.min(...datesArray));
    newDate = minDate.toLocaleString("en-us", {
      month: "long",
      year: "numeric",
      day: "numeric",
    });
    document.getElementById("date").innerHTML = newDate;
  }
}

/**
 * Description: Updates the display of task counts for different statuses and urgent tasks.
 */
function displayNumbers() {
  document.getElementById("tasksInProgress").innerHTML = taskInProgress.length;
  document.getElementById("awaitingFeedback").innerHTML =
    taskAwaitingFeedback.length;
  document.getElementById("toDo").innerHTML = taskToDo.length;
  document.getElementById("done").innerHTML = taskDone.length;
  document.getElementById("urgent").innerHTML = taskUrgent.length;
}

/**
 * Description: Displays a personalized greeting message based on the time of day.
 */
function greeting() {
  let greet;
  let myDate = new Date();
  let hrs = myDate.getHours();

  if (hrs < 12) greet = "Good Morning";
  else if (hrs >= 12 && hrs <= 18) greet = "Good Afternoon";
  else if (hrs >= 18 && hrs <= 24) greet = "Good Evening";

  document.getElementById("greeting").innerHTML = greet;
  document.getElementById("greetingName").innerHTML = getNameLogin();;
}

/**
 * Description: Retrieves and returns the name of the currently logged-in user.
 * @returns {string} The name of the currently logged-in user.
 */
function getNameLogin() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  return user;
}

/**
 * Description: Displays a greeting message to the user on mobile devices.
 */
function mobileGreeting() {
  if (window.innerWidth <= 1500) {
    setTimeout(mobileGreetingDisappears, 2000);
  } else {
    document.getElementById("greeting-container").classList.remove("d-none");
  }
}

/**
 * Description: Hides the mobile greeting message container.
 */
function mobileGreetingDisappears() {
  document.getElementById("greeting-container").classList.add("d-none");
}