// BACKEND //
let users = []
let emailAlreadyInUse = false;
let currentUser;

async function initRegistration() {
  setURL('https://kevin.rohlf.io/join/smallest_backend_ever');
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
}

/**
 * is used to add a new User if email is not already in use
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
    await emailNotInUse(name, email, password)
  }
}

function checkEmailisAlreadyTaken(name, email, password) {
  showMessage('errorSignUp', 'email already exists', 'fail')
  emailAlreadyInUse = true;
  name.value = ''
  email.value = ''
  password.value = ''
}


async function emailNotInUse(name, email, password) {

  showMessage('errorLogin', 'user successfull created', 'right')
  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  await backend.setItem("users", JSON.stringify(users));
  render('none', 'flex', 'flex', 'none', 'none');
}

/**
 * is used to log in with account information
 */
function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let f = 0;
  for (let i = 0; i < users.length; i++) {
    if (users[i]['email'] == email.value && users[i]['password'] == password.value) {
      loginSuccess(i);
    } else {
      f++
    }
  }
  if (f >= users.length) {
    showMessage('errorLogin', 'Wrong Password or Email', 'fail')
  }
  email.value = ''
  password.value = ''
}

function loginSuccess(i) {
  currentUser = users[i]['name'];
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  window.document.location.href = "./summary.html";
}

/**
 * @param {string} div 
 * @param {string} message 
 * @param {string} fail 
 */
function showMessage(div, message, fail) {
  let error = document.getElementById(div);
  error.innerHTML = message;
  if (fail == 'fail') {
    error.style = 'color: red;';
  } else {
    error.style = 'color: green;';
  }
  setTimeout(() => {
    error.style = 'display: none;'
  }, 3000);
}

/**
 * is used to log in with guest account
 */
function guestlogin() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find(
    u => u.email == email.value && u.password == password.value
  );
  currentUser = 'Guest';
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  window.document.location.href = "./summary.html";
}

/**
 * is used to animte the logo translation
 */
function initial() {
  document.getElementById("capaOne").classList.add("animation");
  document.getElementById("capaOneWhite").classList.add("animation");
  document.getElementById("capaOneContainer").classList.add("ausblenden");
  setTimeout(() => {
    let capaOneContainer = document.getElementById("capaOneContainer");
    capaOneContainer.style.zIndex = "0";
  }, 1000);
  render('none', 'flex', 'flex', 'none', 'none');
}

/*Password-Inputfield*/

let inputPW = false;

/**
 * is used to change the pw symbole
 */
async function changePWSymbol(inputfield , pwSymbols) {
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
 * is used to show the password
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
 * is used to show the password
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
 * is used to render the screen
 * @param {string} fPWC forgottenPWContainer
 * @param {string} lC loginContainer
 * @param {string} nAJU notAJoinUser
 * @param {string} rPWC resetPWContainer
 * @param {string} sUC signUpContainer
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
function checkIndexForCheapPhones() {
  let firstTime = true;
  let logo = document.getElementById('capaOne');
  setInterval(() => {
    if (window.screen.height < 700 && loginC != 'flex') {
      logo.style = 'top: 10px; left: 24px; height: 78px; width: 64px;';
      logo.classList.remove('animation');
      firstTime = false;
    } else if (window.screen.height < 700 && loginC == 'flex' && !firstTime) {
      logo.style = 'top: 42px; left: 32px; height: 78px; width: 64px;';
    } else {
      logo.classList.add('animation')
    }
  }, 200);
}