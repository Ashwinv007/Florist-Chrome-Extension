let  aCities=[]
let limit=0;
let isLimit=false;
let initialStateIndex = 0
let stateIndex = 0;
 let cityIndex = 0;
console.log('HI from CONTENT.JS')

// Define a function to extract URLs from elements
function extractURLs(elements) {
    const urls = [];
    for (let i = 0; i < elements.length; i++) {
        urls.push(elements[i].getAttribute('href'));
    }
    return urls;
}


async function processStates() {
    const states = document.getElementsByClassName('state-link');

    for ( initialStateIndex ; initialStateIndex < states.length; initialStateIndex++) {
        const stateURL = states[initialStateIndex].getAttribute('href');

        await new Promise(resolve => {
            chrome.runtime.sendMessage({ action: 'openState', stateURL: stateURL }, resolve);
        });

        // Wait for 10 minutes before moving to the next iteration
        await new Promise(resolve => setTimeout(resolve, 15 * 60 * 1000));
    }
}

// Function to iterate through states and perform the tasks synchronously
// async function processStates() {


//     const states = document.getElementsByClassName('state-link');

//     for (let i = 0; i < 2; i++) {
//         const stateURL = states[i].getAttribute('href');

        
//         await new Promise(resolve => {
//             chrome.runtime.sendMessage({ action: 'openState', stateURL: stateURL }, resolve);
//         });        
//         // openURL(stateURL);
        


       
//     }
// }


processStates();
// let hrefValues = [];

// const anchorTags = document.querySelectorAll('a[itemprop="email"]');

// // Loop through all found anchor tags
// anchorTags.forEach(anchorTag => {
//     // Extract and display the href attribute value for each anchor tag
//     const hrefValue = anchorTag.getAttribute('href');
//     hrefValues.push(hrefValue);
//     console.log(hrefValues)

// });
let messageINComment
// Receive message in content.js from background.js
 chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('incoming mssg')
     if (message.action === "pullData") {
        let averageText
        console.log('pulldata mssg received')
        const place = document.getElementsByClassName('city')[0].innerHTML
        const shopName = document.querySelector('h1').innerHTML
        try{
             averageText = document.getElementsByClassName('average')[0].innerHTML

        }catch{
             averageText = ''

        }

      const extractedPlace = place.split(',')[0].trim()
        // Convert averageText to float
        const averageFloat = parseFloat(averageText);
      
        // Log text content and float to console
        console.log("Locality Text:", extractedPlace);
        console.log("Fn Org Text:", shopName);
        console.log("Average Text (0th element):", averageText);
        console.log("Average Text as float:", averageFloat);
if(averageFloat>=4.0){
    messageINComment= message.messages[0].replace('1st', '1st (above 4.0)')
    messageINComment
}else if(averageFloat >= 3.0 && averageFloat <= 4.0){
    messageINComment= message.messages[1].replace('2nd', '2nd (between 4.0 & 3.0)')


}else if(averageFloat < 3.0 || !averageFloat){
    messageINComment= message.messages[2].replace('3rd', '3rd (below 3.0)')
    

}
let modifiedMessage = messageINComment.replace('shopName', shopName).replace('place', extractedPlace);

console.log(modifiedMessage);

        // Fill form fields
document.getElementById('contact-first-name').value = 'Martin';
document.getElementById('comment-last-name').value = 'Andersen';
document.getElementById('contact-email').value = 'FreeAdvice@solidcreation.com';
document.getElementById('contact-comment').value = modifiedMessage;



// setTimeout(function() {
//     document.getElementsByTagName('input')[17].click(); // Click on submit button after 5 seconds
// }, 5000);


chrome.runtime.sendMessage({action:'updateStatus', shopName:shopName})

     }else if(message.action==='executeContacts'){

                       // Extract href attribute values from anchor tags
let links = Array.from(document.querySelectorAll('a[itemprop="email"]'))
.map(anchorTag => anchorTag.getAttribute('href'))
.map(href => new URL(href, window.location.origin).href);// Convert relative URLs to absolute

//Send extracted links to the background script
if(isLimit){
    links = links.slice(limit)
    isLimit = false;

}
chrome.runtime.sendMessage({ action: 'openLinks', links });
      }else  if (message.action === 'retrieveData') {
        const limitData = message.limitData;
        if (retrievedData !== null) {
            limit=limitData.limit;
            isLimit=limitData.isLimit;
            initialStateIndex = limitData.initialStateIndex
            stateIndex = limitData.stateIndex
             cityIndex = limitData.cityIndex
           
        }
        
    }else if (message.action === 'executeCities') {
        const stateGroups = document.getElementsByClassName('state-group');
        console.log(stateGroups);
    
        
    
        const stateInterval = setInterval(() => {
            if (stateIndex < stateGroups.length) {
                const cities = stateGroups[stateIndex].getElementsByTagName('li');
                const aCities = [];
                for (let v = 0; v < 1; v++) {
                    aCities.push(cities[v].querySelector('a'));
                }
    
                const cityURLs = extractURLs(aCities);
                console.log(cityURLs);
                const cityInterval = setInterval(() => {
                    if (cityIndex < cityURLs.length) {
                        console.log(cityURLs[cityIndex]);
                        chrome.runtime.sendMessage({ action: 'openCity', cityURL: cityURLs[cityIndex] });
                        cityIndex++;
                    } else {
                        clearInterval(cityInterval);
                        cityIndex = 0;
                        stateIndex++;
                    }
                }, 30 * 1000); // Process city every 1 minute
            } else {
                clearInterval(stateInterval);
                // Wait for 10 minutes before processing the next state group
                setTimeout(() => {
                    stateIndex = 0;
                }, 2 * 60 * 1000);
            }
        }, 2 * 60 * 1000); // Process state group every 10 minutes
    }else if(message.action==='freeze'){
        limit=message.limit;
        chrome.runtime.sendMessage({ action: 'storeLimit', isLimit:true,limit:limit,cityIndex: cityIndex,stateIndex:stateIndex,initialStateIndex:initialStateIndex });

        // isLimit=true;
    }
    
//else if(message.action==='executeCities'){

//         const stateGroups = document.getElementsByClassName('state-group');
//         console.log(stateGroups)
//         async function processStateGroups() {

//         for (let j = 0; j < 1; j++) {
//             console.log(stateGroups[j].getElementsByTagName('li'))
//             const cities = stateGroups[j].getElementsByTagName('li')
//             for(let v=0;v<1;v++){
              
//               aCities.push(cities[v].querySelector('a'))
//             }
            
//             const cityURLs = extractURLs(aCities);
//             console.log(cityURLs)
//             for (let k = 0; k < 1; k++) {
//                 console.log(cityURLs[k])

//                 chrome.runtime.sendMessage({action:'openCity', cityURL:cityURLs[k]});
                



//                 await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000))

// //                     // openURL(cityURLs[k]);
// //                     // await new Promise(resolve => setTimeout(resolve, limit)); // Pause execution for 'limit' milliseconds
//            }                   await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000))
//         }}
        
//      }
    })


// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     if (message.action === "PassData") {
//       const passedMessage = message.message;
//       const passedSubject = message.subject;
//       let limiter = message.limiter;
  
//       console.log('Message received in content.js:', passedMessage);
//       console.log('Subject received in content.js:', passedSubject);
  
   
  
// let fields = {
//     Name:'',
//     Email:'',
//     Subject:'',
//     Message:'',
//     firstName:'',
//     lastName:'',
//     Firstname:'',
//     Lastname:'',
//     FirstName:'',
//     LastName:'',
//     fname:'',
//     lname:'',
//     fName:'',
//     lName:'',
//     name: '',
//     email: '',
//     subject: '',
//     message: '',
//     NAME:'',
//     EMAIL:'',
//     SUBJECT:'',
//     MESSAGE:'',
//     FIRSTNAME:'',
//     LASTNAME:'',
//     First:'',
//     FIRST:'',
//     first:'',
//     Last:'',
//     LAST:'',
//     last:'',
//     Comment:'',
//     COMMENT:'',
//     comment:'',
   
// };



// var terms = ['contact','contact us','about','about us','support','help','get in touch','reach out','reach us','info','connect','talk to us','feeback','service','assistance','say hello','hello','say hey','hey','inquire','queries','ask us','write to us','lets talk','helpline','customer service','customer support','customer care','enquire','enquiry','submit query'];

// var formElement = document.querySelector('form');

// if (!formElement) {

//   // Loop through labels inside the form using a for loop
// const labels = formElement.querySelectorAll('label');
// console.log('Labels here');

// for (let i = 0; i < labels.length; i++) {
//     const label = labels[i];

//     // Get the text content of the label, split by '*', and take the first part
    
// /// Assuming labelElement is the reference to the <label> element
// let labelText = label.textContent.replace(/\*/g, '').trim();
// let cleanedLabelText = labelText.replace(/\s/g, '');

// // Remove "required" span from the beginning or end of the label text

// console.log('Here comes the labelText:', cleanedLabelText);

// // Assuming labelText and fields are defined
// let labelTextExists = fields.hasOwnProperty(cleanedLabelText);

// if (labelTextExists) {
//     console.log('labelText exists in fields array');
//     // Find the corresponding input field by the 'for' attribute
//     const forAttribute = label.getAttribute('for');
//     const inputFieldinLabel = formElement.querySelector(`[name="${forAttribute}"]`);

//     // Inject the value into the input field
//     if (inputFieldinLabel) {
//      console.log('yes it is there')
//         inputFieldinLabel.value = fields.cleanedLabelText;
//     }else{
//      console.log('noooooooo it is NOT there')
//      const inputFieldinLabel = formElement.querySelector(`[id="${forAttribute}"]`);
//      inputFieldinLabel.value = fields[cleanedLabelText];


//     }
// } else {
//     console.log('labelText does not exist in fields array');

   
// }
//  // Get all input elements with placeholders
//  const inputFields = document.querySelectorAll('input[placeholder]');

//  // Loop through each input field
//  inputFields.forEach(inputField => {
//    // Get the placeholder text
//    const placeholderText = inputField.placeholder.toLowerCase();

//    // Check if the placeholder text is in the fields object
//    if (fields.hasOwnProperty(placeholderText)) {
//      // Inject the corresponding value into the input field
//      inputField.value = fields[placeholderText];
//    }
//  });



       
    
// }



 
    


       


//   console.log('Form not found');

//   if(!limiter){
//      // Check for buttons first
//   var foundButton = false;
//   var buttons = document.querySelectorAll('button');
//   buttons.forEach(button => {
//     if (terms.some(term => button.textContent.toLowerCase().includes(term))) {
      
//       chrome.runtime.sendMessage({ action: "rePassData"});

//       button.click();
//       foundButton = true;
//     }
//   });

//   if (!foundButton) {
//     // If buttons are not found, check for hrefs
//     var foundHref = false;
//     var hrefs = document.querySelectorAll('a');
//     hrefs.forEach(href => {
//       if (terms.some(term => href.textContent.toLowerCase().includes(term))) {
//         chrome.runtime.sendMessage({ action: "rePassData"});

//         href.click();
//         foundHref = true;
//       }
//     });

//     if (!foundHref) {
//       chrome.runtime.sendMessage({ action: "submitStatus", value: false,issue:"FORM_NOT_FOUND", url: window.location.href });

//       console.log('No buttons or hrefs found');
//     } 
//   }
  
    
//   }else{
//     chrome.runtime.sendMessage({ action: "submitStatus", value: false,issue:"FORM_NOT_FOUND", url: window.location.href });

//   }
  
 
// } else {
//   fillForm()
// }








// function fillForm(){
//     console.log('FORM FOUND and gonna be auto-filled!')

//   let formElement = document.querySelector('form'); 



//   var formElements = formElement.elements;

// var requiredInputFound = false;

// let emptyTextFieldFound = false;
// // Loop through form elements
// for (var i = 0; i < formElements.length; i++) {
//   var element = formElements[i];

//   // Check if the element is an input field and is required
//   if (element.tagName === 'INPUT' && element.hasAttribute('required')) {
//       switch (element.type) {
//           case 'radio':
//             // Click the first radio option
//             element.checked = true;
//             break;
//           case 'checkbox':
//             // Click the checkbox
//             element.checked = true;
//             break;
//           case 'number':
//             // Enter 0123456789 for number input
//             element.value = '0123456789';
//             break;
//           case 'time':
//             // Enter 01:01 for time input
//             element.value = '01:01';
//             break;
//           case 'tel':
//             // Enter 0123456789 for tel input
//             element.value = '0123456789';
//             break;
//             case 'select-one':
//         // Set the value to the first option for select dropdown
//         element.selectedIndex = 1;
//         break;
//          case 'text':
//         // Check if it's empty and set the value
//         if (element.value.trim() === '') {
//           element.value = 'Hello';
//           console.log('Text field with required attribute and empty value found');
//           emptyTextFieldFound = true;
//         }
//         break;

//         }
       
//     console.log('Required input field found');
//     requiredInputFound = true;
//   }else if (element.tagName === 'SELECT' && element.hasAttribute('required')) {
//       // Check if the element is a required select dropdown
//       console.log('Required select dropdown found');
      
//       // Select the second option in the dropdown list
//       element.selectedIndex = 1;
//     }
// }

// // Log only if required input is not found
// if (!requiredInputFound) {
//   console.log('No required input fields found');
// }








// fields.name = 'Martin Andersen';
// fields.email = 'FreeAdvice@solidcreation.com';
// fields.subject = passedSubject;
// fields.message = passedMessage;
// fields.EMAIL='FreeAdvice@solidcreation.com';
// fields.Email='FreeAdvice@solidcreation.com';
// fields.Firstname='Martin';
// fields.FIRSTNAME='Martin';
// fields.LASTNAME='Andersen';
// fields.FirstName='Martin';
// fields.LastName='Andersen';
// fields.Lastname='Andersen';
// fields.MESSAGE=passedMessage;
// fields.Message=passedMessage;
// fields.NAME='Martin Andersen';
// fields.Name='Martin Andersen';
// fields.SUBJECT=passedSubject;
// fields.Subject=passedSubject;
// fields.fName='Martin';
// fields.fname='Martin';
// fields.lName='Andersen';
// fields.lastName='Andersen';
// fields.firstName='Martin';
// fields.lname='Andersen';
// fields.First='Martin';
//   fields.FIRST='Martin';
//     fields.first='Martin';
//     fields.Last='Andersen';
//     fields.LAST='Andersen';
//     fields.last='Andersen';
//     fields.Comment=passedMessage;
//     fields.COMMENT=passedMessage;
//     fields.comment=passedMessage;





// let subjectAdded = false;
// let sendMessage = true;
// let fieldFound = false;
// let messageInserted = false;
// // Loop through labels inside the form using a for loop
// const labels = formElement.querySelectorAll('label');
// console.log('Labels here');

// for (let i = 0; i < labels.length; i++) {
//     const label = labels[i];

//     // Get the text content of the label, split by '*', and take the first part
    
// /// Assuming labelElement is the reference to the <label> element
// let labelText = label.textContent.replace(/\*/g, '').trim();
// let cleanedLabelText = labelText.replace(/\s/g, '');

// // Remove "required" span from the beginning or end of the label text

// console.log('Here comes the labelText:', cleanedLabelText);

// // Assuming labelText and fields are defined
// let labelTextExists = fields.hasOwnProperty(cleanedLabelText);

// if (labelTextExists) {
//     console.log('labelText exists in fields array');
//     // Find the corresponding input field by the 'for' attribute
//     const forAttribute = label.getAttribute('for');
//     const inputFieldinLabel = formElement.querySelector(`[name="${forAttribute}"]`);

//     // Inject the value into the input field
//     if (inputFieldinLabel) {
//      console.log('yes it is there')
//         inputFieldinLabel.value = fields.cleanedLabelText;

//         messageInserted = true;
//     }else{
//      console.log('noooooooo it is NOT there')
//      const inputFieldinLabel = formElement.querySelector(`[id="${forAttribute}"]`);

//      if (!inputFieldinLabel) {
//       console.log('Input field not found, moving on to the next label');
//       continue;
//     }
//      inputFieldinLabel.value = fields[cleanedLabelText];
//      messageInserted = true;


//     }
// } else {

//     console.log('labelText does not exist in fields array');

// }


// const inputFields = document.querySelectorAll('input[placeholder]');

// for (let i = 0; i < inputFields.length; i++) {
//   const inputField = inputFields[i];
//   const placeholderText = inputField.placeholder.toLowerCase();

//   if (fields.hasOwnProperty(placeholderText)) {
//     inputField.value = fields[placeholderText];
//   }
// }

// //  // Get all input elements with placeholders
// //  const inputFields = document.querySelectorAll('input[placeholder]');

// //  // Loop through each input field
// //  inputFields.forEach(inputField => {
// //    // Get the placeholder text
// //    const placeholderText = inputField.placeholder.toLowerCase();

// //    // Check if the placeholder text is in the fields object
// //    if (fields.hasOwnProperty(placeholderText)) {
// //      // Inject the corresponding value into the input field
// //      inputField.value = fields[placeholderText];
// //    }
// //  });


       
    
// }
// for (let fieldName in fields) {
  
//     let inputField = formElement.querySelector(`[name="${fieldName}"]`);
    
//     if (inputField) {
//         inputField.value = fields[fieldName];
//     } else if (fieldName.toLowerCase() === 'subject') {
//         if (!subjectAdded) {
//             // Check variations of "Subject" and use the message field if not found
//             if (!formElement.querySelector('[name*="subject" i]') && !formElement.querySelector('[name*="Subject" i]') && !formElement.querySelector('[name*="SUBJECT" i]')) {
//                 fields.message = `${fields.subject}\n\n${fields.message}`;
//                 subjectAdded = true;
//             }
//         }
//     } else if ((fieldName.toLowerCase() === 'message') || (fieldName.toLowerCase() === 'comment')) {
//         // Check variations of "Message" and log to console if not found
//         if (!formElement.querySelector('[name*="message" i]') && !formElement.querySelector('[name*="Message" i]') && !formElement.querySelector('[name*="MESSAGE" i]')) {
 
//  if(!messageInserted ){
//   console.log('Message tab not present');
            
//             sendMessage=false;
//             chrome.runtime.sendMessage({ action: "submitStatus", value: false,issue:"MESSAGE_FIELD_NOT_FOUND", url: window.location.href });


//  }
            
          
         
//         }
//     }        fieldFound = true;



    
// }if (!fieldFound) {
//   chrome.runtime.sendMessage({ action: "submitStatus", value: false, issue: "NOT_ABLE_TO_IDENTIFY", url: window.location.href });
// }


// setTimeout(function() {


//   if (emptyTextFieldFound) {
//       console.log('Value entered into the text field after 5 seconds');
//     } else {
//       console.log('No text field with required attribute and empty value found after 5 seconds');
//     }

//     if (sendMessage) {
//       var submitButton = formElement.querySelector('[type="submit"]');
      
//       if (submitButton) {
//           console.log('Submit button found');
//           // submitButton.click();
//           // console.log('Submit button clicked after 10 seconds');
//           // chrome.runtime.sendMessage({ action: "submitStatus", value: true, url: window.location.href });
//            submitButton.click();







//         // Use a setTimeout to allow time for the form submission to potentially complete
//         setTimeout(function() {
//           console.log('Submit button clicked after 10 seconds');
//           chrome.runtime.sendMessage({ action: "submitStatus", value: true, url: window.location.href });
//       }, 10000); // 10 seconds timeout
//     } else {
//         console.log('Submit button not found. Trying to find button with specific text.');

//         // Specify the text to look for in the button
//         var buttonText = "submit"; // Change this to the desired text

//         // Look for a button with specific text
//         var textButton = formElement.querySelector('button:contains("' + buttonText + '")');

//         if (textButton) {
//             console.log('Button with text "' + buttonText + '" found');
//             textButton.click();
//             console.log('Button clicked after 10 seconds');
//             chrome.runtime.sendMessage({ action: "submitStatus", value: true, url: window.location.href });
//         } else {
//             console.log('No submit button or button with specific text found');
//             chrome.runtime.sendMessage({ action: "submitStatus", value: false, issue: "other", url: window.location.href });
//         }
//     }
// }

//   // if(sendMessage){
//   //   var submitButton = formElement.querySelector('[type="submit"]');
//   //   if (submitButton) {
//   //     console.log('submit button found')
//   //     submitButton.click();
//   //     console.log('Submit button clicked after 10 seconds');
//   //     chrome.runtime.sendMessage({ action: "submitStatus", value: true,url: window.location.href });
  
//   //   } else {
//   //     console.log('submit button not found')
//   //     chrome.runtime.sendMessage({ action: "submitStatus", value: false,issue:"other", url: window.location.href });
  
//   //     console.log('No submit button found');
//   //   }

//   // }

// }, 7000);
// console.log('Form submitted');

// }
// }
// });

