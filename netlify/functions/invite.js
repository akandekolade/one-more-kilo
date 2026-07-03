// Validates the invite code server-side so it isn't readable in the page source.
// Set the real code in Netlify: Site configuration -> Environment variables -> INVITE_CODE
exports.handler = async (event) => {
  const code = (process.env.INVITE_CODE || 'mellon').toLowerCase();
  let guess = '';
  try { guess = (JSON.parse(event.body || '{}').code || '').trim().toLowerCase(); } catch (e) {}
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: guess === code })
  };
};
