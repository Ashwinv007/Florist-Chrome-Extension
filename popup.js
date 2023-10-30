document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
  
    startButton.addEventListener("click", () => {
      // Send a message to the service worker
      chrome.runtime.sendMessage({ action: "Start_button_Clicked" });
    });
  });
  