

document.getElementById('manualOption').addEventListener('change', toggleInputFields);
document.getElementById('jsonOption').addEventListener('change', toggleInputFields);



function toggleInputFields() {
  const manualFields = document.getElementById('manualFields');
  const jsonFields = document.getElementById('jsonFields');
  const emailInput = document.getElementById('email');
  const titleInput = document.getElementById("title");
  const messageInput = document.getElementById('message');
  

  if (document.getElementById('manualOption').checked) {
    manualFields.style.display = 'block';
    jsonFields.style.display = 'none';
    emailInput.required = true;  
    messageInput.required = true; 
    titleInput.required = true;
  } else {
    manualFields.style.display = 'none';
    jsonFields.style.display = 'block';
    emailInput.required = false;  
    messageInput.required = false; 
    titleInput.required = false;
  }
}



async function sendEmail(emailData, isFile) {
  emailData = isFile? emailData : JSON.stringify([emailData]);

  const response = await fetch(`/mail?isFile=${isFile}`, {
      "method": "POST",
      headers: {
        "Content-Type": "application/json",
      },
      "body": emailData,
    })

    return response.ok? true : false;
}




function displaySendingStatus(sendingResult) {
  const status = document.getElementById('status')
  if (sendingResult) {
    status.textContent = 'Emails sent successfully!';
    status.style.color = 'green';
  }
  else {
    status.textContent = 'The emails was not sent'
    status.style.color = "red";
  }

  setTimeout(() => status.textContent = "", 1500);
}


async function submitHandler(event) {
  event.preventDefault();
  const status = document.getElementById('status')
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const title = document.getElementById('title').value;


  if (document.getElementById('manualOption').checked) {
    status.innerText = 'In Progress, please wait';
    status.style.color = 'yellow';
    const sendingResult = await sendEmail({email, message, title}, 0);
    displaySendingStatus(sendingResult);   
  } 
  else {
    const jsonFile = document.getElementById('jsonFile').files[0];
    if (jsonFile) {
      status.innerText = 'In Progress, please wait';
      status.style.color = 'yellow';
      const sendingResult = await sendEmail(jsonFile, 1);
      displaySendingStatus(sendingResult);
    } 
    else {
      alert('Please upload a JSON file.');
    }
  }
}


document.getElementById('mailForm').addEventListener('submit', submitHandler);


