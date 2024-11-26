import React, { useContext, useEffect, useState } from 'react';
import './css/checkout.css';
import { AuthContext } from '../components/AuthContext';

const Checkout = () => {
    const { dbUser, fetchUserProfile } = useContext(AuthContext); // Access logged-in user's data
    const [cartItems, setCartItems] = useState([]);
    const [conversionRate, setConversionRate] = useState(100); // Default: $1 = 100 points
    const [totalPointsNeeded, setTotalPointsNeeded] = useState(0);
    const [remainingPoints, setRemainingPoints] = useState(dbUser?.driver?.pointTotal || 0);

    useEffect(() => {
        // Log dbUser to debug driverId
        console.log('dbUser:', dbUser);

        // Retrieve cart items from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);

        // Set sponsor-specific conversion rate if available
        const sponsorRate = dbUser?.driver?.sponsors?.[0]?.conversionRate || 100;
        setConversionRate(sponsorRate);

        // Calculate total points based on conversion rate
        const totalPoints = cart.reduce((acc, item) => {
            const itemPrice = parseFloat(item.price?.value) || 0; // Use price value from the cart
            const itemPoints = itemPrice * sponsorRate;
            return acc + itemPoints;
        }, 0);
        setTotalPointsNeeded(totalPoints);

        // Calculate remaining points
        const currentPoints = dbUser?.driver?.pointTotal || 0;
        setRemainingPoints(currentPoints - totalPoints);
    }, [dbUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Use userId as driverId since it matches the structure of dbUser
        const driverId = dbUser?.userId;
    
        if (!driverId) {
            console.error('Driver ID (userId) is missing in dbUser:', dbUser);
            alert('Driver ID is missing. Please try again.');
            return;
        }
    
        const payload = {
            driverId,
            pointsDeducted: totalPointsNeeded,
        };
    
        console.log('Payload being sent to Lambda:', payload);
    
        try {
            const response = await fetch(
                'https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-UpdatePoints',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );
    
            const responseData = await response.json();
            console.log('Lambda response:', responseData);
    
            if (response.ok) {
                alert('Order submitted successfully!');
                fetchUserProfile(dbUser.username); // Refresh user profile
            } else {
                console.error('Error submitting order:', responseData);
                alert(`Error: ${responseData.message || 'An error occurred during checkout.'}`);
            }
        } catch (error) {
            console.error('Error updating points:', error);
            alert('There was an issue submitting your order. Please try again.');
        }
    };
    

    if (!dbUser) return <div>No user data available.</div>;

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            <div className="info-section">
                <p><strong>Your Current Points:</strong> {dbUser.driver.pointTotal || 0}</p>
                <p><strong>Shipping Address:</strong> 
                    {dbUser.address?.street}, {dbUser.address?.city}, {dbUser.address?.state} 
                    {dbUser.address?.zipCode}, {dbUser.address?.country}
                </p>
            </div>

            <div className="cart-summary">
                <h3>Cart Summary</h3>
                {cartItems.length > 0 ? (
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img src={item.image?.imageUrl || "placeholder.jpg"} alt={item.title} className="item-image" />
                                <div className="item-details">
                                    <p><strong>{item.title}</strong></p>
                                    <p>Price: ${item.price?.value || 'N/A'}</p>
                                    <p>Points: {(item.price?.value * conversionRate).toFixed(2)} pts</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items in the cart.</p>
                )}
                <p className="total-points"><strong>Total Points Needed:</strong> {totalPointsNeeded}</p>
            </div>

            <div className="points-section">
                <h3>Points Summary</h3>
                <p><strong>Current Points:</strong> {dbUser.driver.pointTotal || 0}</p>
                <p><strong>Points Deducted:</strong> {totalPointsNeeded}</p>
                <p><strong>Remaining Points:</strong> {remainingPoints >= 0 ? remainingPoints : 0}</p>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">
                <button type="submit" disabled={dbUser.driver.pointTotal < totalPointsNeeded}>
                    Submit Order
                </button>
                {dbUser.driver.pointTotal < totalPointsNeeded && (
                    <p className="error-message">
                        You do not have enough points to complete this order.
                    </p>
                )}
            </form>
        </div>
    );
};

export default Checkout;
