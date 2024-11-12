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
];

const Catalog = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('58058');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-catalog?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&categoryId=${selectedCategory}`;
            const response = await fetch(url);
            const data = await response.json();
            const items = Array.isArray(data) ? data : [];
            setResults(items);
            filterResults(items);
        } catch (error) {
            setError('Error fetching eBay data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [page, limit, selectedCategory]);

    const filterResults = (items = results) => {
        const filtered = items.filter(item => {
            const price = item.price?.value;
            const min = parseFloat(minPrice) || 0;
            const max = parseFloat(maxPrice) || Infinity;
            return price >= min && price <= max;
        });
        setFilteredResults(filtered);
    };

    useEffect(() => {
        filterResults();
    }, [minPrice, maxPrice, results]);

    const handleAddToCart = (item) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${item.title} has been added to your cart.`);
    };

    const nextPage = () => setPage(prev => prev + 1);
    const prevPage = () => setPage(prev => (page > 1 ? prev - 1 : prev));

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

            <div className="price-filter">
                <label>
                    Min Price:
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="price-input"
                    />
                </label>
                <label>
                    Max Price:
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="No Max"
                        className="price-input"
                    />
                </label>
            </div>

            <div className="page-select-wrapper">
                <button className="page-select-button" onClick={prevPage} disabled={page === 1}>Previous</button>
                <span> Page {page} </span>
                <button className="page-select-button" onClick={nextPage}>Next</button>
            </div>

            <div className="item-wrapper">
                {Array.isArray(filteredResults) && filteredResults.map(item => (
                    <div className="item" key={item.itemId}>
                        <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer">
                            <h3 className="item-title">{item.title}</h3>
                            <img
                                className="item-img"
                                src={item.image?.imageUrl || "placeholder.jpg"}
                                alt={item.title}
                                width="150px"
                            />
                        </a>
                        <p>
                            Seller: {item.seller?.username || "Unknown"}<br />
                            User Ratings: {item.seller?.feedbackPercentage || "N/A"}%
                        </p>

                        <div className="item-desc-wrapper">
                            <div className="leftCol">
                                <p className="item-text">Price: ${item.price?.value || "N/A"}</p>
                            </div>
                            <div className="rightCol">
                                <p className="item-text">Condition: {item.condition || "Unknown"}</p>
                            </div>
                        </div>

                        <button onClick={() => handleAddToCart(item)} className="add-to-cart-button">
                            Add to Cart
                        </button>
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
