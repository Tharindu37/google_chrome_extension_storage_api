// Set to store already processed image URLs
processedImageUrls = null;
processedImageUrls = new Set();
// Function to get all visible image URLs
// function getVisibleImageUrls() {
//   const images = document.querySelectorAll("img");
//   const imageUrls = [];

//   images.forEach((img) => {
//     const rect = img.getBoundingClientRect();
//     const inViewport =
//       rect.top >= 0 &&
//       rect.left >= 0 &&
//       rect.bottom <=
//         (window.innerHeight || document.documentElement.clientHeight) &&
//       rect.right <= (window.innerWidth || document.documentElement.clientWidth);

//     if (inViewport && img.src && !processedImageUrls.has(img.src)) {
//       imageUrls.push(img.src);
//       processedImageUrls.add(img.src); // Add URL to the set to avoid duplicate processing
//     }
//   });

//   return imageUrls;
// }

function getVisibleImageUrls() {
  // Select all elements with the data-testid="tweetPhoto" attribute
  const tweetPhotos = document.querySelectorAll('[data-testid="tweetPhoto"]');
  const imageUrls = [];

  // Iterate over each tweetPhoto element
  tweetPhotos.forEach((tweetPhoto) => {
    // Find all img elements within this tweetPhoto element
    const images = tweetPhoto.querySelectorAll("img");

    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const inViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      if (inViewport && img.src && !processedImageUrls.has(img.src)) {
        imageUrls.push(img.src);
        processedImageUrls.add(img.src); // Add URL to the set to avoid duplicate processing
      }
    });
  });

  return imageUrls;
}

// Function to send image URLs to your API
function sendImageUrlsToAPI(urls) {
  if (urls.length > 0) {
    console.log(urls);
    addUrls(urls);
    // Uncomment and use this part when you have the actual API endpoint
    // fetch("YOUR_API_ENDPOINT", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ urls }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log("API Response:", data))
    //   .catch((error) => console.error("Error:", error));
  }
}

// Function to handle image visibility detection and API sending
function handleImageDetection() {
  const imageUrls = getVisibleImageUrls();
  if (imageUrls.length > 0) {
    sendImageUrlsToAPI(imageUrls);
    displayRelevantImages(imageUrls); // Display images related to the URLs
  }
}

// Function to display relevant images near the actual images
function displayRelevantImages(urls) {
  urls.forEach((url) => {
    // Create a container for each image
    const imageContainer = document.createElement("div");
    imageContainer.style.position = "absolute";
    imageContainer.style.backgroundColor = "white";
    imageContainer.style.border = "1px solid black";
    imageContainer.style.padding = "5px";
    imageContainer.style.zIndex = 10000;

    // Create and append the image to the container
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "100px";
    img.style.display = "block";
    imageContainer.appendChild(img);

    // Find the corresponding real image on the page
    const realImage = Array.from(document.querySelectorAll("img")).find(
      (img) => img.src === url
    );

    if (realImage) {
      const rect = realImage.getBoundingClientRect();
      imageContainer.style.top = `${rect.top + window.scrollY}px`;
      imageContainer.style.left = `${rect.right + window.scrollX}px`;

      // Append the container to the body
      document.body.appendChild(imageContainer);
    }
  });
}

// Use Intersection Observer to detect image visibility changes
// const observer = new IntersectionObserver(
//   (entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         handleImageDetection();
//       }
//     });
//   },
//   {
//     root: null, // Use the viewport as the root
//     rootMargin: "0px",
//     threshold: 0.1, // Trigger when 10% of the image is visible
//   }
// );
let observer = null;
let observerForNewImages = null;
function startFakeImageDetection() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleImageDetection();
        }
      });
    },
    {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the image is visible
    }
  );

  // Observe all images
  const images = document.querySelectorAll("img");
  images.forEach((img) => observer.observe(img));

  // Detect dynamically added images
  observerForNewImages = new MutationObserver(() => {
    const newImages = document.querySelectorAll("img:not([data-observed])");
    newImages.forEach((img) => {
      observer.observe(img);
      img.setAttribute("data-observed", "true"); // Mark as observed
    });
  });

  observerForNewImages.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function stopFakeImageDetection() {
  // Disconnect the IntersectionObserver
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Disconnect the MutationObserver
  if (observerForNewImages) {
    observerForNewImages.disconnect();
    observerForNewImages = null;
  }

  // Optionally clean up any DOM changes made by the script
  const imageContainers = document.querySelectorAll(
    "div[data-image-container]"
  );
  imageContainers.forEach((container) => container.remove());

  // Remove 'data-observed' attribute from images
  const observedImages = document.querySelectorAll("img[data-observed]");
  observedImages.forEach((img) => img.removeAttribute("data-observed"));

  // Optionally clear processed image URLs if needed
  if (processedImageUrls) {
    processedImageUrls.clear();
  }

  console.log("Detection stopped");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script");
  if (request.action === "imageDetection") {
    if (observer || observerForNewImages) {
      stopFakeImageDetection();
      sendResponse({ status: "Detection stoped" });
    } else {
      startFakeImageDetection();
      sendResponse({ status: "Detection executed" });
    }
  }
});

// // Observe all images
// const images = document.querySelectorAll("img");
// images.forEach((img) => observer.observe(img));

// // Detect dynamically added images
// const observerForNewImages = new MutationObserver(() => {
//   const newImages = document.querySelectorAll("img:not([data-observed])");
//   newImages.forEach((img) => {
//     observer.observe(img);
//     img.setAttribute("data-observed", "true"); // Mark as observed
//   });
// });

// observerForNewImages.observe(document.body, { childList: true, subtree: true });

// Initial call to capture images already in viewport
// handleImageDetection();
