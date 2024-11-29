import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const data = await resend.emails.send({
      from: 'Pottery Studio <notifications@your-pottery-studio.com>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export function generatePickupEmail(studentName: string, pieceName: string) {
  return {
    subject: `Your Piece "${pieceName}" is Ready for Pickup!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Good News, ${studentName}!</h1>
        <p>Your piece "${pieceName}" is ready to be picked up from the studio.</p>
        <p>Please collect it during our regular studio hours:</p>
        <ul>
          <li>Monday - Friday: 9am - 6pm</li>
          <li>Saturday: 10am - 4pm</li>
        </ul>
        <p style="color: #666;">Note: Please bring your student ID when picking up your piece.</p>
      </div>
    `,
  };
} 