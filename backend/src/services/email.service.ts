import { config } from '../config/env.js';

export interface EmailPayload {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budgetRange?: string;
  message: string;
  createdAt: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  mode: 'live' | 'simulated';
}

export class EmailService {
  /**
   * Sends transactional email notification to the site owner via Resend HTTPS API.
   * Never exposes API key or crashes if key is unconfigured.
   */
  public static async sendContactNotification(payload: EmailPayload): Promise<EmailSendResult> {
    const apiKey = config.emailProviderApiKey;
    const receiver = config.contactReceiverEmail;
    const fromEmail = config.emailFrom;

    const emailSubject = `[New Project Inquiry] ${payload.name} — ${payload.projectType}`;
    const emailText = [
      'NEW CLIENT LEAD RECEIVED',
      '========================',
      `Client Name:      ${payload.name}`,
      `Email Address:    ${payload.email}`,
      `Company / Org:    ${payload.company || 'Not Specified'}`,
      `Project Type:     ${payload.projectType}`,
      `Estimated Budget: ${payload.budgetRange || 'Not Specified'}`,
      `Submitted At:     ${new Date(payload.createdAt).toUTCString()}`,
      '',
      'CLIENT MESSAGE:',
      payload.message,
      '',
      '------------------------',
      'Dispatched securely from Aurelius Digital Product Portfolio Backend via Resend HTTPS API.',
    ].join('\n');

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #070707; color: #F5F5F2; padding: 32px; border-radius: 8px; border: 1px solid #242424;">
        <div style="border-bottom: 1px solid #242424; padding-bottom: 16px; margin-bottom: 24px;">
          <p style="text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; color: #C9A769; margin: 0 0 8px 0;">Portfolio Inquiry Engine</p>
          <h2 style="font-size: 20px; font-weight: 600; margin: 0; color: #FFFFFF;">New Client Lead Received</h2>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #969691; font-size: 13px; width: 140px;">Client Name</td>
            <td style="padding: 8px 0; color: #F5F5F2; font-size: 14px; font-weight: 500;">${escapeHtml(payload.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #969691; font-size: 13px;">Email Address</td>
            <td style="padding: 8px 0; color: #C9A769; font-size: 14px;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #C9A769; text-decoration: none;">${escapeHtml(payload.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #969691; font-size: 13px;">Company / Org</td>
            <td style="padding: 8px 0; color: #F5F5F2; font-size: 14px;">${escapeHtml(payload.company || 'Not Specified')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #969691; font-size: 13px;">Project Type</td>
            <td style="padding: 8px 0; color: #10B981; font-size: 14px; font-weight: 500;">${escapeHtml(payload.projectType)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #969691; font-size: 13px;">Estimated Budget</td>
            <td style="padding: 8px 0; color: #F5F5F2; font-size: 14px;">${escapeHtml(payload.budgetRange || 'Not Specified')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #969691; font-size: 13px;">Submitted At</td>
            <td style="padding: 8px 0; color: #969691; font-size: 13px;">${new Date(payload.createdAt).toUTCString()}</td>
          </tr>
        </table>

        <div style="background-color: #0D0D0D; padding: 20px; border-radius: 6px; border: 1px solid #1E1E1E; margin-bottom: 24px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #666662; margin: 0 0 8px 0;">Client Message</p>
          <p style="color: #E2E2DE; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
        </div>

        <div style="border-top: 1px solid #1E1E1E; padding-top: 16px; font-size: 11px; color: #666662;">
          <p style="margin: 0;">Dispatched securely from Aurelius Digital Product Portfolio Backend via Resend HTTPS API.</p>
        </div>
      </div>
    `;

    // Reject simulated success when API key is missing
    if (!apiKey) {
      const missingKeyError =
        'Email delivery provider is unconfigured: EMAIL_PROVIDER_API_KEY environment variable is missing.';
      console.error(`[EmailService] ${missingKeyError} Cannot deliver notification to ${receiver}.`);
      return {
        success: false,
        error: missingKeyError,
        mode: 'live',
      };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [receiver],
          reply_to: payload.email,
          subject: emailSubject,
          html: emailHtml,
          text: emailText,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        let providerError = `Email provider responded with HTTP ${response.status}`;
        try {
          const parsed = JSON.parse(errBody);
          if (parsed.message) {
            providerError = `${parsed.message} (HTTP ${response.status})`;
          }
        } catch {
          if (errBody) {
            providerError = `${errBody} (HTTP ${response.status})`;
          }
        }
        console.error('[EmailService] Resend API error response:', providerError);
        return {
          success: false,
          error: providerError,
          mode: 'live',
        };
      }

      const resData = (await response.json()) as { id?: string };
      console.log(`[EmailService] Transactional email delivered to ${receiver} via Resend. Message ID: ${resData.id}`);
      return {
        success: true,
        messageId: resData.id,
        mode: 'live',
      };
    } catch (error) {
      console.error('[EmailService] Failed to send transactional email via HTTPS API:', error);
      return {
        success: false,
        error: (error as Error).message || 'Network failure communicating with email provider',
        mode: 'live',
      };
    }
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
