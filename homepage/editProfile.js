console.log('editProfile.js is loaded and running');

// Function to fetch current user profile data
const fetchUserProfile = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('No JWT token found');
        return;
    }

    try {
        const response = await fetch('/api/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            console.log('User profile data fetched:', user);

            const profileCardContainer = document.getElementById('profile-card-container');
            profileCardContainer.innerHTML = ''; // Clear any existing content

            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="/uploads/${user.dogPicture}" alt="${user.dogName}" class="card-img-top" id="profile-dogPicture">
                </div>
                <div class="card-body">
                    <h3 class="card-title" id="profile-dogName">${user.dogName}</h3>
                    <p class="card-text" id="profile-dogType">${user.dogType}</p>
                    <p class="card-text" id="profile-dogAge"> ${user.dogAge}</p>
                    <p class="card-text" id="profile-dogGender">${user.dogGender}</p>
                    <p class="card-text" id="profile-dogPersonality">${user.dogPersonality}</p>
                    <p class="card-text" id="profile-coatLength">${user.coatLength}</p>
                    <p class="card-text" id="profile-petFriendly">${user.petFriendly}</p>
                    <button class="btn btn-bubbly" id="edit-button" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                </div>
            `;
            profileCardContainer.appendChild(card);

            // Add event listener for the Edit button
            document.getElementById('edit-button').addEventListener('click', () => {
                console.log('Edit button clicked');
                // Populate the edit form with current profile data
                document.getElementById('edit-dogType').value = document.getElementById('profile-dogType').textContent;
                document.getElementById('edit-dogAge').value = document.getElementById('profile-dogAge').textContent;
                document.getElementById('edit-dogGender').value = document.getElementById('profile-dogGender').textContent;
                document.getElementById('edit-dogName').value = document.getElementById('profile-dogName').textContent;
                document.getElementById('edit-coatLength').value = document.getElementById('profile-coatLength').textContent;
                document.getElementById('edit-petFriendly').value = document.getElementById('profile-petFriendly').textContent;
                document.getElementById('edit-dogPersonality').value = document.getElementById('profile-dogPersonality').textContent;
            });
        } else {
            console.error('Failed to fetch user profile data', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user profile data:', error);
    }
};

// Function to handle profile editing
const editProfile = async () => {
    const formData = new FormData(document.getElementById('edit-profile-form'));
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('No JWT token found');
        return;
    }

    try {
        const response = await fetch('/api/users/edit-profile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const user = await response.json();
            console.log('Profile updated:', user);
            // Update profile display with new data
            fetchUserProfile();
        } else {
            console.error('Profile update failed', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during profile update:', error);
    }
};

// Initialize the profile page
document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            editProfile();
        });
    }

    // Fetch current user profile data when the page loads
    fetchUserProfile();
});
