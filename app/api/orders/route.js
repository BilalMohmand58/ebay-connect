export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Access token is missing' });
  }

  const response = await fetch('https://api.ebay.com/sell/fulfillment/v1/order', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  res.status(200).json({ orders: data.orders || [] });
}
