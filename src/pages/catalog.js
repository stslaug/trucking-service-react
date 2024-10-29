import React, { useState } from 'react';
import "./css/general.css";
import "./css/catalog.css";

const Catalog = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);  // Track the current page
    const [limit] = useState(20);  // Number of items per page


    const handleSearch = async () => {
        try { // TO-DO Put LAMBDA LINK
            const response = await fetch(`https://qcygwj5wwc.execute-api.us-east-1.amazonaws.com/default/team12-catalog`);
            const data = await response.json();
            setResults(data.itemSummaries);
        } catch (error) {
            alert('Error fetching eBay data:', error);
        }
    };

    const nextPage = () => {
        setPage(prev => prev + 1);
    };

    const prevPage = () => {
        if(page >= 1) setPage(1);
        else setPage(prev => prev - 1);
    };

    return (
        <div>
            <header>
                <h1>Point Catalog</h1>
                <p>A Curated Ebay Catalog for you to spend your well earned points!</p>
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

                <div className={"item-wrapper"}>
                    {results.map(item => (
                        <div className="item" key={item.itemId}>
                            <h3 className="item-title">{item.title}</h3>
                            <img className="item-img" src={item.image.imageUrl} alt={item.title} width="75px"/>

                            <div className="item-desc-wrapper">
                                <div className="leftCol">
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                </div>
                                <div className="rightCol">
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                    <p className={"item-text"}>Price: ${item.price.value}</p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <button onClick={prevPage} disabled={page === 1}>Previous</button>
                <span>Page {page}</span>
                <button onClick={nextPage}>Next</button>
            </div>
        </div>
    );
};

export default Catalog;
