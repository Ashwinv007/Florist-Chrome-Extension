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
  console.error('Form not found');
}else{
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


}


}
});