document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your login logic here
    alert('Logged in successfully!');
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your sign up logic here
    alert('Signed up successfully!');
});

window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

