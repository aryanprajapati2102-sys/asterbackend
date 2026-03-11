import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE) === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEnquiryNotification = async (payload) => {
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!ownerEmail) return;

  const { name, email, phone, moveInDate, roomType, message } = payload;
  const html = `
    <h2>New Enquiry - Aster Homes PG</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email || "N/A"}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Move-in Date:</strong> ${moveInDate ? new Date(moveInDate).toDateString() : "N/A"}</p>
    <p><strong>Room Type:</strong> ${roomType || "Not specified"}</p>
    <p><strong>Message:</strong> ${message || "N/A"}</p>
  `;

  await transporter.sendMail({
    from: `"Aster Homes Website" <${process.env.SMTP_USER}>`,
    to: ownerEmail,
    subject: "New Enquiry - Aster Homes PG",
    html
  });
};
