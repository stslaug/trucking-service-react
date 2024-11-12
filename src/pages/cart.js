import React, { useState, useEffect } from 'react';
import "./css/cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Retrieve cart items from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);

        // Calculate total price
        const total = cart.reduce((acc, item) => {
            const itemPrice = parseFloat(item.price?.value) || 0;
            return acc + itemPrice;
        }, 0);
        setTotalPrice(total);
    }, []);

    const handleRemoveItem = (index) => {
        const updatedCart = [...cartItems];
        updatedCart.splice(index, 1); // Remove item at specified index
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Update total price after removing item
        const newTotal = updatedCart.reduce((acc, item) => {
            const itemPrice = parseFloat(item.price?.value) || 0;
            return acc + itemPrice;
        }, 0);
        setTotalPrice(newTotal);
    };

    return (
        <div className="cart-wrapper">
            <div className="cart-container">
                <h1>Your Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        <div className="cart-table">
                            <div className="cart-header">
                                <span>Product</span>
                                <span>Title</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>Actions</span>
                            </div>
                            {cartItems.map((item, index) => (
                                <div className="cart-row" key={item.itemId}>
                                    <div className="cart-item-image">
                                        <img src={item.image?.imageUrl || "placeholder.jpg"} alt={item.title} width="80" />
                                    </div>
                                    <div className="cart-item-title">
                                        <h3>{item.title}</h3>
                                    </div>
                                    <div className="cart-item-price">
                                        <p>${item.price?.value || 'N/A'}</p>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <p>1</p> {/* Hardcoded for simplicity; adjust for quantity handling */}
                                    </div>
                                    <div className="cart-item-actions">
                                        <button onClick={() => handleRemoveItem(index)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
                            <button className="checkout-button">Proceed to Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
