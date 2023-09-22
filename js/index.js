// BACKEND //
let users = [];
let emailAlreadyInUse = false;
let currentUser;

/**
 * Description: Initializes the registration process by setting the server URL,
 * downloading user data from the server, and initializing the 'users' array.
 */
async function initRegistration() {
  setURL(
    "https://peter-wallbaum.developerakademie.net/JOIN-2.0/smallest_backend_ever"
  );
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
}

/**
 * Description: Handles user registration by checking if the provided email is already in use.
 * If the email is not in use, it proceeds with user registration; otherwise, it handles the
 * case where the email is already in use.
 */
async function addUsers() {
  let name = document.getElementById("name");
  let email = document.getElementById("signUpEmail");
  let password = document.getElementById("signUpPassword");
  emailAlreadyInUse = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email.includes(email.value)) {
      checkEmailisAlreadyTaken(name, email, password);
    }
  }
  if (!emailAlreadyInUse) {
    await emailNotInUse(name, email, password);
  }
}

/**
 * Description: Handles the case where the provided email for user registration is already in use.
 * @param {HTMLElement} name - The input field for the user's name.
 * @param {HTMLElement} email - The input field for the user's email.
 * @param {HTMLElement} password - The input field for the user's password.
 */
function checkEmailisAlreadyTaken(name, email, password) {
  showMessage("errorSignUp", "email already exists", "fail");
  emailAlreadyInUse = true;
  name.value = "";
  email.value = "";
  password.value = "";
}

/**
 * Description: Handles user registration when the provided email is not already in use.
 * @param {HTMLElement} name - The input field for the user's name.
 * @param {HTMLElement} email - The input field for the user's email.
 * @param {HTMLElement} password - The input field for the user's password.
 */
async function emailNotInUse(name, email, password) {
  showMessage("errorLogin", "user successfull created", "right");
  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  await backend.setItem("users", JSON.stringify(users));
  render("none", "flex", "flex", "none", "none");
}

/**
 * Description: Handles user login attempts by comparing the provided email and password with stored user data.
 */
function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let f = 0;
  for (let i = 0; i < users.length; i++) {
    if (
      users[i]["email"] == email.value &&
      users[i]["password"] == password.value
    ) {
      loginSuccess(i);
    } else {
      f++;
    }
  }
  if (f >= users.length) {
    showMessage("errorLogin", "Wrong Password or Email", "fail");
  }
  email.value = "";
  password.value = "";
}

/**
 * Description: Handles a successful user login by setting the current user's name and navigating to the summary page.
 * @param {number} i - Index of the authenticated user in the 'users' array.
 */
function loginSuccess(i) {
  currentUser = users[i]["name"];
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.document.location.href = "./summary.html";
}

/**
 * Description: Displays a message in the specified HTML element and applies styling based on success or failure.
 * @param {string} div - The ID of the HTML element to display the message in.
 * @param {string} message - The message content to be displayed.
 * @param {string} fail - A flag indicating whether it's an error message ('fail') or success message ('right').
 */
function showMessage(div, message, fail) {
  let error = document.getElementById(div);
  error.innerHTML = message;
  if (fail == "fail") {
    error.style = "color: red;";
  } else {
    error.style = "color: green;";
  }
  setTimeout(() => {
    error.style = "display: none;";
  }, 3000);
}

/**
 * Description: Simulates a guest login by checking the provided email and password.
 */
function guestlogin() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find(
    (u) => u.email == email.value && u.password == password.value
  );
  currentUser = "Guest";
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.document.location.href = "./summary.html";
}

/**
 * Description: Performs initial animations and rendering actions when the application starts.
 */
function initial() {
  document.getElementById("capaOne").classList.add("animation");
  document.getElementById("capaOneWhite").classList.add("animation");
  document.getElementById("capaOneContainer").classList.add("ausblenden");
  setTimeout(() => {
    let capaOneContainer = document.getElementById("capaOneContainer");
    capaOneContainer.style.zIndex = "0";
  }, 1000);
  render("none", "flex", "flex", "none", "none");
}

/*Password-Inputfield*/

let inputPW = false;

/**
 * Description: Changes the visibility of a password input field and updates the password symbol.
 * @param {string} inputfield - The ID of the password input field.
 * @param {string} pwSymbols - The ID of the password symbol element.
 */
async function changePWSymbol(inputfield, pwSymbols) {
  let pwInputField = document.getElementById(inputfield);
  let pwSymbol = document.getElementById(pwSymbols);
  if (pwInputField.value == "") {
    pwSymbol.src = "assets/img/lock.svg";
    pwSymbol.classList.remove("cursorPointer");
    pwInputField.type = "password";
    inputPW = false;
  } else if ((pwInputField.type = "password")) {
    pwSymbol.src = "assets/img/crossedEye.svg";
    pwSymbol.classList.add("cursorPointer");
    inputPW = true;
  } else {
    pwSymbol.src = "assets/img/eye.svg";
    pwSymbol.classList.add("cursorPointer");
    inputPW = true;
  }
}

/**
 * Description: Toggles the visibility of a password input field and updates the password symbol.
 */
async function visibilityPW() {
  let pw = document.getElementById("password");
  let pwSymbol = document.getElementById("pwSymbol");
  if (inputPW === true) {
    if (pw.type === "password") {
      pw.type = "text";
      pwSymbol.src = "assets/img/eye.svg";
    } else {
      pw.type = "password";
      pwSymbol.src = "assets/img/crossedEye.svg";
    }
  }
}

/**
 * Description: Toggles the visibility of a sign-up password input field and updates the password symbol.
 */
async function visibilitySignUpPW() {
  let pw = document.getElementById("signUpPassword");
  let pwSymbol = document.getElementById("pwSymbol");
  if (inputPW === true) {
    if (pw.type === "password") {
      pw.type = "text";
      pwSymbol.src = "assets/img/eye.svg";
    } else {
      pw.type = "password";
      pwSymbol.src = "assets/img/crossedEye.svg";
    }
  }
}

/**
 * Description: Controls the visibility of different containers on the login/registration page.
 * @param {string} fPWC - Forgotten Password Container display style.
 * @param {string} lC - Login Container display style.
 * @param {string} nAJU - Not a Join User Container display style.
 * @param {string} rPWC - Reset Password Container display style.
 * @param {string} sUC - Sign-Up Container display style.
 */
function render(fPWC, lC, nAJU, rPWC, sUC) {
  document.getElementById("forgottenPWContainer").style.display = fPWC;
  document.getElementById("loginContainer").style.display = lC;
  document.getElementById("notAJoinUser").style.display = nAJU;
  document.getElementById("resetPWContainer").style.display = rPWC;
  document.getElementById("signUpContainer").style.display = sUC;
  loginC = lC;
}

let loginC;

/**
 * Description: Monitors the screen height and adjusts the logo's position and size for responsive design.
 */
function checkIndexForCheapPhones() {
  let firstTime = true;
  let logo = document.getElementById("capaOne");
  setInterval(() => {
    if (window.screen.height < 700 && loginC != "flex") {
      logo.style = "top: 10px; left: 24px; height: 78px; width: 64px;";
      logo.classList.remove("animation");
      firstTime = false;
    } else if (window.screen.height < 700 && loginC == "flex" && !firstTime) {
      logo.style = "top: 42px; left: 32px; height: 78px; width: 64px;";
    } else {
      logo.classList.add("animation");
    }
  }, 200);
}
