


document.addEventListener('DOMContentLoaded', toggleInputFields);
document.getElementById('manualOption').addEventListener('change', toggleInputFields);
document.getElementById('jsonOption').addEventListener('change', toggleInputFields);
document.getElementById('bulkOption').addEventListener('change', toggleInputFields);




function toggleInputFields() {
  const manualFields = document.getElementById('manualFields');
  const jsonFields = document.getElementById('jsonFields');
  const bulkFields = document.getElementById('bulkFields');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const titleInput = document.getElementById('title');

  const bulkEmailsInput = document.getElementById("bulkEmails");
  const bulkMessageInput = document.getElementById("bulkMessage");
  const bulkTitleInput = document.getElementById("bulkTitle");

  emailInput.required = false;  
  messageInput.required = false; 
  titleInput.required = false;
  bulkEmailsInput.required = false;
  bulkMessageInput.required = false;
  bulkTitleInput.required = false;


  if (document.getElementById('manualOption').checked) {
    manualFields.style.display = 'block';
    jsonFields.style.display = 'none';
    bulkFields.style.display = 'none';
    emailInput.required = true;  
    messageInput.required = true; 
    titleInput.required = true;
  } 
  else if (document.getElementById('jsonOption').checked) {
    manualFields.style.display = 'none';
    jsonFields.style.display = 'block';
    bulkFields.style.display = 'none';

  } else if (document.getElementById('bulkOption').checked) {
    manualFields.style.display = 'none';
    jsonFields.style.display = 'none';
    bulkFields.style.display = 'block';
    bulkEmailsInput.required = true;
    bulkMessageInput.required = true;
    bulkTitleInput.required = true;
  }
}



async function sendEmail(emailData, {isBulk, isFile}) {
  emailData = isFile ? emailData : JSON.stringify(isBulk ? emailData : [emailData]);
  console.log(emailData);
  const response = await fetch(`/mail?isFile=${isFile}&isBulk=${isBulk}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: emailData,
    });

  return response.ok;
}



function displaySendingStatus(sendingResult) {
  const status = document.getElementById('status');
  if (sendingResult) {
    status.textContent = 'Emails sent successfully!';
    status.style.color = 'green';
  } else {
    status.textContent = 'The emails were not sent';
    status.style.color = "red";
  }

  setTimeout(() => status.textContent = "", 1500);
}



async function manualSendHandler() {
  const email = document.getElementById('email').value;
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;
  const sendingResult = await sendEmail({ email, title, message }, {isBulk:false, isFile: false});
  return sendingResult
}



async function fileSendHander() {
  const jsonFile = document.getElementById('jsonFile').files[0];
  if (jsonFile) {
    const sendingResult = await sendEmail(jsonFile, {isBulk:false, isFile: true});
    return sendingResult
  }
  else {
    alert('Please upload a JSON file.');
    return null;
  }
}



async function bulkSendHandler() {
  const emails = document.getElementById('bulkEmails').value.trim().split('\n');
  const title = document.getElementById('bulkTitle').value;
  const message = document.getElementById('bulkMessage').value;
  const emailData = emails.map((email) => ({
    email: email.trim(),
    message,
    title,
  }));
  const sendingResult = await sendEmail(emailData, {isBulk:true, isFile: false});
  return sendingResult;
}



async function submitHandler(event) {
  event.preventDefault();
  const status = document.getElementById('status');
  const manualOptionChecked = document.getElementById('manualOption').checked;
  const jsonOptionChecked = document.getElementById('jsonOption').checked;
  const bulkOptionChecked = document.getElementById('bulkOption').checked;
  let sendingResult = null;
  status.innerText = 'In Progress, please wait';
  status.style.color = 'yellow';

  if (manualOptionChecked) {
    sendingResult = await manualSendHandler();
  } 
  else if (jsonOptionChecked) {
    sendingResult = await fileSendHander()
  } 
  else if (bulkOptionChecked) {
    sendingResult = await bulkSendHandler()
  }

  displaySendingStatus(sendingResult);
}



document.getElementById('mailForm').addEventListener('submit', submitHandler);
