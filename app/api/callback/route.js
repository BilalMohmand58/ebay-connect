// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export async function GET(req) {
//     const { searchParams } = new URL(req.url);
//     const authCode = searchParams.get('code');

//     if (!authCode) {
//         return new Response(JSON.stringify({ error: 'Authorization code is missing' }), { status: 400 });
//     }

//     const tokenResponse = await exchangeAuthCode(authCode);
//     const tokenData = await tokenResponse.json();

//     if (tokenData.access_token) {
//         const token = tokenData.access_token;

//         // Store token in cookies
//         const response = NextResponse.redirect('/');
//         response.cookies.set('ebay_session', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             path: '/',
//             maxAge: 60 * 60, // 1 hour
//         });

//         return response;
//     }

//     return new Response(JSON.stringify({ error: 'Failed to obtain access token' }), { status: 400 });
// }

// async function exchangeAuthCode(authCode) {
//     const clientId = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
//     const clientSecret = process.env.EBAY_CLIENT_SECRET;
//     const redirectUri = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

//     const tokenEndpoint = 'https://api.ebay.com/identity/v1/oauth2/token';
//     const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

//     const body = new URLSearchParams({
//         grant_type: 'authorization_code',
//         code: authCode,
//         redirect_uri: redirectUri,
//     });

//     try {
//         const response = await fetch(tokenEndpoint, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Basic ${basicAuth}`,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body,
//         });

//         return response;
//     } catch (error) {
//         console.error('Token Exchange Error:', error);
//         return new Response(JSON.stringify({ error: 'Token exchange failed' }), { status: 500 });
//     }
// }



import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const authCode = searchParams.get('code');

    if (!authCode) {
        return new Response(JSON.stringify({ error: 'Authorization code is missing' }), { status: 400 });
    }

    const tokenResponse = await exchangeAuthCode(authCode);
    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
        const token = tokenData.access_token;

        // Store token in cookies
        const response = NextResponse.redirect('/');
        response.cookies.set('ebay_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60, // 1 hour
        });

        return response;
    }

    return new Response(JSON.stringify({ error: 'Failed to obtain access token' }), { status: 400 });
}

async function exchangeAuthCode(authCode) {
    const clientId = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

    const tokenEndpoint = 'https://api.ebay.com/identity/v1/oauth2/token';
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
    });

    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        });

        return response;
    } catch (error) {
        console.error('Token Exchange Error:', error);
        return new Response(JSON.stringify({ error: 'Token exchange failed' }), { status: 500 });
    }
}
