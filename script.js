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

    if (!emailRegex.test(email)) {
        inputstatus(element, "error");
        return false;
    } else {
        inputstatus(element, "success");
        return true;
    }
}

function passwordvalidation(element) {
    let password = document.getElementById(element).value;
    let passwordRegex = /^[A-Za-z0-9]{3,}$/;

    if (!passwordRegex.test(password)) {
        inputstatus(element, "error");
        return false;
    } else {
        inputstatus(element, "success");
        return true;
    }
}

function inputstatus(element, status) {
    let input = document.getElementById(element);
    if (status === "error") {
        input.classList.add("inputdanger");
    } else if (status === "success") {
        input.classList.remove("inputdanger");
    }

    setTimeout(() => {
        input.classList.remove("inputdanger");
    }, 5000);
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
        inputstatus("InputPassword", "error");
        inputstatus("InputRePassword", "error");
        return;
    } else if (username.length < 3) {
        myalert("error", "Username must be at least 3 characters long.");
        inputstatus("InputName", "error");
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
            clearInputs(["InputName", "InputEmail", "InputPassword", "InputRePassword"]);
        })
        .catch(error => {
            myalert("error", "Registration failed. Please check your credentials." + "\n" + error);
        });
}

function clearInputs(inputs) {
    inputs.forEach(inputId => {
        document.getElementById(inputId).value = "";
    });
}

function getuser() {
    const username = localStorage.getItem("username");
    document.getElementById("username").innerText = username;
}

function getStudents() {
    var tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    var innertext = "";

    fetch('https://student-api.acpt.lk/api/student/getAll', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
    })
        .then(response => response.json())
        .then(json => {
            json.forEach(student => {
                innertext += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.student_name}</td>
                    <td>${student.student_age}</td>
                    <td>${student.student_address}</td>
                    <td>${student.student_contact}</td>
                    <td>
                        <div class="d-flex justify-content-around">
                            <div class="d-flex gap-3 gap-lg-5 me-2 me-lg-0">
                                <i onclick="updateStudent(${student.id}); highlightIcon(this, 'icon-blue')" class="bi bi-pencil-square fs-5"></i>
                                <i onclick="deleteStudentpopup(${student.id}); highlightIcon(this, 'icon-red');" class="bi bi-trash fs-5"></i>
                            </div>
                        </div>
                    </td>
                </tr>
                `;
            });
            tbody.innerHTML = innertext;
        })
        .catch(error => {
            myalert("error", "Failed to fetch students." + "\n" + error);
        });

}

function highlightIcon(icon, colorClass, duration = 2000) {
    icon.classList.add(colorClass);
    setTimeout(() => {
        icon.classList.remove(colorClass);
    }, duration);
}

function modelvalidation() {
    const studentName = document.getElementById("InputName").value;
    const studentAge = document.getElementById("InputAge").value;
    const studentAddress = document.getElementById("InputAddress").value;
    const studentContactNo = document.getElementById("InputContactNo").value;

    if (studentName.trim() == "") {
        myalert("error", "Student name cannot be empty.");
        inputstatus("InputName", "error");
        return false;
    } else if (studentAge.trim() == "" || isNaN(studentAge)) {
        myalert("error", "Student age must be a valid number.");
        inputstatus("InputAge", "error");
        return false;
    } else if (studentAddress.trim() == "") {
        myalert("error", "Student address cannot be empty.");
        inputstatus("InputAddress", "error");
        return false;
    } else if (studentContactNo.trim() == "" || isNaN(studentContactNo) || studentContactNo.length < 10) {
        myalert("error", "Student contact number is invalid.");
        inputstatus("InputContactNo", "error");
        return false;
    }

    return true;
}

function newStudent() {
    if (!modelvalidation()) {
        return;
    }

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
            text = text.replaceAll('"', '');
            if (text.includes("error")) {
                throw new Error(text);
            } else {
                myalert("success", text);
                clearInputs(["InputName", "InputAge", "InputAddress", "InputContactNo"]);
                opendmodal.hide();
                getStudents();
            }

        })
        .catch(error => {
            myalert("error", "Failed to add student." + "\n" + error);
        })
}

let opendmodal;

function mainModalpopup() {
    opendmodal = new bootstrap.Modal(document.getElementById('mainModal'));
    opendmodal.show();
}

function deleteStudentpopup(studentId) {
    opendmodal = new bootstrap.Modal(document.getElementById('deleteModal'));
    opendmodal.show();
    document.getElementById("deleteConfirmButton").onclick = function () {
        deleteStudent(studentId);
    }
}

async function deleteStudent(studentId) {
    try {
        const response = await fetch(`https://student-api.acpt.lk/api/student/delete/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }
        );

        const text = (await response.text()).replaceAll('"', '');

        if (!response.ok) {
            throw new Error(text || `HTTP Error ${response.status}`);
        }

        myalert("success", text);
        opendmodal.hide();
        getStudents();

    } catch (error) {
        myalert("error", error.message);
    }
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