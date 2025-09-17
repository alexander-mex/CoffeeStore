import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"CoffeeStore" <no-reply@coffeestore.com>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}

export function generateEmailTemplate(title: string, body: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #6b46c1;">${title}</h2>
    <div style="font-size: 16px; color: #333;">
      ${body}
    </div>
    <footer style="margin-top: 20px; font-size: 12px; color: #999;">
      &copy; ${new Date().getFullYear()} CoffeeStore. Всі права захищені.
    </footer>
  </div>
  `;
}
