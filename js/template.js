let savedTaskStatus;

/**
 * is used to initialize the website
 */
function init() {
  includeHTML()

}

/**
 * is used to include the html pages
 * @returns 
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
  manipulateFooterColor()
}

/**
 * is used to show /hide the logout button
 */
function toggleLogoutBtn() {
  let body = document.getElementById('body');
  let btn = document.getElementById('header-extended-menu-container');
  let slideContainer = document.getElementById('slide-container');
  let overlay = document.getElementById('overlay');
  toggleLogoutBtnScreen(body, btn, slideContainer, overlay);
}

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
 * This funciton is used to remove the overlay
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
 * This funciton is used to remove the overlay
 */
function whenInnerWidth() {
  if (window.innerWidth < 1000) {
    document.getElementById('slide-container').classList.add('slide-out')
    main.classList.remove('d-none')
  }
}

/**
 * This funciton is used to remove the overlay
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
 * is used to get the background color for the current page
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
 * is used to get the background color for the current page
 */
function manipulateColor(id, div) {
  if (window.location.href.includes(div)) {
    id.classList.add('background-color')
  } else {
    id.classList.remove('background-color')
  }
}

/**
 * is used to control appearance of the card container
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
 * is used to clear local storage status
 */
function clearSavedTaskStatusTemplate() {
  savedTaskStatus = ''
  localStorage.setItem(`savedTaskStatus`, JSON.stringify(savedTaskStatus));
  window.document.location.href = "./add_task.html";
}
