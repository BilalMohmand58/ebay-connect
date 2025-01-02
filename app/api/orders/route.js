export async function GET() {
  const accessToken = process.env.EBAY_ACCESS_TOKEN;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Access token is missing' }), { status: 401 });
  }

  const ordersEndpoint = 'https://api.ebay.com/sell/fulfillment/v1/order';

  try {
    const response = await fetch(ordersEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Fetched Orders:', data);

    return new Response(JSON.stringify({ orders: data.orders || [] }));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { status: 500 });
  }
}
