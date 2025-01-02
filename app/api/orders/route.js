export async function GET() {
  const accessToken = process.env.EBAY_ACCESS_TOKEN;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Access token is missing' }), { status: 401 });
  }

  const ordersEndpoint = 'https://api.ebay.com/buy/order/v1/order';

  try {
    const response = await fetch(ordersEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify({ orders: data.orders || [] }));
    } else {
      console.error('Error fetching orders:', data);
      return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { status: 500 });
    }
  } catch (error) {
    console.error('Order Fetch Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { status: 500 });
  }
}
