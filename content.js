console.log('HI from CONTENT.JS')

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
fields.subject = 'CheckSubject';
fields.message = 'Check message';
fields.EMAIL='check@gmail.com';
fields.Email='check@gmail.com';
fields.FIRSTNAME='firstname';
fields.LASTNAME='lastname';
fields.FirstName='fname';
fields.FirstName='lname';
fields.LastName='lname';
fields.Lastname='lname';
fields.MESSAGE='samplemssg';
fields.Message='simplemssg';
fields.NAME='checkname';
fields.Name='checkname';
fields.SUBJECT='samplesubject';
fields.Subject='simplesubject';
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