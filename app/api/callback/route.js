export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const authCode = searchParams.get('code');
    
    console.log('Authorization Code:', authCode);  // Log the code to verify it's received
    
    if (!authCode) {
      return new Response(JSON.stringify({ error: 'Authorization code is missing' }), { status: 400 });
    }
  
    // Proceed to exchange the code
    return exchangeAuthCode(authCode);
  }
  
  async function exchangeAuthCode(authCode) {
    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    const redirectUri = process.env.EBAY_REDIRECT_URI;
    
    const tokenEndpoint = 'https://api.ebay.com/identity/v1/oauth2/token';
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri
    });
  
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });
  
      const data = await response.json();
      console.log('Token Exchange Response:', data);  // Log the full response from eBay
      
      if (data.access_token) {
        return new Response(JSON.stringify({ success: true, token: data.access_token }));
      } else {
        return new Response(JSON.stringify({ error: 'Failed to obtain token', details: data }), { status: 400 });
      }
    } catch (error) {
      console.error('Token Exchange Error:', error);
      return new Response(JSON.stringify({ error: 'Token exchange failed' }), { status: 500 });
    }
  }
  