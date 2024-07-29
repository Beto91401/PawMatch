console.log('main.js is loaded and running');

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Signup form submission
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const websiteChoice = formData.get('websiteChoice'); // Get the selected website choice

        const fileInput = document.querySelector('input[name="dogPicture"]');
        const file = fileInput.files[0];
        if (file && !formData.has('dogPicture')) {
            formData.append('dogPicture', file);
        }

        try {
            const token = localStorage.getItem('jwtToken'); // Ensure the token is stored in localStorage
            console.log('JWT Token:', token); // Add this line to check the token
            if (!token) {
                console.error('No JWT token found');
                return;
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

       // Login form submission
       document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        login();
    });
});

const login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Attempting login with email:', email);
    console.log('Password:', password); // Add this line to check the password
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        console.log('Server response:', response); // Log the server response

        if (response.ok) {
            const data = await response.json();
            console.log('Token received:', data.token);
            localStorage.setItem('jwtToken', data.token); // Save token to local storage
            console.log('Login successful, token:', data.token);

            // Add redirection logic after successful login
            window.location.href = '../Profile/ProfileIndex.html'; // Redirect to Profile or appropriate page
        } else {
            console.error('Login failed', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};