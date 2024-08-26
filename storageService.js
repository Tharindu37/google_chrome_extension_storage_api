// storageService.js

// Function to store URLs
function storeUrls(urls) {
  chrome.storage.local.set({ imageUrls: urls }, function () {
    console.log("URLs are stored locally.");
  });
}

// Function to retrieve URLs
function getUrls(callback) {
  chrome.storage.local.get(["imageUrls"], function (result) {
    callback(result.imageUrls || []);
  });
}

// Function to add new URLs to the storage
function addUrls(newUrls) {
  getUrls(function (existingUrls) {
    const updatedUrls = [...existingUrls, ...newUrls];
    storeUrls(updatedUrls);
  });
}
