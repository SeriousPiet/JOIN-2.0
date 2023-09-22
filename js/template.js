let savedTaskStatus;

/**
 * Description: Initializes the web application.
 */
function init() {
  includeHTML()
}

/**
 * Description: This function searches for elements with the "w3-include-html" attribute, makes an HTTP request to fetch the specified HTML file, and inserts the content into the matching elements.
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  manipulateFooterColor()
}

/**
 * Description: Toggles the visibility of the logout button and related elements.
 */
function toggleLogoutBtn() {
  let body = document.getElementById('body');
  let btn = document.getElementById('header-extended-menu-container');
  let slideContainer = document.getElementById('slide-container');
  let overlay = document.getElementById('overlay');
  toggleLogoutBtnScreen(body, btn, slideContainer, overlay);
}

/**
 * Description: Toggles the visibility of the logout button and related elements on the screen.
 * @param {HTMLElement} body - The body element of the HTML document.
 * @param {HTMLElement} btn - The logout button element.
 * @param {HTMLElement} slideContainer - The container for sliding elements.
 * @param {HTMLElement} overlay - The overlay element.
 */
function toggleLogoutBtnScreen(body, btn, slideContainer, overlay){
  if (btn.classList.contains('d-none')) {
    setTimeout(() => {
      btn.classList.remove('d-none')
    }, 200);
    if (window.innerWidth < 1000) {
      slideContainer.classList.remove('slide-out')
    }
    overlay.classList.remove('d-none')
    body.classList.add('overflow-hidden')
  } else {
    btn.classList.add('d-none')
    overlay.classList.add('d-none')
    body.classList.remove('overflow-hidden')
  }
}

/**
 * Description: Removes the overlay and related elements from the screen.
 */
function removeOverlay() {
  setTimeout(() => {
    document.getElementById('header-extended-menu-container').classList.add('d-none')
    document.getElementById('overlay').classList.add('d-none')
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
  }, 100);
  document.getElementById('body').classList.remove('overflow-hidden')
  document.getElementById('header-menu-container').classList.remove('d-none')
  whenInnerWidth()
  whenAddTask()
}

/**
 * Description: Performs actions based on the window's inner width.
 */
function whenInnerWidth() {
  if (window.innerWidth < 1000) {
    document.getElementById('slide-container').classList.add('slide-out')
    main.classList.remove('d-none')
  }
}

/**
 * Description: Performs actions related to the addition of a task.
 */
function whenAddTask() {
  if (document.getElementById('add-task-byboard-container')) {
    setTimeout(() => {
      document.getElementById('add-task-byboard-container').classList.add('d-none')
    }, 200);
    document.getElementById('add-task-byboard-container').classList.add('slide-outA')
  }
}

/**
 * Description: Manipulates the color of footer buttons based on the current page.
 */
function manipulateFooterColor() {
  let summary = document.getElementById('summary-btn');
  let board = document.getElementById('board-btn');
  let addTask = document.getElementById('add-task-btn');
  let contacts = document.getElementById('contacts-btn');
  let legalnotice = document.getElementById('legalnotice');
  manipulateColor(summary, 'summary')
  manipulateColor(board, 'board')
  manipulateColor(addTask, 'add_task')
  manipulateColor(contacts, 'contacts')
  manipulateColor(legalnotice, 'legalnotice')
}

/**
 * Description: Manipulates the color of an HTML element based on the current page.
 * @param {HTMLElement} id - The HTML element to manipulate the color of.
 * @param {string} div - The page identifier or keyword used to determine the active page.
 */
function manipulateColor(id, div) {
  if (window.location.href.includes(div)) {
    id.classList.add('background-color')
  } else {
    id.classList.remove('background-color')
  }
}

/**
 * Description: A function that handles the window resize event and controls the visibility of the main content based on the window width and the presence of certain HTML elements.
 */
window.onresize = function () {
  if (!document.getElementById('add-task-byboard-container')) {
    if (document.getElementById('overlay').firstElementChild) {
      if (window.innerWidth > 1000 && !document.getElementById('card-container').classList.contains('d-none')) {
        main.classList.remove('d-none')
      }
      if (window.innerWidth < 1000 && !document.getElementById('card-container').classList.contains('d-none')) {
        main.classList.add('d-none')
      }
    }
  }
}

/**
 * Description: Clears the saved task status template and redirects to the "add_task.html" page.
 */
function clearSavedTaskStatusTemplate() {
  savedTaskStatus = ''
  localStorage.setItem(`savedTaskStatus`, JSON.stringify(savedTaskStatus));
  window.document.location.href = "./add_task.html";
}
