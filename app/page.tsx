'use client';
import { useEffect, useState } from 'react';

interface Order {
    orderId: string;
    pricingSummary: {
        total: {
            value: string;
        };
    };
}

export default function Home() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();
                setOrders(data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Your Orders</h1>
            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <ul>
                    {orders?.length > 0 ? (
                        orders.map((order) => (
                            <li key={order?.orderId}>
                                Order ID: {order?.orderId} - Total: {order?.pricingSummary?.total?.value}
                            </li>
                        ))
                    ) : (
                        <p>No orders found.</p>
                    )}
                </ul>
            )}
        </div>
    );
}
