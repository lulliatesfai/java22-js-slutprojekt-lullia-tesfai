  document.addEventListener("DOMContentLoaded", function () {
      const searchButton = document.getElementById("searchButton");
      const searchInput = document.getElementById("searchInput");
      const resultCount = document.getElementById("resultCount");
      const imageSize = document.getElementById("imageSize");
      const photoGrid = document.getElementById("photoGrid");
      
      searchButton.addEventListener("click", async function (event) {
          event.preventDefault();
          const searchTerm = searchInput.value.trim();
          const count = parseInt(resultCount.value);
  
          // Få den önskade bild storleken från dropdown menyn
          const sizeSelect = document.getElementById("imageSize");
          const size = sizeSelect.value;

         //text-input får inte vara tom
          if (searchTerm === "") {
            errorContainer.innerHTML = "Please enter a search term."; // Visa ett felmeddelande
            return; 
        }
          // Rensa tidigare felmeddelanden
          errorContainer.innerHTML = "";
          
          // Rensa tidigare sökresultat
          photoGrid.innerHTML = "";
  
          // Gör API-anrop till Flickr
          fetchFlickrPhotos(searchTerm, count, size);
      });
  
      async function fetchFlickrPhotos(searchTerm, count, size) {
          const apiKey = "9c101b56397d393d6aeb5d2eacee4b5d";
          const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${searchTerm}&per_page=${count}&format=json&nojsoncallback=1`;
  
          try {
              const response = await fetch(apiUrl);
              const data = await response.json();
  
              if (data.stat === "ok") {
                  const photos = data.photos.photo;
  
                  photos.forEach((photo) => {
                    //kolla att den önskade bilden finns
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
              } else {
                const errorContainer = document.getElementById("errorContainer");
                errorContainer.innerHTML = "An error occurred while fetching images. Please try again later or with a different search term.";
               }
          } catch (error) {
            const errorContainer = document.getElementById("errorContainer");
            errorContainer.innerHTML = "An error occurred while fetching images. Please try again later or with a different search term.";
            console.error("Something went wrong: " + error.message);
          }
      }
  });
