 document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
    const resultCount = document.getElementById("resultCount");
    const imageSize = document.getElementById("imageSize");
    const photoGrid = document.getElementById("photoGrid");
    const errorContainer = document.getElementById("errorContainer"); 

    searchButton.addEventListener("click", async function (event) {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        const count = parseInt(resultCount.value);

        const sizeSelect = document.getElementById("imageSize");
        const size = sizeSelect.value;

        if (searchTerm === "") {
            errorContainer.innerHTML = "Error: Please enter a search term.";
            return;
        }

        errorContainer.innerHTML = ""; 
        photoGrid.innerHTML = ""; 
        

        try {
          
            const photos = await fetchFlickrPhotos(searchTerm, count, size);

            if (photos.length === 0) {
                errorContainer.innerHTML = "No images found for the given search term.";
                return;
            }

            photos.forEach((photo) => {
                if (photo) {
                    const photoUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;

                    const photoElement = document.createElement("div");
                    photoElement.classList.add("photo");

                    const imgElement = document.createElement("img");
                    imgElement.src = photoUrl;
                    imgElement.alt = photo.title;

                    photoElement.appendChild(imgElement);
                    photoGrid.appendChild(photoElement);
                }
            });
        } catch (error) {
            // Check if the error is a network error
            if (Error instanceof NetworkError) {
              errorContainer.innerHTML = "An error occurred while fetching images. Please try again later or with a different search term."; 
            } else {
              errorContainer.innerHTML = "A NETWORK ERROR occurred. Please check your internet connection and try again.";
            }
            console.error("Something went wrong: " + error.message);
        }
    });

    async function fetchFlickrPhotos(searchTerm, count, size) {
        const apiKey = "9c101b56397d393d6aeb5d2eacee4b5d";
        const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${searchTerm}&per_page=${count}&format=json&nojsoncallback=1`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                // Create a custom NetworkError and throw it
                const networkError = new Error("NetworkError");
                networkError.name = "NetworkError";
                throw networkError;
            }

            const data = await response.json();

            if (data.stat === "ok") {
                return data.photos.photo;
            } else {
                throw new Error("Flickr API returned an error: " + data.message);
            }
        } catch (error) {
            throw error;
        }
    }

    // Custom NetworkError class
    class NetworkError extends Error {
        constructor(message) {
            super(message);
            this.name = "NetworkError";
        }
    }
});
