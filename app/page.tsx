'use client'
import { useState } from 'react';

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConnectEbay = () => {
    const clientId = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;
    const scope = 'https://api.ebay.com/oauth/api_scope';

    const authUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Connect to eBay</h1>
      <button onClick={handleConnectEbay}>Connect to eBay</button>
      <div style={{ marginTop: '30px' }}>
        <h2>Your eBay Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>{order.title} - {order.status}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}