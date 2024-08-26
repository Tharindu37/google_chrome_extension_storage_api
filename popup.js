document.getElementById("click").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "detection" });
});

document
  .getElementById("retrieveUrlsButton")
  .addEventListener("click", function () {
    getUrls(function (urls) {
      const urlList = document.getElementById("urlList");
      urlList.innerHTML = ""; // Clear any previous content
      urls.forEach((url) => {
        const li = document.createElement("li");
        li.textContent = url;
        urlList.appendChild(li);
      });
    });
  });
