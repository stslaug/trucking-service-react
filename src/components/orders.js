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
                setOrders(data.orders || []); // Assuming the response includes an `orders` array
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
            <h1>Welcome back, {dbUser.firstName || 'User'}!</h1>
            <p>Here is your order history:</p>

            {orders.length === 0 ? (
                <p>You haven’t placed any orders yet.</p>
            ) : (
                <ul className="order-list">
                    {orders.map((order, index) => (
                        <li key={index} className="order-item">
                            <h3>Order #{order.ORDER_ID}</h3>
                            <p><strong>Date:</strong> {new Date(order.ORDER_DATE).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {order.ORDER_STATUS}</p>
                            <p><strong>Total Points Used:</strong> {order.POINTS_USED}</p>
                            <p><strong>Product ID:</strong> {order.PRODUCT_ID}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;
