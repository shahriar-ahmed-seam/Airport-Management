var x = document.getElementById('login');
var y = document.getElementById('register');
var z = document.getElementById('btn');
var modal = document.getElementById('login-form');
var loginButton = document.getElementById('loginButton');

function register() {
    if (x && y && z) {
        x.style.left = '-350px';
        y.style.left = '45px';
        z.style.left = '110px';
    }
}

function login() {
    if (x && y && z) {
        x.style.left = '45px';
        y.style.left = '450px';
        z.style.left = '0px';
    }
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

window.addEventListener('load', function () {
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.style.opacity = '1';
    }
});

if (loginButton) {
    loginButton.onclick = function () {
        if (modal) {
            modal.style.display = 'block';
        }
    };
}

var downloadBtn = document.getElementById('downloadButton');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
        fetch('/download-file')
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Ticket.txt';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error downloading file:', error));
    });
}

var goToUsersBtn = document.getElementById('goToUsersButton');
if (goToUsersBtn) {
    goToUsersBtn.addEventListener('click', function () {
        window.location.href = '/users';
    });
}
