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
                const response = await fetch(`https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-getItemDetails?itemId=${encodeURIComponent(itemId)}`);
                const data = await response.json();

                console.log("Fetched item data:", data);  // Log data to verify structure
                setItem(data);  
                setError(null);
            } catch (error) {
                console.error("Error fetching item details:", error.message);
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
            <img src={item.image?.imageUrl || "https://via.placeholder.com/300"} alt={item.title} />
            <p>{item.description}</p>
            <p>Price: ${item.price?.value || "N/A"}</p>
            <p>Condition: {item.condition || "Unknown"}</p>
            <p>Seller: {item.seller?.username || "Unknown"}</p>
            <p>User Ratings: {item.seller?.feedbackPercentage || "N/A"}%</p>
            <button className="cart-button">Add to Cart</button>
            <button className="buy-button">Buy Now</button>
        </div>
    );
};

export default ItemDetails;
