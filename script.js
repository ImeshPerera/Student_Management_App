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

function myalert(status, message) {
    var alertBox = document.getElementById("alert");

    alertBox.classList.add("d-none");
    alertBox.classList.remove("alert-success", "alert-danger");

    if (status === "error") {
        alertBox.classList.remove("d-none");
        alertBox.classList.add("alert-danger");
        alertBox.innerText = message;
    }
    else if (status === "success") {
        alertBox.classList.remove("d-none");
        alertBox.classList.add("alert-success");
        alertBox.innerText = message;
    }

    setTimeout(() => {
        alertBox.classList.add("d-none");
    }, 5000);
}


function login() {
    const useremail = document.getElementById("InputEmail").value;
    const password = document.getElementById("InputPassword").value;

    if (!emailvalidation("InputEmail")) {
        myalert("error", "Please enter a valid email address.");
        return;
    } else if (!passwordvalidation("InputPassword")) {
        myalert("error", "Please enter a valid password.");
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
            myalert("success", "Login successful! Redirecting to dashboard...");
            localStorage.setItem("token", json.token);
            localStorage.setItem("username", json.user.name);
            setInterval(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        })
        .catch(error => {
            myalert("error", "Login failed. Please check your credentials." + "\n" + error);
        });
}

function register() {
    const username = document.getElementById("InputName").value;
    const useremail = document.getElementById("InputEmail").value;
    const password = document.getElementById("InputPassword").value;
    const rePassword = document.getElementById("InputRePassword").value;

    if (!emailvalidation("InputEmail")) {
        myalert("error", "Please enter a valid email address.");
        return;
    } else if (!passwordvalidation("InputPassword") && !passwordvalidation("InputRePassword")) {
        myalert("error", "Please enter a valid password.");
        return;
    } else if (password != rePassword) {
        myalert("error", "Passwords do not match.");
        return;
    } else if (username.length < 3) {
        myalert("error", "Username must be at least 3 characters long.");
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
            myalert("success", json.message + " Please login.");
            clearregister();
        })
        .catch(error => {
            myalert("error", "Registration failed. Please check your credentials." + "\n" + error);
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


function newStudent() {
    var studentName = document.getElementById("InputName").value;
    var studentAge = document.getElementById("InputAge").value;
    var studentAddress = document.getElementById("InputAddress").value;
    var studentContactNo = document.getElementById("InputContactNo").value;

    fetch('https://student-api.acpt.lk/api/student/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify({
            student_name: studentName,
            student_age: studentAge,
            student_address: studentAddress,
            student_contact: studentContactNo
        })
    })
        .then(response => response.text())
        .then(text => {
            const message = JSON.parse(text);
            myalert("success", message);
        })
        .catch(error => {
            myalert("error", "Failed to add student." + "\n" + error);
        })
}

function deleteStudent() {
    // To be implemented
}

function updateStudent() {
    // To be implemented
}

function logincheck() {
    // const token = localStorage.getItem("token");
    // if (token) {
    //     window.location.href = "dashboard.html";
    // } else {
    //     window.location.href = "index.html";
    // }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "index.html";
}