import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import '../pages/css/general.css';
import './css/orders.css';

const Orders = () => {
    const { dbUser } = useContext(AuthContext); // Access logged-in user's data
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(
                    `https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-GetOrders?driverId=${dbUser.userId}`
                );
                const data = await response.json();
                setOrders(data || []); // Lambda returns an array of orders
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        if (dbUser?.userId) {
            fetchOrders();
        }
    }, [dbUser]);

    if (loading) {
        return <div>Loading your orders...</div>;
    }

    return (
        <div className="orders-page">
            {/* Greeting the user */}
            <h1>Welcome back, {dbUser?.firstName || 'User'}!</h1>
            <p>Here is your order history:</p>

            {orders.length === 0 ? (
                <p>You haven’t placed any orders yet.</p>
            ) : (
                <ul className="order-list">
                    {orders.map((order, index) => (
                        <li key={index} className="order-item">
                            <h3>Order #{order.orderId}</h3>
                            <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Total Points Used:</strong> {order.pointsUsed}</p>
                            <h4>Items Ordered:</h4>
                            {order.items && order.items.length > 0 ? (
                                <ul className="item-list">
                                    {order.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="item-detail">
                                            <p><strong>Item ID:</strong> {item.itemId}</p>
                                            <p><strong>Title:</strong> {item.title}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No items found for this order.</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;
