// Background script
const storedDataString = localStorage.getItem('storedData');

if (storedDataString) {
    const storedData = JSON.parse(storedDataString);
    
    // Send the retrieved data to the content script of the currently active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'retrieveData', limitData: storedData });
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "Start_button_Clicked") {
        

    }else if(message.action === "openState"){
        chrome.windows.create({
            url: "https://www.flowershopnetwork.com"+message.stateURL,
            type: "normal",
            width: 800,
            height: 600,
            left: 100,
            top: 100,
            focused: true,
        },window => {
            // Set tabId to the newly created tab's id
            tabId = window.tabs[0].id;

          

 

    // Send a message after a 5-second delay
                                
                                  // Wait for the tab to be completely loaded
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === window.tabs[0].id && changeInfo.status === "complete") {
                    chrome.tabs.sendMessage(tabId, {
                        action: "executeCities",
                    });
                    console.log('executeCities mssg sent')
                    // Remove the listener once the message is sent
                    chrome.tabs.onUpdated.removeListener(listener);
                } 
            });

        })
        
    }else if(message.action==="openCity"){
        chrome.windows.create({
            url: "https://www.flowershopnetwork.com"+message.cityURL,
            type: "normal",
            width: 800,
            height: 600,
            left: 100,
            top: 100,
            focused: true,
        },window => {
            // Set tabId to the newly created tab's id
            tabId = window.tabs[0].id;

          

 

    // Send a message after a 5-second delay
                                
                                  // Wait for the tab to be completely loaded
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === window.tabs[0].id && changeInfo.status === "complete") {
                    chrome.tabs.sendMessage(tabId, {
                        action: "executeContacts",
                    });
                    console.log('executeContacts mssg sent')
                    // Remove the listener once the message is sent
                    chrome.tabs.onUpdated.removeListener(listener);
                } 
            });

        })
       

    }
})

let messageTemplate = []
// Read the contents of the file asynchronously
fetch(chrome.runtime.getURL('test_file'))
  .then(response => response.text())
  .then(data => {
    // Extract content between keywords
    const message1Start = "<MESSAGE1start>";
    const message1End = "<MESSAGE1end>";
    const message2Start = "<MESSAGE2start>";
    const message2End = "<MESSAGE2end>";
    const message3Start = "<MESSAGE3start>";
    const message3End = "<MESSAGE3end>";

    const message1 = extractContent(data, message1Start, message1End);
    const message2 = extractContent(data, message2Start, message2End);
    const message3 = extractContent(data, message3Start, message3End);
messageTemplate.push(message1,message2,message3)
    // Do something with the extracted messages
    console.log("Message 1:", message1);
    console.log("Message 2:", message2);
    console.log("Message 3:", message3);
  })
  .catch(error => console.error('Error fetching file:', error));

// Function to extract content between start and end keywords
function extractContent(data, startKeyword, endKeyword) {
  const startIndex = data.indexOf(startKeyword);
  const endIndex = data.indexOf(endKeyword, startIndex + startKeyword.length);
  if (startIndex !== -1 && endIndex !== -1) {
    return data.substring(startIndex + startKeyword.length, endIndex);
  } else {
    return "Content not found";
  }
}

let currentIndex = 0;
let tabId = null;
let intervalId = null;

function openNextLink(links) {
    // Clear previous interval if any
    clearInterval(intervalId);
    console.log(links)
    console.log(links.length)

    // Set a new interval
    intervalId = setInterval(() => {
        console.log(links.length)

        // If tabId is not null, close the tab
        if (tabId !== null) {
            console.log(links.length)

            chrome.tabs.remove(tabId, () => {
                console.log(links.length)

                currentIndex++;
                console.log(links.length)

                openNextTab(links);

            });
            console.log(links.length)


        } else {
            console.log(links.length)

            openNextTab(links);
        }
    }, 60000); // 10 seconds delay
}

function openNextTab(links) {
    console.log(links.length)

    console.log(currentIndex)
    console.log(links.length)
    if (currentIndex < links.length) {
        const url = links[currentIndex];
        console.log(links.length)

        chrome.windows.create({
            url: url,
            type: "normal",
            width: 800,
            height: 600,
            left: 100,
            top: 100,
            focused: true,
        }, window => {
            // Set tabId to the newly created tab's id
            tabId = window.tabs[0].id;

            console.log('Hello link:', url);
            console.log(links.length)

 

    // Send a message after a 5-second delay
                                
                                  // Wait for the tab to be completely loaded
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === window.tabs[0].id && changeInfo.status === "complete") {
                    chrome.tabs.sendMessage(tabId, {
                        action: "pullData",
                        messages:messageTemplate
                    });
                    console.log('mssg sent')
                    // Remove the listener once the message is sent
                    chrome.tabs.onUpdated.removeListener(listener);
                } 
            });

        });    console.log(links.length)

    } else {    console.log(links.length)

        // Stop the interval if all links are processed
        clearInterval(intervalId);
        console.log('All links processed.');
    }
}




let codeRunning=1;
let links = []
 chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   if (message.action === 'openLinks') {
    let limit = 2;
    let vacantSpace = limit - links.length
let newListSize = links.length+message.links.length;
    if(newListSize<=limit){

        links.push(...message.links)  //Get first 10 links

    }else{
        links.push(...message.links.slice(0,vacantSpace))
        var message = {action: 'freeze', limit: vacantSpace};
chrome.tabs.query({}, function(tabs) {
    // Iterate over each tab
    tabs.forEach(function(tab) {
        // Send the message to the current tab
        chrome.tabs.sendMessage(tab.id, message, function(response) {
            if (chrome.runtime.lastError) {
                // Handle error, if any
                console.error("Error sending message:", chrome.runtime.lastError.message);
            } else {
                // Handle response, if any
                console.log("Message sent to tab ID:", tab.id);
            }
        });
    });
});

    }
    //   links = message.links.slice(0, 10);  //Get first 10 links

     if(links.length===limit){
        console.log(links)


        openNextLink(links);

        // codeRunning++

     }else{
        console.log('links: '+ links)

        console.log("Link isn't reached yet")

     }
   }else if (message.action === 'storeLimit') {
    // Extract data from the message
    const { isLimit, limit, cityIndex, stateIndex, initialStateIndex } = message;

    // Create an object to store in localStorage
    const dataToStore = {
        isLimit,
        limit,
        cityIndex,
        stateIndex,
        initialStateIndex
    };

    // Convert the object to a JSON string and store it in localStorage
    localStorage.setItem('storedData', JSON.stringify(dataToStore));
}else if(message.action === 'updateStatus'){
    let shopName = message.shopName
    var dataToStore = shopName + ', SENT';

// Store the data in Chrome storage
chrome.storage.local.set({ 'shopData': dataToStore }, function() {
  console.log('Data saved: ' + dataToStore);
});
   }
 });
 //let currentIndex = 0;

// function openNextLink(links) {
//   if (currentIndex < links.length) {
//     const url = links[currentIndex];
//     chrome.windows.create({
//         url: url,
//         type: "normal",
//         width: 800,
//         height: 600,
//         left: 100,
//         top: 100,
//         focused: true,
//     }, tab => {
//       setTimeout(() => {
//         console.log('Hello link:', url);
//         chrome.tabs.remove(tab.id);
//         currentIndex++;
//         openNextLink(links);
//       }, 10000); // 10 seconds delay
//     });
//   }
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'openLinks') {
//     const links = message.links.slice(0, 10); // Get first 10 links
//     openNextLink(links);
//   }
// });


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'openLinks') {
//       const links = message.links.slice(0, 10); // Get first 10 links
//       links.forEach(link => {
//         chrome.tabs.create({ url: link });

//         chrome.windows.create({
//                              url: link,
//                              type: "normal",
//                              width: 800,
//                              height: 600,
//                              left: 100,
//                              top: 100,
//                              focused: true,
//                          })
//       });
//     }
//   });
  


// // Add an event listener to listen for messages from the popup
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.action === "Start_button_Clicked") {
//     const baseUrls = message.urls; // Use the received 'urls' array
//     const subUrls = ["/contact-us", "/contact", "/#contact", "/contactus","/#contactus","/about","/#about","/about-us","/aboutus","/#aboutus","/support","/#support","/help","/#help","/get-in-touch","/getintouch","/reach-out","/reachout","/reach-us","/reachus","/info","/connect","/talk-to-us","/talktous","/feedback","/service","/assistance","/say-hello","/sayhello","/hello","/say-hey","/sayhey","/hey","/inquire","/queries","/ask-us","/askus","/write-to-us","/writetous","/lets-talk","/letstalk","/helpline","/patient-service","/patient-services","/patient-support","/patient-care","/patientservice","/patientservices","/patientsupport","/patientcare","/customer-service","/customer-support","/customer-care","/customerservice","/customersupport","/enquire","/enquiry","/submit-query","/submitquery"];
//     const activeUrls = [];
//     const activeUrlsIndex = [];
//     const failedUrls=[];
//     let otherError = true;
//     const messages = message.messages;
//     const subjects = message.subjects;
//     console.log('Messages received:', messages);
//     console.log('Subjects received:', subjects);

//     const fetchPromises = [];
//     baseUrls.forEach((baseUrl) => {
//       let urlMatched = false; // Flag to check if at least one suburl matches

//       subUrls.forEach((subUrl) => {
//         const fullUrl = `${baseUrl}${subUrl}`;
//         fetchPromises.push(
//           fetch(fullUrl)
//             .then((response) => {
//               if (response.status === 200) {

//                 fetch(fullUrl)
//   .then(response => {
//     if (response.ok) {
//       return response.text();
//     } else {
//       throw new Error('Page not available');
//     }
//   })
//   .then(responseText => {
//     // Check for a specific phrase in the response body
//     if (responseText.includes('Custom Error Message')) {
//       console.log('Custom error page detected');
//     } else {
//       console.log('Page is available');
//         console.log(baseUrls.indexOf(baseUrl))
//                 console.log(baseUrl)
//                 activeUrlsIndex.push(baseUrls.indexOf(baseUrl))
//                 activeUrls.push(fullUrl);
//                 urlMatched = true; // Set the flag to true since at least one suburl matched

//     }
//   })
//   .catch(error => {
//     // Handle fetch errors or non-200 status codes
//     console.error('Error:', error.message);
//   });


              
                
//               } else {
//                 console.log(`Not Found: ${fullUrl}`);

//               }
//             })
//             .catch((error) => {
//               console.log("Error:", error);
//             })
//         );
//       });
      
//       Promise.all(fetchPromises)
//       .then(() => {
//         // Check if at least one suburl matched, if not, consider it a failure
//         if (!urlMatched) {
//           console.log(`No suburl matched for base URL: ${baseUrl}`);
//           failedUrls.push(baseUrl);
//         }
//       });
//     });

//     // Use Promise.all to wait for all fetch requests to complete
//     Promise.all(fetchPromises)
//       .then(() => {

//         console.log(activeUrls);
//         console.log(activeUrlsIndex)
//         console.log(failedUrls)
//         for (var i = 0; i < failedUrls.length; i++) {
//           handleFailedUrl(failedUrls[i]);
//       }



//         function synchronousOpenUrlsAndClose () {
//           let index = 0;

          
//         let pauseExtension = false;
//           function openNextUrl() {
            
//             if (index < activeUrls.length) {
//               if(!pauseExtension){

              
//               // Print the URL
//               console.log(activeUrls[index]);
//               console.log(index)
        
//               // Console "Hello"
//               console.log('Hello');
        
//               chrome.windows.create({
//                 url: activeUrls[index],
//                 type: "normal",
//                 width: 800,
//                 height: 600,
//                 left: 100,
//                 top: 100,
//                 focused: true,
//               })
//                 .then((newWindow) => {
//                   const tabId = newWindow.tabs[0].id;
//                   console.log(tabId)

//                   let currentURLDataIndex = activeUrlsIndex[index]
//                   // console.log(messages[currentURLDataIndex])
//                   // console.log(subjects[currentURLDataIndex])
//                   chrome.runtime.onMessage.addListener(
//                     function (request, sender, sendResponse) {
//                       if (request.action === "resetExtension") {
//                         // Clear chrome.local.storage
//                         chrome.storage.local.clear();
                  
                      
                  
//                         chrome.runtime.reload();
//                       }
//                     }
//                   );
//                   // console.log(subjects[currentURLDataIndex])
//                   chrome.runtime.onMessage.addListener(
//                     function (request, sender, sendResponse) {
//                       if (request.action === "pauseExtension") {
//                         // Clear chrome.local.storage
//                        pauseExtension = true;
//                       }

//                       if (request.action === "resumeButton") {
//                         // Clear chrome.local.storage
//                        pauseExtension = false;
//                        openNextUrl();
//                       }
//                     }
//                   );
                  
//                   chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//                     if (message.action === "rePassData") {
//                         // Handle the "rePassData" message
                  
                       
                  
                       
//                                 // Send a message after a 5-second delay
                                
//                                 setTimeout(function () {
//                                     chrome.tabs.sendMessage(tabId, {
//                                         action: "PassData",
//                                         message: messages[currentURLDataIndex],
//                                         subject: subjects[currentURLDataIndex],
//                                         limiter:true
//                                     });
//                                 }, 3000);
//                             }
//                           })
//                   chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
//                     if (info.status === 'complete' && tabId === newWindow.tabs[0].id) {
//                       chrome.tabs.onUpdated.removeListener(listener);
    
//                       // Pass messages and subjects to content script
//                       chrome.tabs.sendMessage(tabId, { action: "PassData", message: messages[currentURLDataIndex], subject: subjects[currentURLDataIndex],limiter:false
//                     });
    
//                   chrome.scripting.executeScript({
//                     target: { tabId: tabId },
//                     files: ["content.js"],
                    
                    
//                   });


        
//                   // Wait for 10 seconds and then remove the window
//                   setTimeout(() => {
//                     chrome.tabs.remove(tabId, () => {
//                       // Window removal is complete
//                       // Continue to the next URL after removal
//                       if(otherError){
//                         handleFailedUrl(activeUrls[index])
//                       }
//                       index++;
//                       setTimeout(openNextUrl, 2000); // Introduce a 2-second delay
//                     });
//                   }, 30000); // 10 seconds delay before removal
//                 }
//                 })
//                 })
//                 .catch((error) => {
//                   console.error("Error creating window: " + error);
//                   // Continue to the next URL in case of an error
//                   if(otherError){
//                     handleFailedUrl(activeUrls[index])
//                   }
//                   index++;
//                   setTimeout(openNextUrl, 2000); // Introduce a 2-second delay
//                 });
//               }else{
//                 console.log('Extension is Paused')
//               }
//             }

//           }
        
//           // Start the loop by calling openNextUrl for the first time
//           openNextUrl();
//         }
        
//         synchronousOpenUrlsAndClose ();
        



       

          

//       })
//       .catch((error) => {
//         console.log("Error in Promise.all:", error);
//       })
//   }
// });
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "submitStatus") {

//       var status = request.value ? "SENT" : "FAILED";
//       var url = request.url;
//       var issue = request.issue;

//       if(request.value===true){
//         otherError=false;
//       }

//       if (issue) {
//           var dataToStore = url + ',' + status + ',' + issue;
//       } else {
//           var dataToStore = url + ',' + status;
//       }

//       // Retrieve existing submissions from chrome.local storage
//       chrome.storage.local.get({ submissions: [] }, function (result) {
//           var submissions = result.submissions || [];

//           // Check if the data already exists in the submissions array
//           var isDuplicate = submissions.some(function (entry) {
//             var entryUrl = entry.split(',')[0].trim();
//             return entryUrl === url;          });

//           // If it's not a duplicate, add the new data to the submissions array
//           if (!isDuplicate) {
//               submissions.push(dataToStore);

//               // Update the chrome.local storage with the modified submissions array
//               chrome.storage.local.set({ submissions: submissions }, function () {
//                   console.log('Data stored in chrome.local storage:', dataToStore);
//               });
//           } else {
//               console.log('Data is a duplicate and will not be stored:', dataToStore);
//           }
//       });
//   }
// });



// function handleFailedUrl(failedUrl){
//   var status = "FAILED";
//       var url = failedUrl
//       var issue = 'OTHER'

//           var dataToStore = url + ',' + status + ',' + issue;
      

//       // Retrieve existing submissions from chrome.local storage
//       chrome.storage.local.get({ submissions: [] }, function (result) {
//           var submissions = result.submissions || [];

//           // Check if the data already exists in the submissions array
//           var isDuplicate = submissions.some(function (entry) {
//             var entryUrl = entry.split(',')[0].trim();
//             return entryUrl === url;          });

//           // If it's not a duplicate, add the new data to the submissions array
//           if (!isDuplicate) {
//               submissions.push(dataToStore);

//               // Update the chrome.local storage with the modified submissions array
//               chrome.storage.local.set({ submissions: submissions }, function () {
//                   console.log('Data stored in chrome.local storage:', dataToStore);
//               });
//           } else {
//               console.log('Data is a duplicate and will not be stored:', dataToStore);
//           }
//       });

// }
