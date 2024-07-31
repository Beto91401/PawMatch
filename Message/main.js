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

document.addEventListener('DOMContentLoaded', function() {
    const userSelect = document.getElementById('user-select');
    const messageContainer = document.getElementById('message-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    let currentUser = null;
    let selectedUser = null;
    let allUsers = {};
    let allUsersFr = {};

    // Fetch current user
    const token = localStorage.getItem('jwtToken');
    fetch('/api/users/current-user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        currentUser = data.user;
    })
    .catch(error => console.error('Error fetching current user:', error));

    // king lookup table with all the guys
    fetch('/api/users/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(users => {
        users.forEach(user => {
            allUsersFr[user._id] = user.username; // Store usernames by ID for easy lookup
        });
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(allUsersFr);
    })

    // Fetch only users the current user has messaged and store them in an object for easy lookup
    fetch('/api/users/users-messaged', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(users => {
        users.forEach(user => {
            allUsers[user._id] = user.username; // Store usernames by ID for easy lookup
            const option = document.createElement('option');
            option.value = user.username; // Store the username in the option value
            option.dataset.userId = user._id; // Store the ID as a data attribute
            option.textContent = user.username;
            userSelect.appendChild(option);
        });

        // Check for a 'user' URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const preselectUsername = urlParams.get('user');
        if (preselectUsername) {
            // Check if the preselected user is already in the dropdown
            let optionExists = false;
            for (let option of userSelect.options) {
                if (option.value === preselectUsername) {
                    optionExists = true;
                    option.selected = true;
                    selectedUser = {
                        username: preselectUsername,
                        _id: option.dataset.userId
                    };
                    fetchMessages(); // Fetch messages for the preselected user
                    break;
                }
            }
            // If the preselected user is not in the dropdown, add them
            if (!optionExists) {
                const newOption = document.createElement('option');
                newOption.value = preselectUsername;
                newOption.textContent = preselectUsername;
                userSelect.appendChild(newOption);
                newOption.selected = true;
                selectedUser = { username: preselectUsername };
                fetchMessages(); // Fetch messages for the preselected user
            }
        }
    })
    .catch(error => console.error('Error fetching users messaged:', error));

    // Handle user selection
    userSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        selectedUser = {
            username: selectedOption.value,
            _id: selectedOption.dataset.userId // Retrieve the ID from the data attribute
        };
        fetchMessages(); // Fetch messages when a new user is selected
    });

    // Handle message sending
    sendButton.addEventListener('click', function() {
        const messageContent = messageInput.value.trim();
        if (!messageContent || !selectedUser) {
            alert("Please select a user and type a message.");
            return;
        }

        const messageData = {
            senderUsername: currentUser.username, // Use username
            receiverUsername: selectedUser.username, // Use username
            content: messageContent
        };

        fetch('/api/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(messageData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageInput.value = ''; // Clear the message input
                console.log('Message sent successfully:', data);
                fetchMessages(); // Fetch messages after sending a new one
            } else {
                console.error('Failed to send message:', data.message);
            }
        })
        .catch(error => console.error('Error sending message:', error));
    });

    // Function to fetch messages between currentUser and selectedUser
    function fetchMessages() {
        if (!currentUser || !selectedUser) return;

        fetch(`/api/messages/${currentUser.username}/${selectedUser.username}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            messageContainer.innerHTML = ''; // Clear existing messages
            data.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                const senderUsername = allUsersFr[message.senderId]; // Lookup the username using senderId
                messageElement.innerHTML = `<strong>${senderUsername}:</strong> ${message.content}`; // Ensure senderUsername is displayed
                messageContainer.appendChild(messageElement);
            });
        })
        .catch(error => console.error('Error fetching messages:', error));
    }

    // Fetch messages every 2 seconds
    setInterval(fetchMessages, 2000);
});
