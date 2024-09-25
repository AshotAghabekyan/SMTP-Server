

export default {
    port: +process.env.PORT,
    https_port: +process.env.HTTPS_PORT,
    email_app_password: process.env.EMAIL_APP_PASSWORD,
    smtp_port: +process.env.SMTP_PORT,
    smtp_host: process.env.SMTP_HOST,
    smtp_sender_email: process.env.SMTP_SENDER_EMAIL,
}