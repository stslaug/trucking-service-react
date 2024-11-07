import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./css/itemDetails.css";

const ItemDetails = () => {
    const { itemId } = useParams();  // Retrieve itemId from URL parameters
    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                // Fetch details from your API using itemId
                const response = await fetch(`https://qcygwj5wwc.execute-api.us-east-1.amazonaws.com/default/team12-catalog/item/${itemId}`);
                const data = await response.json();
                setItem(data);  // Set the item details
                setError(null);
            } catch (error) {
                setError('Error fetching item details: ' + error.message);
            }
        };
        fetchItemDetails();
    }, [itemId]);  // Re-run when itemId changes

    // If an error occurred, display the error message
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // If the item is still loading, display a loading message
    if (!item) {
        return <div>Loading...</div>;
    }

    // Display the item details
    return (
        <div className="item-details">
            <h1>{item.title}</h1>
            <img src={item.image.imageUrl} alt={item.title} />
            <p>{item.description}</p>
            <p>Price: ${item.price.value}</p>
            <p>Condition: {item.condition}</p>
            <p>Seller: {item.seller.username}</p>
            <p>User Ratings: {item.seller.feedbackPercentage}%</p>
            <button className="cart-button">Add to Cart</button>
            <button className="buy-button">Buy Now</button>
        </div>
    );
};

export default ItemDetails;
