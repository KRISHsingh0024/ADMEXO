import nodemailer from 'nodemailer';
import { LeadData } from './googleSheets';
import { getHtmlEmailTemplate } from './emailTemplate';

export async function sendConfirmationEmail(lead: LeadData, leadId?: string, baseUrl?: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const subject = `ADEMXO | Growth Proposal Request Received - ${lead.companyName}`;
  const htmlContent = getHtmlEmailTemplate(lead, leadId, baseUrl);
  const textContent = `Hello ${lead.contactName},\n\nWe have received your growth request for ${lead.companyName}. We will review it within 24 hours.\n\nSummary:\n- Email: ${lead.email}\n- Phone: ${lead.phone}\n- Budget: ${lead.budget}\n- Services: ${lead.services.join(', ')}\n- Description: ${lead.description}\n\nBest regards,\nADEMXO Team`;

  if (resendApiKey) {
    console.log('[Email] Sending confirmation email via Resend HTTP API...');
    try {
      const fromName = process.env.SMTP_FROM_NAME || 'ADEMXO';
      // Resend requires verified domains, or onboarding@resend.dev on the free tier if no domain is verified
      const fromEmail = process.env.SMTP_FROM_EMAIL || 'onboarding@resend.dev';

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `"${fromName}" <${fromEmail}>`,
          to: [lead.email],
          subject: subject,
          html: htmlContent,
          text: textContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to send email via Resend API:', errorData);
        return false;
      }

      console.log('Confirmation email sent successfully via Resend API!');
      return true;
    } catch (error) {
      console.error('Failed to send confirmation email via Resend API:', error);
      return false;
    }
  }

  // Fallback to standard SMTP
  const host = process.env.SMTP_HOST;
  const portStr = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const fromName = process.env.SMTP_FROM_NAME || 'ADEMXO';
  const fromEmail = process.env.SMTP_FROM_EMAIL || user;

  if (!host || !portStr || !user || !pass || !fromEmail) {
    console.error('SMTP environment variables are missing! Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM_EMAIL.');
    return false;
  }

  const port = parseInt(portStr, 10);

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // True for 465, false for 587 or other ports
      auth: {
        user,
        pass
      }
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: lead.email,
      subject: subject,
      html: htmlContent,
      text: textContent
    });

    console.log('Confirmation email sent successfully via SMTP! MessageId:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email via SMTP:', error);
    return false;
  }
}
