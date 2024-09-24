



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


  if (document.getElementById('manualOption').checked) {
    manualFields.style.display = 'block';
    jsonFields.style.display = 'none';
    bulkFields.style.display = 'none';
    emailInput.required = true;  
    messageInput.required = true; 
    titleInput.required = true;
  } else if (document.getElementById('jsonOption').checked) {
    manualFields.style.display = 'none';
    jsonFields.style.display = 'block';
    bulkFields.style.display = 'none';
    emailInput.required = false;  
    messageInput.required = false; 
    titleInput.required = false;
  } else if (document.getElementById('bulkOption').checked) {
    manualFields.style.display = 'none';
    jsonFields.style.display = 'none';
    bulkFields.style.display = 'block';
    emailInput.required = false;  
    messageInput.required = false; 
    titleInput.required = false;
  }
}



async function sendEmail(emailData, isFile, isBulk) {
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



async function submitHandler(event) {
  event.preventDefault();
  const status = document.getElementById('status');
  status.innerText = 'In Progress, please wait';
  status.style.color = 'yellow';

  if (document.getElementById('manualOption').checked) {
    const email = document.getElementById('email').value;
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;
    const sendingResult = await sendEmail({ email, title, message }, false, false);
    displaySendingStatus(sendingResult);

  } else if (document.getElementById('jsonOption').checked) {
    const jsonFile = document.getElementById('jsonFile').files[0];
    if (jsonFile) {
      const sendingResult = await sendEmail(jsonFile, true, false);
      displaySendingStatus(sendingResult);
    } else {
      alert('Please upload a JSON file.');
    }

  } else if (document.getElementById('bulkOption').checked) {
    const emails = document.getElementById('bulkEmails').value.trim().split('\n').map(email => email.trim());
    const title = document.getElementById('bulkTitle').value;
    const message = document.getElementById('bulkMessage').value;
    const sendingResult = await sendEmail(emails.map(email => ({ email, title, message })), false, true);
    displaySendingStatus(sendingResult);
  }
}

document.getElementById('mailForm').addEventListener('submit', submitHandler);
