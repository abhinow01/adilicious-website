// Receives postcards from the "come say hello" form.
// TODO: deliver them somewhere real — e.g. email with Resend/Nodemailer, a Slack webhook,
// or a Google Sheet. Until then they're validated and written to the server log.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { name = '', email = '', message = '', topic = '', company = '' } = body ?? {};

  // Honeypot filled in → quietly pretend it worked.
  if (company) return Response.json({ ok: true });

  if (!String(name).trim() || !EMAIL.test(String(email)) || !String(message).trim()) {
    return Response.json({ ok: false, error: 'Name, a valid email and a message are required' }, { status: 422 });
  }
  if (String(message).length > 1200 || String(name).length > 80 || String(email).length > 120) {
    return Response.json({ ok: false, error: 'Too long' }, { status: 413 });
  }

  const postcard = {
    name: String(name).trim(),
    email: String(email).trim(),
    topic: String(topic).slice(0, 40),
    message: String(message).trim(),
    receivedAt: new Date().toISOString(),
  };

  console.log('[postcard]', postcard);

  return Response.json({ ok: true });
}
