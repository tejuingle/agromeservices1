// Function to close the modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Function to toggle between the login and signup forms
function toggleToSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function toggleToLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}

// Simulated function for login
function submitLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
        alert(`Logged in successfully with email: ${email}`);
        closeModal();
    } else {
        alert('Please fill in all fields');
    }
}

// Simulated function for signup
function submitSignup() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (email && password) {
        alert(`Signed up successfully with email: ${email}`);
        closeModal();
    } else {
        alert('Please fill in all fields');
    }
}
