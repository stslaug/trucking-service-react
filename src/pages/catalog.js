import React, { useState, useEffect } from 'react';
import "./css/general.css";
import "./css/catalog.css";

const Catalog = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);  // Track the current page
    const [limit] = useState(20);  // Number of items per page
    const [error, setError] = useState(null); // State for error messages

    const handleSearch = async () => {
        try {
            // Construct the URL for the API with query and pagination
            const response = await fetch(`https://qcygwj5wwc.execute-api.us-east-1.amazonaws.com/default/team12-catalog?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
            const data = await response.json();
            setResults(data); // Assuming data is in the format you want
            setError(null); // Clear any previous errors
        } catch (error) {
            setError('Error fetching eBay data: ' + error.message);
        }
    };

    useEffect(() => {
        handleSearch(); // Call handleSearch when page changes
    }, [page]); // Add page as a dependency

    const nextPage = () => {
        setPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    return (
        <div>
            <header>
                <h1>Point Catalog</h1>
                <p>A Curated Ebay Catalog for you to spend your well-earned points!</p>
            </header>

            <div>
                <div className="searchBar">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search eBay"
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>

                {/* Error message display */}
                {error && <div className="error-message">{error}</div>}

                <div className={"item-wrapper"}>
                    {results.map(item => (
                        <div className="item" key={item.itemId}>
                            <h3 className="item-title">{item.title}</h3>
                            <p style={{alignContent:'center', width:'100%', justifyContent:'center'}}>
                                Seller: {item.seller.username}<br/>
                                User Ratings: {item.seller.feedbackPercentage}%
                            </p>
                            <img className="item-img" src={item.image.imageUrl} alt={item.title} width="75px"/>

                            <div className="item-desc-wrapper">
                                <div className="leftCol">
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                </div>
                                <div className="rightCol">
                                    <p className={"item-text"}>Condition: {item.condition}</p>
                                </div>
                            </div>
                            <p className={"item-text location"}>Location: {item.location}</p>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <button onClick={prevPage} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button onClick={nextPage}>Next</button>
            </div>
        </div>
    );
};

export default Catalog;
