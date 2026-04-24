import nodemailer from "nodemailer";
import CONFIG from "../config";

const transporter = nodemailer.createTransport({
  host: CONFIG.smtpHost,
  port: CONFIG.smtpPort,
  secure: CONFIG.smtpPort === 465,
  auth: {
    user: CONFIG.smtpAuthUser,
    pass: CONFIG.smtpAuthPass,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  token: string,
): Promise<void> {
  const resetLink = `${CONFIG.clientUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: CONFIG.senderEmail,
    to,
    subject: "Password Reset — Library Management",
    text: `You requested a password reset.\n\nUse this link to set a new password:\n${resetLink}\n\nThis link expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetLink}">Click here to set a new password</a></p>
      <p>Or copy this link: ${resetLink}</p>
      <p>This link expires in 10 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
}
