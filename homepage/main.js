import { useState, useEffect } from "react";
import axios from "axios";

console.log('main.js is loaded and running');


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const websiteChoice = formData.get('websiteChoice'); // Get the selected website choice

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                if (result.message === 'User created LOL!') {
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
});


function App() {
    const [image, setImage] = useState(null);
    const [allImages, setAllImages] = useState([]);

    useEffect(() => {
        getImage();
    }, []);

    const submitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);

        try {
            const result = await axios.post(
                "http://localhost:3000/upload-image",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log(result);
            getImage(); // Refresh the image list after upload
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const onInputChange = (e) => {
        setImage(e.target.files[0]);
    };

    const getImage = async () => {
        try {
            const result = await axios.get("http://localhost:3000/get-image");
            setAllImages(result.data.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    return (
        <div>
            <form onSubmit={submitImage}>
                <input type="file" accept="image/*" onChange={onInputChange} />
                <button type="submit">Submit</button>
            </form>
            {allImages.length === 0 ? (
                <p>No images found</p>
            ) : (
                allImages.map((data) => (
                    <img
                        key={data._id}
                        src={`http://localhost:3000/uploads/${data.image}`}
                        alt="Uploaded"
                        height={100}
                        width={100}
                    />
                ))
            )}
        </div>
    );
}

export default App;
