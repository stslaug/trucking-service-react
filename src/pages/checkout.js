import React, { useContext, useEffect, useState } from 'react';
import './css/general.css';
import { AuthContext } from '../components/AuthContext';

const Checkout = () => {
    const { dbUser } = useContext(AuthContext); // Access the logged-in user's data
    const [cartItems, setCartItems] = useState([]);
    const [totalPointsNeeded, setTotalPointsNeeded] = useState(0);

    useEffect(() => {
        // Fetch cart items from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Cart Items from localStorage:', cart); // Debugging log
        setCartItems(cart);

        // Calculate total points based on item's point value
        const totalPoints = cart.reduce((acc, item) => {
            console.log('Item being processed:', item); // Debugging log
            const itemPoints = parseFloat(item.points || 0); // Assume points is directly provided
            return acc + itemPoints;
        }, 0);
        setTotalPointsNeeded(totalPoints);
        console.log('Total Points Needed:', totalPoints); // Debugging log
    }, []);

    if (!dbUser) return <div>No user data available.</div>;

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Order submitted successfully!');
    };

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            <p><strong>Your Points:</strong> {dbUser.driver.pointTotal || 0}</p>
            <p><strong>Shipping Address:</strong> 
                {dbUser.address?.street}, {dbUser.address?.city}, {dbUser.address?.state} 
                {dbUser.address?.zipCode}, {dbUser.address?.country}
            </p>

            <div className="cart-summary">
                <h3>Cart Summary</h3>
                {cartItems.length > 0 ? (
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.points} points
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items in the cart.</p>
                )}
                <p><strong>Total Points Needed:</strong> {totalPointsNeeded}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <button type="submit" disabled={dbUser.driver.pointTotal < totalPointsNeeded}>
                    Submit Order
                </button>
                {dbUser.driver.pointTotal < totalPointsNeeded && (
                    <p style={{ color: 'red' }}>
                        You do not have enough points to complete this order.
                    </p>
                )}
            </form>
        </div>
    );
};

export default Checkout;
