function unhide(element) {
    const input = document.getElementById(element);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

function emailvalidation(element) {
    let email = document.getElementById(element).value;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;

    let input = document.getElementById(element);

    if (!emailRegex.test(email)) {
        input.classList.add("inputdanger");
        return false;
    } else {
        input.classList.remove("inputdanger");
        return true;
    }
}

function passwordvalidation(element) {
    let password = document.getElementById(element).value;
    let passwordRegex = /^[A-Za-z0-9]{3,}$/;

    let input = document.getElementById(element);

    if (!passwordRegex.test(password)) {
        input.classList.add("inputdanger");
        return false;
    } else {
        input.classList.remove("inputdanger");
        return true;
    }
}

function login() {
    const useremail = document.getElementById("InputEmail").value;
    const password = document.getElementById("InputPassword").value;
    var myalert = document.getElementById("alert");
    myalert.classList.add("d-none");

    if (!emailvalidation("InputEmail")) {
        myalert.classList.remove("d-none");
        myalert.innerText = "Please enter a valid email address.";
        return;
    } else if (!passwordvalidation("InputPassword")) {
        myalert.classList.remove("d-none");
        myalert.innerText = "Please enter a valid password.";
        return;
    }

    fetch('https://student-api.acpt.lk/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: useremail,
            password: password
        })
    })
        .then(response => response.json())
        .then(json => {
            myalert.classList.remove("d-none", "alert-danger");
            myalert.classList.add("alert-success");
            myalert.innerText = "Login successful! Redirecting to dashboard...";
            localStorage.setItem("token", json.token);
            localStorage.setItem("username", json.user.name);
            setInterval(() => {
                window.location.href = "dashboard.html";
            }, 2000);
        })
        .catch(error => {
            myalert.classList.remove("d-none");
            myalert.innerText = "Login failed. Please check your credentials." + "\n" + error;
        });
}

function register() {
    const username = document.getElementById("InputName").value;
    const useremail = document.getElementById("InputEmail").value;
    const password = document.getElementById("InputPassword").value;
    const rePassword = document.getElementById("InputRePassword").value;
    var myalert = document.getElementById("alert");
    myalert.classList.add("d-none");

    if (!emailvalidation("InputEmail")) {
        myalert.classList.remove("d-none");
        myalert.innerText = "Please enter a valid email address.";
        return;
    } else if (!passwordvalidation("InputPassword") && !passwordvalidation("InputRePassword")) {
        myalert.classList.remove("d-none");
        myalert.innerText = "Please enter a valid password.";
        return;
    } else if (password != rePassword) {
        myalert.classList.remove("d-none");
        myalert.innerText = "Passwords do not match.";
        return;
    } else if (username.length < 3) {
        myalert.classList.remove("d-none");
        myalert.innerText = "Username must be at least 3 characters long.";
        return;
    }

    fetch('https://student-api.acpt.lk/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username,
            email: useremail,
            password: password
        })
    })
        .then(response => response.json())
        .then(json => {
            myalert.classList.remove("d-none", "alert-danger");
            myalert.classList.add("alert-success");
            myalert.innerText = json.message + " Please login.";
            clearregister();
        })
        .catch(error => {
            myalert.classList.remove("d-none");
            myalert.innerText = "Registration failed. Please check your credentials." + "\n" + error;
        });
}

function clearregister() {
    document.getElementById("InputName").value = "";
    document.getElementById("InputEmail").value = "";
    document.getElementById("InputPassword").value = "";
    document.getElementById("InputRePassword").value = "";
}

function getuser() {
    const username = localStorage.getItem("username");
    document.getElementById("username").innerText = username;
}
