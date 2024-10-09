


document.addEventListener('DOMContentLoaded', toggleInputFields);
document.getElementById('manualOption').addEventListener('change', toggleInputFields);
document.getElementById('bulkOption').addEventListener('change', toggleInputFields);
document.getElementById('csvOption').addEventListener('change', toggleInputFields);


function reload() {
  setTimeout(window.reload, 1500);
}


function toggleInputFields() {
  try {
    const manualFields = document.getElementById('manualFields');
    const bulkFields = document.getElementById('bulkFields');
    const csvFields = document.getElementById("csvFields");

    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const titleInput = document.getElementById('title');
  
    const bulkEmailsInput = document.getElementById("bulkEmails");
    const bulkMessageInput = document.getElementById("bulkMessage");
    const bulkTitleInput = document.getElementById("bulkTitle");
    
    const csvMessageInput = document.getElementById("csvMessage");
    const csvTitleInput = document.getElementById("csvTitle")

    emailInput.required = false;  
    messageInput.required = false; 
    titleInput.required = false;
    bulkEmailsInput.required = false;
    bulkMessageInput.required = false;
    bulkTitleInput.required = false;
    csvMessageInput.required = false;
    csvTitleInput.required = false
  
  
    if (document.getElementById('manualOption').checked) {
      manualFields.style.display = 'block';
      bulkFields.style.display = 'none';
      csvFields.style.display = "none";
      emailInput.required = true;  
      messageInput.required = true; 
      titleInput.required = true;
    } 
    else if (document.getElementById('bulkOption').checked) {
      manualFields.style.display = 'none';
      csvFields.style.display = "none";
      bulkFields.style.display = 'block';
      bulkEmailsInput.required = true;
      bulkMessageInput.required = true;
      bulkTitleInput.required = true;
    }
    else if (document.getElementById("csvOption").checked) {
      manualFields.style.display = 'none';
      bulkFields.style.display = 'none';
      csvFields.style.display = "block";
      csvTitleInput.required = true;
      csvMessageInput.required = true;
    }
    
  }
  catch(error) {
    console.log(error);
    reload()
  }
}



async function sendEmail(formData, uploadType = 'manual') {
  try {
    const response = await fetch(`/mail/${uploadType}`, {
      method: "POST",
      body: formData,  
    });
  
    return response.ok;
  }
  catch(error) {
    console.log(error);
    return null;
  }
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
  try {
    const email = document.getElementById('email').value;
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;
    const attachedFiles = document.getElementById("attachFile").files || ""; 
    console.log(attachedFiles);
    const formData = new FormData();
  
    for (let file of Object.values(attachedFiles)) {
      formData.append('attachedFiles', file)
    }
  
    formData.append('email', email);
    formData.append('title', title);
    formData.append('message', message);
    const sendingResult = await sendEmail(formData, "manual");
    return sendingResult
  }
  catch(error) {
    console.log(error);
    return null;
  }
}



async function csvSendHandler() {
  try {
    const title = document.getElementById("csvTitle");
    const message = document.getElementById("csvMessage");
    const csvFile = document.getElementById('csvFile').files[0];
    const attachedFiles = document.getElementById("csvAttachFiles").files || "";
    const formData = new FormData();
    
    formData.append("title", title);
    formData.append("message", message);
    formData.append('csvFile', csvFile);
    for (let file of Object.values(attachedFiles)) {
      formData.append('attachedFiles', file);
    }

    const sendingResult = await sendEmail(formData, "csv");
    return sendingResult;
  } catch (error) {
    console.log(error);
    return null;
  }
}



async function bulkSendHandler() {
  try {
    const emails = document.getElementById('bulkEmails').value.trim().split('\n');
    const title = document.getElementById('bulkTitle').value;
    const message = document.getElementById('bulkMessage').value;
    const attachedFiles = document.getElementById("bulkAttachFile").files || "";  
    const formData = new FormData();
  
    for (let file of Object.values(attachedFiles)) {
      formData.append('attachedFiles', file)
    }
  
    formData.append('email', emails);
    formData.append('title', title);
    formData.append('message', message);
  
    if (emails.length > 150) {
      alert('too many mails!. mails count must been <= 150');
      return null;
    }
  
    const sendingResult = await sendEmail(formData, "bulk");
    return sendingResult;
  }
  catch(error) {
    console.log(error);
    return null;
  }
}



async function submitHandler(event) {
  try {
    event.preventDefault();
    const status = document.getElementById('status');
    const manualOptionChecked = document.getElementById('manualOption').checked;
    const bulkOptionChecked = document.getElementById('bulkOption').checked;
    const csvOptionChecked = document.getElementById("csvOption").checked;
    let sendingResult = null;
    status.innerText = 'In Progress, please wait';
    status.style.color = 'yellow';
  
    if (manualOptionChecked) {
      sendingResult = await manualSendHandler();
    } 
    else if (bulkOptionChecked) {
      sendingResult = await bulkSendHandler()
    }
    else if (csvOptionChecked) {
      sendingResult = await csvSendHandler()
    }
  
    displaySendingStatus(sendingResult);
  }
  catch(error) {
    console.log(error);
    displaySendingStatus(false)
    reload()
  }
}


document.getElementById('mailForm').addEventListener('submit', submitHandler);