// Add an event listener to listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "Start_button_Clicked") {
    const baseUrls = message.urls; // Use the received 'urls' array
    const subUrls = ["/dbout", "/contact", "/#contact", "test-form/"];
    const activeUrls = [];
    const activeUrlsIndex = [];
    const messages = message.messages;
    const subjects = message.subjects;

    console.log('Messages received:', messages);
    console.log('Subjects received:', subjects);

    const fetchPromises = [];
    baseUrls.forEach((baseUrl) => {
      subUrls.forEach((subUrl) => {
        const fullUrl = `${baseUrl}${subUrl}`;
        fetchPromises.push(
          fetch(fullUrl)
            .then((response) => {
              if (response.status === 200) {
                console.log(baseUrls.indexOf(baseUrl))
                console.log(baseUrl)
                activeUrlsIndex.push(baseUrls.indexOf(baseUrl))
                activeUrls.push(fullUrl);
                
              } else {
                console.log(`Not Found: ${fullUrl}`);
              }
            })
            .catch((error) => {
              console.log("Error:", error);
            })
        );
      });
    });

    // Use Promise.all to wait for all fetch requests to complete
    Promise.all(fetchPromises)
      .then(() => {
        console.log(activeUrls);
        console.log(activeUrlsIndex)



        function synchronousOpenUrlsAndClose () {
          let index = 0;
        
          function openNextUrl() {
            
            if (index < activeUrls.length) {
              // Print the URL
              console.log(activeUrls[index]);
              console.log(index)
        
              // Console "Hello"
              console.log('Hello');
        
              chrome.windows.create({
                url: activeUrls[index],
                type: "normal",
                width: 800,
                height: 600,
                left: 100,
                top: 100,
                focused: true,
              })
                .then((newWindow) => {
                  const tabId = newWindow.tabs[0].id;
                  console.log(tabId)

                  let currentURLDataIndex = activeUrlsIndex[index]
                  // console.log(messages[currentURLDataIndex])
                  // console.log(subjects[currentURLDataIndex])

                  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
                    if (message.action === "rePassData") {
                        // Handle the "rePassData" message
                  
                        // Assuming you have data to send (messages and subjects arrays)
                       
                  
                        // Assuming you have a mechanism to track the current index
                       
                                // Send a message after a 5-second delay
                                
                                setTimeout(function () {
                                    chrome.tabs.sendMessage(tabId, {
                                        action: "PassData",
                                        message: messages[currentURLDataIndex],
                                        subject: subjects[currentURLDataIndex],
                                        limiter:true
                                    });
                                }, 3000);
                            }
                          })
                  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (info.status === 'complete' && tabId === newWindow.tabs[0].id) {
                      chrome.tabs.onUpdated.removeListener(listener);
    
                      // Pass messages and subjects to content script
                      chrome.tabs.sendMessage(tabId, { action: "PassData", message: messages[currentURLDataIndex], subject: subjects[currentURLDataIndex],limiter:false
                    });
    
                  chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["content.js"]
                    
                  });


        
                  // Wait for 10 seconds and then remove the window
                  setTimeout(() => {
                    chrome.tabs.remove(tabId, () => {
                      // Window removal is complete
                      // Continue to the next URL after removal
                      index++;
                      setTimeout(openNextUrl, 2000); // Introduce a 2-second delay
                    });
                  }, 30000); // 10 seconds delay before removal
                }
                })
                })
                .catch((error) => {
                  console.error("Error creating window: " + error);
                  // Continue to the next URL in case of an error
                  index++;
                  setTimeout(openNextUrl, 2000); // Introduce a 2-second delay
                });
            }
          }
        
          // Start the loop by calling openNextUrl for the first time
          openNextUrl();
        }
        
        synchronousOpenUrlsAndClose ();
        


        // activeUrls.forEach((activeUrl) => {
          
        //  chrome.windows.create({
        //      url: activeUrl, // URL to open in the new window
        //      type: "normal", // The window type, can be "normal," "popup," "panel," etc.
        //      width: 800, // Width of the window
        //      height: 600, // Height of the window
        //      left: 100, // X position of the window on the screen
        //      top: 100, // Y position of the window on the screen
        //      focused: true, // Whether the window should be focused
        //    }, (newWindow) => {
        //      // Once the window is created, you can get its tab ID
        //      const tabId = newWindow.tabs[0].id;
        
        //      // Use the tabId as the target for executing the content script
        //      chrome.scripting.executeScript({
        //        target: { tabId: tabId },
        //        files: ["content.js"]
        //      });

        //      function waitForTenSeconds() {
        //        console.log("10 sec over");
        //        chrome.windows.remove(tabId)

        //      }
            
        //      // Wait for 10 seconds and then call the function
        //      setTimeout(waitForTenSeconds, 10000);

        //    });
        // });
        
        // activeUrls.forEach((activeUrl)=>{
        //   chrome.windows.create({
        //     url: activeUrl, // URL to open in the new window
        //     type: "normal", // The window type, can be "normal," "popup," "panel," etc.
        //     width: 800, // Width of the window
        //     height: 600, // Height of the window
        //     left: 100, // X position of the window on the screen
        //     top: 100, // Y position of the window on the screen
        //     focused: true, // Whether the window should be focused
        //   });   

        //   chrome.scripting.executeScript({
        //     target: { tabId: tab.id },
        //     files: ["content-script.js"]
        //   });
        
        // })

          

        // Now you can do whatever you want with activeUrls, e.g., open tabs.
      })
      .catch((error) => {
        console.log("Error in Promise.all:", error);
      });
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "submitStatus") {
        // Assuming you have an index value

        var status = request.value ? "SENT" : "FAILED";
        var url = request.url

        // Concatenate index, comma, and status
        var dataToStore = url + ',' + status;

        // Store the data in chrome.local storage
        chrome.storage.local.get({ submissions: [] }, function (result) {
            var submissions = result.submissions || [];

            // Add the new data to the submissions array
            submissions.push(dataToStore);

            // Update the chrome.local storage with the modified submissions array
            chrome.storage.local.set({ submissions: submissions }, function () {
                console.log('Data stored in chrome.local storage:', dataToStore);
            });
        });
    }
});

// background.js


