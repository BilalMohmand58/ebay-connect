export async function GET(req, res) {
  const token = req.query.token;

  if (!token) {
      return res.status(400).json({ error: 'Access token is missing' });
  }

  try {
      const response = await fetch('https://api.ebay.com/sell/order/v1/order', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      const data = await response.json();

      if (response.ok) {
          res.status(200).json(data);
      } else {
          res.status(500).json({ error: 'Failed to fetch orders', details: data });
      }
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}
