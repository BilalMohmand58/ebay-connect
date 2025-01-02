export async function POST(req, res) {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Authorization code is missing or invalid' });
    }

    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

    try {
        const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            res.redirect(`/api/orders?token=${data.access_token}`);
        } else {
            res.status(500).json({ error: 'Failed to exchange code for token' });
        }
    } catch (error) {
        console.error('Error during token exchange:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
