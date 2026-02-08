export interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
}

const ALLOWED_ORIGINS = [
  'https://clauding.dev',
  'https://www.clauding.dev',
  'http://localhost:5173',
];

function corsHeaders(request: Request): Headers {
  const origin = request.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
}

function getConfirmationEmail(): { subject: string; html: string } {
  return {
    subject: 'You\'re subscribed to clauding.dev/memory',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f0f23; color: #e5e7eb; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px;">clauding.dev/memory</h1>
      <p style="color: #f59e0b; font-size: 14px; margin: 0;">New post notifications</p>
    </div>

    <div style="background-color: #1a1a3e; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 32px;">
      <p style="margin: 0 0 16px; color: #d1d5db; line-height: 1.6;">
        You're in. I'll email you when I publish something new - patterns, workflows, and lessons from building with AI agents.
      </p>

      <p style="margin: 0 0 16px; color: #d1d5db; line-height: 1.6;">
        No spam. No schedule. Just signal.
      </p>

      <div style="background-color: #0f0f23; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #9ca3af; font-size: 14px; text-align: center;">
          <a href="https://clauding.dev/memory?utm_source=email&utm_medium=subscribe&utm_campaign=welcome" style="color: #f59e0b; text-decoration: underline;">Read the latest posts</a>
        </p>
      </div>
    </div>

    <div style="text-align: center; margin-top: 32px; color: #6b7280; font-size: 12px;">
      <p>clauding.dev - Things I learned building with AI agents</p>
    </div>
  </div>
</body>
</html>`,
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/subscribe') {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    }

    try {
      const body = await request.json() as { email?: string; source?: string };

      if (!body.email || !body.email.includes('@') || !body.email.includes('.')) {
        return new Response(
          JSON.stringify({ error: 'Please provide a valid email address' }),
          { status: 400, headers },
        );
      }

      const email = body.email.trim().toLowerCase();
      const source = body.source || 'unknown';

      // Add to Resend audience
      const contactRes = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({ email, unsubscribed: false, first_name: source }),
      });

      if (!contactRes.ok) {
        const error = await contactRes.text();
        console.error('Resend contact error:', error);
      }

      // Send confirmation email
      const template = getConfirmationEmail();
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'clauding.dev <noreply@ajents.company>',
          to: email,
          subject: template.subject,
          html: template.html,
        }),
      });

      if (!emailRes.ok) {
        const error = await emailRes.text();
        console.error('Resend email error:', error);
      }

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    } catch (err) {
      console.error('Subscribe handler error:', err);
      return new Response(
        JSON.stringify({ error: 'Failed to subscribe' }),
        { status: 500, headers },
      );
    }
  },
};
