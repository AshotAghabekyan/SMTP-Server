import { Mail } from "../models/mailModel";


export default function createHtmlResponse(mail: Mail): string {
    const message = `
    <html>
    <head>
      <style>
        h3 {
          color: #333;
          font-family: Arial, sans-serif;
        }
        .content {
          background-color: #f9f9f9;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div style="text-align: center;">
            <img src="https://darpass.com/wp-content/uploads/2024/05/WCIT-2024-DigiTec-scaled.jpg" alt="WCIT 2024" style="max-width: 100%; height: 200px;">
        </div>
        <h3>${mail.title}</h3>
        <p>${mail.message}</p>
      </div>
      <div class="footer">
        <p>Best regards,<br>WCIT Team</p>
      </div>
    </body>
    </html>
  `
  return message;
}
