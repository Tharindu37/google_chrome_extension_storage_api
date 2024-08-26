chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "detection") {
    console.log("detection");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "imageDetection" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
            } else {
              console.log("Response received:", response);
            }
          }
        );
      } else {
        console.warn("No active tab found.");
      }
    });
  }
});
