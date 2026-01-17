function unhide(element) {
    const input = document.getElementById(element);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

function emailvalidation(element) {
    const email = document.getElementById(element).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/;

    const input = document.getElementById(element);

    if (!emailRegex.test(email)) {
        input.classList.add("inputdanger");
        return false;
    } else {
        input.classList.remove("inputdanger");
        return true;
    }
}

function passwordvalidation(element) {
    const password = document.getElementById(element).value;
    const passwordRegex = /^[A-Za-z]{3,}$/;

    const input = document.getElementById(element);

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

    if (!emailvalidation("InputEmail")) {
        alert("Please enter a valid email address.");
        return;
    } else if (!passwordvalidation("InputPassword")) {
        alert("Please enter a valid password.");
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
            localStorage.setItem("token", json.token);
            localStorage.setItem("username", json.user.name);
            window.location.href = "dashboard.html";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}