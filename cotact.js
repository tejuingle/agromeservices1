// JavaScript Code for the Shop Page

// 1. Toggle Login Button (Login Modal or Redirect)
document.querySelector('.login-btn').addEventListener('click', function() {
  window.location.href = 'login.html'; // Redirect to login page
});

// 2. Search Bar Functionality
document.querySelector('.search-bar').addEventListener('input', function(e) {
  let searchQuery = e.target.value;
  console.log('Searching for:', searchQuery);
  // Optionally, you can filter products based on this search query
});

// 3. Form Validation - Ensure all fields are filled before submission
document.querySelector('form').addEventListener('submit', function(event) {
  let name = document.querySelector('input[type="text"]').value;
  let email = document.querySelector('input[type="email"]').value;
  let phone = document.querySelector('input[type="text"]:nth-child(3)').value;
  let message = document.querySelector('textarea').value;

  if (!name || !email || !phone || !message) {
      alert("All fields are required!");
      event.preventDefault(); // Prevent form submission if validation fails
  }
});

// 4. Scroll to Top Button
let scrollToTopButton = document.createElement('button');
scrollToTopButton.innerHTML = '↑';
scrollToTopButton.classList.add('scroll-to-top');
document.body.appendChild(scrollToTopButton);

// Show button when user scrolls down
window.onscroll = function() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      scrollToTopButton.style.display = "block";
  } else {
      scrollToTopButton.style.display = "none";
  }
};

// Scroll to the top when the button is clicked
scrollToTopButton.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 5. Toggle Contact Information Visibility
document.querySelectorAll('.contact-details button').forEach(button => {
  button.addEventListener('click', function() {
      let contactInfo = this.previousElementSibling; // Phone or Email element
      if (contactInfo.style.display === 'none') {
          contactInfo.style.display = 'block';
          this.innerHTML = 'Hide <i class="fa-solid fa-eye-slash"></i>';
      } else {
          contactInfo.style.display = 'none';
          this.innerHTML = 'Show <i class="fa-solid fa-eye"></i>';
      }
  });
});
