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

            document.getElementById('profile-username').textContent = user.username;
            document.getElementById('profile-email').textContent = user.email;
            document.getElementById('profile-dogType').textContent = user.dogType;
            document.getElementById('profile-dogAge').textContent = user.dogAge;
            document.getElementById('profile-dogGender').textContent = user.dogGender;
            document.getElementById('profile-dogName').textContent = user.dogName;
            document.getElementById('profile-coatLength').textContent = user.coatLength;
            document.getElementById('profile-petFriendly').textContent = user.petFriendly;
            document.getElementById('profile-dogPersonality').textContent = user.dogPersonality;

            // Load the dog picture if it exists
            if (user.dogPicture) {
                document.getElementById('profile-dogPicture').src = `/uploads/${user.dogPicture}`;
            }
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

    // Add event listener for the Edit button
    document.getElementById('edit-button').addEventListener('click', () => {
        console.log('Edit button clicked');
        // Populate the edit form with current profile data
        document.getElementById('edit-username').value = document.getElementById('profile-username').textContent;
        document.getElementById('edit-email').value = document.getElementById('profile-email').textContent;
        document.getElementById('edit-dogType').value = document.getElementById('profile-dogType').textContent;
        document.getElementById('edit-dogAge').value = document.getElementById('profile-dogAge').textContent;
        document.getElementById('edit-dogGender').value = document.getElementById('profile-dogGender').textContent;
        document.getElementById('edit-dogName').value = document.getElementById('profile-dogName').textContent;
        document.getElementById('edit-coatLength').value = document.getElementById('profile-coatLength').textContent;
        document.getElementById('edit-petFriendly').value = document.getElementById('profile-petFriendly').textContent;
        document.getElementById('edit-dogPersonality').value = document.getElementById('profile-dogPersonality').textContent;
    });
});
