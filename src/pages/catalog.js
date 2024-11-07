import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/general.css';
import './css/catalog.css';

// Define your static list of categories
const categories = [
    { id: '6000', name: 'Motor' },
    { id: '58058', name: 'Cell Phones & Smartphones' },
    { id: '267', name: 'Computers/Tablets & Networking' },
    { id: '11450', name: 'Clothing, Shoes & Accessories' },
    { id: '625', name: 'Camera & Photo' },
    { id: '15032', name: 'Video Games & Consoles' },
    { id: '281', name: 'Antiques' },
    { id: '870', name: 'Crafts' },
    { id: '172008', name: 'Health & Beauty' }
    // Add more categories as needed
];

const Catalog = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('58058');

    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const url = `https://qcygwj5wwc.execute-api.us-east-1.amazonaws.com/default/team12-catalog?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&categoryId=${selectedCategory}`;
            const response = await fetch(url);
            const data = await response.json();
            setResults(Array.isArray(data) ? data : []); 
        } catch (error) {
            setError('Error fetching eBay data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [page, limit, selectedCategory]);

    const nextPage = () => setPage(prev => prev + 1);
    const prevPage = () => setPage(prev => (page > 1 ? prev - 1 : prev));

    const catalogClick = (itemId) => {
        navigate(`/item/${itemId}`);
    };

    return (
        <div>
            <header>
                <h1>Point Catalog</h1>
                <p>A Curated eBay Catalog for you to spend your well-earned points!</p>
            </header>

            <div className="searchBar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search eBay"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Error and Loading Messages */}
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Loading items...</div>}

            <div className="limit-wrapper">
                <p>Display how many catalog items per request:</p>
                <select className="limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>

                <p>Category:</p>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="page-select-wrapper">
                <button className="page-select-button" onClick={prevPage} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button className="page-select-button" onClick={nextPage}>Next</button>
            </div>

            <div className="item-wrapper">
                {Array.isArray(results) && results.map(item => (
                    <div className="item" key={item.itemId}>
                        <h3 className="item-title">{item.title}</h3>
                        <p>
                            Seller: {item.seller?.username || "Unknown"}<br />
                            User Ratings: {item.seller?.feedbackPercentage || "N/A"}%
                        </p>
                        <button type="button" className="item-img-button" onClick={() => catalogClick(item.itemId)}>
                            <img
                                className="item-img"
                                src={item.image?.imageUrl || "placeholder.jpg"}
                                alt={item.title}
                                width="75px"
                            />
                        </button>

                        <div className="item-desc-wrapper">
                            <div className="leftCol">
                                <p className="item-text">Price: ${item.price?.value || "N/A"}</p>
                            </div>
                            <div className="rightCol">
                                <p className="item-text">Condition: {item.condition || "Unknown"}</p>
                            </div>
                        </div>
                        <p className="item-text location">Location: {item.location || "Unknown"}</p>
                    </div>
                ))}
            </div>

            <div className="page-select-wrapper">
                <button className="page-select-button" onClick={prevPage} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button className="page-select-button" onClick={nextPage}>Next</button>
            </div>
        </div>
    );
};

export default Catalog;
