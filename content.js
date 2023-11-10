console.log('HI from CONTENT.JS')
// content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "PassData") {
      const passedMessage = message.message;
      const passedSubject = message.subject;
  
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



let formElement = document.querySelector('form'); 
if (!formElement) {
  console.log('Form not found');

}else{
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

    console.log('FORM FOUND!')







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
subjectAdded=false;
for (let fieldName in fields) {
    let inputField = formElement.querySelector(`[name="${fieldName}"]`);
    if (inputField) {
        inputField.value = fields[fieldName];
    } else if (fieldName.toLowerCase() === 'subject') {
        if(!subjectAdded){
                    // Check variations of "Subject" and use the message field if not found

            if (!formElement.querySelector('[name*="subject" i]') && !formElement.querySelector('[name*="Subject" i]') && !formElement.querySelector('[name*="SUBJECT" i]')) {
                fields.message = `${fields.subject}\n\n${fields.message}`;
                subjectAdded = true;
            }

        }
        
        
    }
}

// Additional code to fill the message field (if not already filled by "Subject")
// if (fields.message) {
//     let messageField = formElement.querySelector('[name*="message" i]');
//     if (messageField) {
//         messageField.value = fields.message;
//     }
// }
// formElement.submit();
setTimeout(function() {
    var submitButton = formElement.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.click();
      console.log('Submit button clicked after 10 seconds');
    } else {
      console.log('No submit button found');
    }
  }, 10000);
    console.log('Form submitted');

}


}
});