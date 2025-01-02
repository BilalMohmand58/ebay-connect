'use client';
import { useState } from 'react';

export default function Home() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConnect = () => {
        window.location.href = 'https://ebay-connect.vercel.app/api/callback';
    };

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            if (data.orders) {
                setOrders(data.orders);
            } else {
                setError('No orders found.');
            }
        } catch (error) {
            setError('Error fetching orders.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>eBay Orders</h1>
            <button onClick={handleConnect}>Connect eBay</button>

            {/* After the user is connected, display orders */}
            {loading && <p>Loading orders...</p>}
            {error && <p>{error}</p>}

            {orders.length > 0 && (
                <ul>
                    {orders.map((order) => (
                        <li key={order.orderId}>
                            Order ID: {order.orderId} - Total: {order.pricingSummary.total.value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
