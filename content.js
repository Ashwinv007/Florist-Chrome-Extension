console.log('HI from CONTENT.JS')

// let sendStatus= false
// content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "PassData") {
      const passedMessage = message.message;
      const passedSubject = message.subject;
      let limiter = message.limiter;
  
      console.log('Message received in content.js:', passedMessage);
      console.log('Subject received in content.js:', passedSubject);
  
      // Use the received data as needed in your content script...
   
  
let fields = {
    Name:'',
    Email:'',
    Subject:'',
    Message:'',
    firstName:'',
    lastName:'',
    Firstname:'',
    Lastname:'',
    FirstName:'',
    LastName:'',
    fname:'',
    lname:'',
    fName:'',
    lName:'',
    name: '',
    email: '',
    subject: '',
    message: '',
    NAME:'',
    EMAIL:'',
    SUBJECT:'',
    MESSAGE:'',
    FIRSTNAME:'',
    LASTNAME:'',
};



// Assuming terms array contains strings like ['contact', 'reach']
var terms = ['contact', 'reach'];

var formElement = document.querySelector('form');

if (!formElement) {
  console.log('Form not found');

  if(!limiter){
     // Check for buttons first
  var foundButton = false;
  var buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (terms.some(term => button.textContent.toLowerCase().includes(term))) {
      
      chrome.runtime.sendMessage({ action: "rePassData"});

      button.click();
      foundButton = true;
    }
  });

  if (!foundButton) {
    // If buttons are not found, check for hrefs
    var foundHref = false;
    var hrefs = document.querySelectorAll('a');
    hrefs.forEach(href => {
      if (terms.some(term => href.textContent.toLowerCase().includes(term))) {
        chrome.runtime.sendMessage({ action: "rePassData"});

        href.click();
        foundHref = true;
      }
    });

    if (!foundHref) {
      chrome.runtime.sendMessage({ action: "submitStatus", value: false,issue:"FORM_NOT_FOUND", url: window.location.href });

      console.log('No buttons or hrefs found');
    } 
  }
  //   else {
  //     // Check for form again
  //     var formElementAfterClick = document.querySelector('form');
  //     if (!formElementAfterClick) {
  //       console.log('Form not found again after href');
  //     }else{
  //       console.log('form found after clcik')
  //       fillForm()
  //     }
  //   }
  // }else {
  //   // Check for form again
  //   var formElementAfterClick = document.querySelector('form');
  //   if (!formElementAfterClick) {
  //     console.log('Form not found again after button');
  //   }else{
  //     fillForm()
  //   }
  // }
    
  }else{
    chrome.runtime.sendMessage({ action: "submitStatus", value: false,issue:"FORM_NOT_FOUND", url: window.location.href });

  }
  
 
} else {
  fillForm()
}


// let formElement = document.querySelector('form'); 
// if (!formElement) {
//   console.log('initial Form not found');
  



// }else{
// fillForm()
  
  

// }

function fillForm(){
    console.log('FORM FOUND and gonna be auto-filled!')

  let formElement = document.querySelector('form'); 



  var formElements = formElement.elements;

var requiredInputFound = false;

// Loop through form elements
for (var i = 0; i < formElements.length; i++) {
  var element = formElements[i];

  // Check if the element is an input field and is required
  if (element.tagName === 'INPUT' && element.hasAttribute('required')) {
      switch (element.type) {
          case 'radio':
            // Click the first radio option
            element.checked = true;
            break;
          case 'checkbox':
            // Click the checkbox
            element.checked = true;
            break;
          case 'number':
            // Enter 0123456789 for number input
            element.value = '0123456789';
            break;
          case 'time':
            // Enter 01:01 for time input
            element.value = '01:01';
            break;
          case 'tel':
            // Enter 0123456789 for tel input
            element.value = '0123456789';
            break;
            case 'select-one':
        // Set the value to the first option for select dropdown
        element.selectedIndex = 1;
        break;
         case 'text':
        // Check if it's empty and set the value
        if (element.value.trim() === '') {
          element.value = 'Hello Value';
          console.log('Text field with required attribute and empty value found');
          emptyTextFieldFound = true;
        }
        break;

          // Add more cases for other input types as needed
        }
       
    console.log('Required input field found');
    requiredInputFound = true;
  }else if (element.tagName === 'SELECT' && element.hasAttribute('required')) {
      // Check if the element is a required select dropdown
      console.log('Required select dropdown found');
      
      // Select the second option in the dropdown list
      element.selectedIndex = 1;
    }
}

// Log only if required input is not found
if (!requiredInputFound) {
  console.log('No required input fields found');
}








fields.name = 'Check Name';
fields.email = 'checkemail@example.com';
fields.subject = passedSubject;
fields.message = passedMessage;
fields.EMAIL='check@gmail.com';
fields.Email='check@gmail.com';
fields.FIRSTNAME='firstname';
fields.LASTNAME='lastname';
fields.FirstName='fname';
fields.FirstName='lname';
fields.LastName='lname';
fields.Lastname='lname';
fields.MESSAGE=passedMessage;
fields.Message=passedMessage;
fields.NAME='checkname';
fields.Name='checkname';
fields.SUBJECT=passedSubject;
fields.Subject=passedSubject;
fields.fName='firstname';
fields.lName='lastname';
fields.lastName='lastname';
fields.firstName='firstName';
fields.lname='lastname'

// for (let fieldName in fields) {
//     let inputField = formElement.querySelector(`[name="${fieldName}"]`);
//     if (inputField) {
//         inputField.value = fields[fieldName];
//     }
// }
let subjectAdded = false;
let sendMessage = true;
let fieldFound = false;

for (let fieldName in fields) {
  
    let inputField = formElement.querySelector(`[name="${fieldName}"]`);
    
    if (inputField) {
        inputField.value = fields[fieldName];
    } else if (fieldName.toLowerCase() === 'subject') {
        if (!subjectAdded) {
            // Check variations of "Subject" and use the message field if not found
            if (!formElement.querySelector('[name*="subject" i]') && !formElement.querySelector('[name*="Subject" i]') && !formElement.querySelector('[name*="SUBJECT" i]')) {
                fields.message = `${fields.subject}\n\n${fields.message}`;
                subjectAdded = true;
            }
        }
    } else if (fieldName.toLowerCase() === 'message') {
        // Check variations of "Message" and log to console if not found
        if (!formElement.querySelector('[name*="message" i]') && !formElement.querySelector('[name*="Message" i]') && !formElement.querySelector('[name*="MESSAGE" i]')) {
            console.log('Message tab not present');
            sendMessage=false;
            chrome.runtime.sendMessage({ action: "submitStatus", value: false,issue:"MESSAGE_FIELD_NOT_FOUND", url: window.location.href });

        }
    }        fieldFound = true;



    
}if (!fieldFound) {
  chrome.runtime.sendMessage({ action: "submitStatus", value: false, issue: "NOT_ABLE_TO_IDENTIFY", url: window.location.href });
}

// subjectAdded=false;
// for (let fieldName in fields) {
//   let inputField = formElement.querySelector(`[name="${fieldName}"]`);
//   if (inputField) {
//       inputField.value = fields[fieldName];
//   } else if (fieldName.toLowerCase() === 'subject') {
//       if(!subjectAdded){
//                   // Check variations of "Subject" and use the message field if not found

//           if (!formElement.querySelector('[name*="subject" i]') && !formElement.querySelector('[name*="Subject" i]') && !formElement.querySelector('[name*="SUBJECT" i]')) {
//               fields.message = `${fields.subject}\n\n${fields.message}`;
//               subjectAdded = true;
//           }

//       }
      
      
//   }
// }

// Additional code to fill the message field (if not already filled by "Subject")
// if (fields.message) {
//     let messageField = formElement.querySelector('[name*="message" i]');
//     if (messageField) {
//         messageField.value = fields.message;
//     }
// }
// formElement.submit();
setTimeout(function() {


  if (emptyTextFieldFound) {
      console.log('Value entered into the text field after 5 seconds');
    } else {
      console.log('No text field with required attribute and empty value found after 5 seconds');
    }
    if(sendMessage){
      var submitButton = formElement.querySelector('[type="submit"]');
      if (submitButton) {
        console.log('submit button found')
        submitButton.click();
        console.log('Submit button clicked after 10 seconds');
        // sendStatus=true
        chrome.runtime.sendMessage({ action: "submitStatus", value: true,url: window.location.href });
    
      } else {
        console.log('submit button not found')
        chrome.runtime.sendMessage({ action: "submitStatus", value: false,issue:"other", url: window.location.href });
    
        console.log('No submit button found');
      }

    }
 
}, 7000);
  console.log('Form submitted');

}
}
});



