import fetch from 'node-fetch'; // Ensure you have installed node-fetch
import { Buffer } from 'buffer'; // Required for base64 encoding

export default async function handler(req, res) {
  const { ebaytkn, tknexp, username } = req.query;
  
  if (!ebaytkn) {
    return res.status(400).json({ error: 'Missing eBay token' });
  }

  // eBay OAuth token exchange endpoint
  const tokenUrl = 'https://api.ebay.com/identity/v1/oauth2/token';
  const clientId = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_EBAY_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: ebaytkn,
    redirect_uri: redirectUri,
  });

  try {
    // Send the request to exchange the authorization code for an access token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token from eBay');
    }

    const data = await response.json();
    
    // Log the access token for debugging (you can remove this later)
    console.log('eBay Access Token:', data.access_token);

    // Store the access token (e.g., in a session or database)
    // Example: saveTokenToDatabase(data.access_token);

    // Redirect the user to a success page
    return res.redirect('/success');  // Change '/success' to the appropriate success URL in your app
  } catch (error) {
    console.error('Error handling eBay OAuth callback:', error);
    return res.status(500).json({ error: 'Error handling OAuth callback' });
  }
}
