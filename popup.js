const subjects = [];
const messages = [];
const urls = [];

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");

  startButton.addEventListener("click", () => {
    // Send a message to the service worker
    chrome.runtime.sendMessage({ action: "Start_button_Clicked", urls: urls });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Get the file input element
  const fileInput = document.getElementById('fileInput');

  // Add an event listener to the file input element
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
      // Create a FileReader to read the contents of the selected file
      const reader = new FileReader();

      // Set up an event handler for when the file is loaded
      reader.onload = function (e) {
        // The file content is available in e.target.result
        const fileContent = e.target.result;
        console.log('File Content:', fileContent);

        // Split the content into lines
        const lines = fileContent.split('\n');
        

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          if (line.includes('<SUBJECTstart>')) {
            // Extract the content between <SUBJECTstart> and <SUBJECTend>
            const subjectContent = line.split('<SUBJECTstart>')[1].split('<SUBJECTend>')[0];
            subjects.push(subjectContent);
          }

          if (line.includes('<MESSAGEstart>')) {
            // Extract the content between <MESSAGEstart> and <MESSAGEend>
            const messageContent = line.split('<MESSAGEstart>')[1].split('<MESSAGEend>')[0];
            messages.push(messageContent);
          }

          if (line.includes('<URLstart>')) {
            // Extract the content between <URLstart> and <URLend>
            const urlContent = line.split('<URLstart>')[1].split('<URLEnd>')[0];
            urls.push(urlContent);
          }
        }

        if (subjects.length > 0) {
          console.log('Subjects found:', subjects);
        } else {
          console.log('No subjects found');
        }

        if (messages.length > 0) {
          console.log('Messages found:', messages);
        } else {
          console.log('No messages found');
        }

        if (urls.length > 0) {
          console.log('URLs found:', urls);
        } else {
          console.log('No URLs found');
        }
      };

      // Read the file as text
      reader.readAsText(file);
    }
  });
});
