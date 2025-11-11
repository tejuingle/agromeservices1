// Function to open the login form modal
document.querySelector('.login-btn').addEventListener('click', function() {
    openLoginForm();
});

// Function to open the login form
function openLoginForm() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}
