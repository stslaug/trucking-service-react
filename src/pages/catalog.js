import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/general.css';
import './css/catalog.css';
import Cart from '../components/Cart';

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
    const [selectedCategory, setSelectedCategory] = useState('6000');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('price'); // New state for sort criteria
    const [sortOrder, setSortOrder] = useState('asc'); // New state for sort order
    const [cartState, setCartState] = useState(false);
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
            // No need to call filterAndSortResults here; it's handled by useEffect
        } catch (error) {
            setError('Error fetching eBay data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [page, limit, selectedCategory]);

    // Define the order for conditions if needed
    const conditionOrder = {
        'New': 1,
        'Refurbished': 2,
        'Used': 3,
        'Unknown': 4
    };

    const filterAndSortResults = () => {
        let items = [...results]; // Create a shallow copy to avoid mutating state

        // Filter by price
        if (minPrice || maxPrice) {
            const min = parseFloat(minPrice) || 0;
            const max = parseFloat(maxPrice) || Infinity;
            items = items.filter(item => {
                const price = parseFloat(item.price?.value);
                return price >= min && price <= max;
            });
        }

        // Sort based on selected criteria
        switch (sortBy) {
            case 'price':
                items.sort((a, b) => {
                    const priceA = parseFloat(a.price?.value) || 0;
                    const priceB = parseFloat(b.price?.value) || 0;
                    return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
                });
                break;
            case 'title':
                items.sort((a, b) => {
                    const titleA = a.title?.toLowerCase() || '';
                    const titleB = b.title?.toLowerCase() || '';
                    if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
                    if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
                    return 0;
                });
                break;
            case 'sellerRating':
                items.sort((a, b) => {
                    const ratingA = parseFloat(a.seller?.feedbackPercentage) || 0;
                    const ratingB = parseFloat(b.seller?.feedbackPercentage) || 0;
                    return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
                });
                break;
            case 'dateListed':
                items.sort((a, b) => {
                    const dateA = new Date(a.dateListed) || new Date(0);
                    const dateB = new Date(b.dateListed) || new Date(0);
                    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                });
                break;
            default:
                break;
        }

        setFilteredResults(items);
    };

    useEffect(() => {
        filterAndSortResults();
    }, [minPrice, maxPrice, results, sortBy, sortOrder]);

    const handleAddToCart = (item) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartState(true);    
        alert(`${item.title} has been added to your cart.`);
    };
    const handleCart = () => {
        navigate('/cart')
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
                <button onClick={handleCart}>Cart</button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Loading items...</div>}

            <div className="controls-wrapper">
                <div className="control-wrapper">
                    <p>Items per page:</p>
                    <select className="limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="control-wrapper">
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

                <div className="control-wrapper">
                    <p>Sort By:</p>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="price">Price</option>
                        <option value="title">Title</option>
                        <option value="sellerRating">Seller Rating</option>
                        <option value="dateListed">Date Listed</option>
                    </select>

                    <p>Order:</p>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                <div className="control-wrapper">
                    <label>
                        Min Price:
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="0"
                            className="price-input"
                            min="0"
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
                            min="0"
                        />
                    </label>
                </div>
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
