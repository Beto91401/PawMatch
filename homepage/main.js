console.log('main.js is loaded and running');

// Function to update the navbar with the username
const updateNavbarWithUsername = (username) => {
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        console.error('Navbar element not found');
        return;
    }
    const containerFluid = navbar.querySelector('.container-fluid');
    if (!containerFluid) {
        console.error('Container fluid element not found within the navbar');
        return;
    }
    const loginButton = containerFluid.querySelector('#login-button');

    console.log('Navbar element:', navbar);
    console.log('Container fluid element:', containerFluid);
    console.log('Login button element:', loginButton);

    if (loginButton) {
        const usernameElement = document.createElement('span');
        usernameElement.textContent = `Welcome, ${username}`;
        usernameElement.classList.add('navbar-text', 'ms-auto'); // Add classes for styling

        // Create a logout button
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.classList.add('btn', 'btn-bubbly', 'ms-2'); // Add classes for styling
        logoutButton.addEventListener('click', logout);

        const userContainer = document.createElement('div');
        userContainer.classList.add('ms-auto'); // Move to the right
        userContainer.appendChild(usernameElement);
        userContainer.appendChild(logoutButton);

        containerFluid.replaceChild(userContainer, loginButton);
        console.log('Login button replaced with username:', username);
    } else {
        console.error('Login button not found within the container fluid of the navbar.');
    }
};

// Logout function to clear local storage
const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    window.location.href = '../homepage/index.html'; // Redirect to home page after logout
};

// Check if the user is logged in and update the navbar
const token = localStorage.getItem('jwtToken');
const username = localStorage.getItem('username');
if (token && username) {
    console.log('User is logged in. Updating navbar with username:', username); // Debugging log
    updateNavbarWithUsername(username);
}

// Signup form submission
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(this);
            const websiteChoice = formData.get('websiteChoice'); // Get the selected website choice

            const fileInput = document.querySelector('input[name="dogPicture"]');
            const file = fileInput.files[0];
            if (file && !formData.has('dogPicture')) {
                formData.append('dogPicture', file);
            }

            try {
                let token = localStorage.getItem('jwtToken'); // Use let instead of const
                console.log('JWT Token:', token); // Add this line to check the token
                if (!token) {
                    console.error('No JWT token found, generating a new one');
                    // Generate a dummy token for demonstration purposes
                    token = 'dummy-jwt-token';
                    localStorage.setItem('jwtToken', token);
                }

                const response = await fetch('/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
                    },
                    body: formData
                });

                console.log('Server response:', response);

                if (response.ok) {
                    const result = await response.json();
                    console.log('Server result:', result);
                    if (result.message === 'User created successfully.') {
                        if (websiteChoice === 'adoption') {
                            window.location.href = '../Adoption/AdoptionIndex.html'; // Redirect to Adoption website
                        } else if (websiteChoice === 'breeding') {
                            window.location.href = '../Breeding/BreedingIndex.html'; // Redirect to Breeding website
                        }
                    }
                } else {
                    console.error('Signup failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            login();
        });
    }
});

const login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Attempting login with email:', email);

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Token received:', data.token);
            localStorage.setItem('jwtToken', data.token); // Save token to local storage
            localStorage.setItem('username', data.user.username); // Save username to local storage
            console.log('Login successful, token:', data.token);

            // Redirect to the profile page or reload the current page
            window.location.href = '../Profile/ProfileIndex.html'; // Redirect to Profile or appropriate page
        } else {
            console.error('Login failed', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};
