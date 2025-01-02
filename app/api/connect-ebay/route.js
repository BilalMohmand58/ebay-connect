export async function GET() {
    const ebayAuthUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${process.env.EBAY_CLIENT_ID}&redirect_uri=${process.env.EBAY_REDIRECT_URI}&response_type=code&scope=https://api.ebay.com/oauth/api_scope`;
    return Response.redirect(ebayAuthUrl);
  }
  