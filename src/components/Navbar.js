import React, { useContext, useEffect, useState } from 'react';
import './css/Navbar.css';
import { AuthContext } from '../components/AuthContext';

const Navbar = ({ onSignOut }) => {
    const { dbUser } = useContext(AuthContext); // Access dbUser from AuthContext
    const [activeRoute, setActiveRoute] = useState('/');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

    const handleNavigation = (route) => {
        window.location.href = route;
        setActiveRoute(route);
        console.log(`Navigating to ${route}`);
    };

    useEffect(() => {
        const currentPath = window.location.pathname;
        setActiveRoute(currentPath);
    }, []);

    // Safely extract userType from dbUser
    const userType = dbUser?.userType.toLowerCase();

    return (
        <>
        <div className="wrapper">
            <div className='navbar'>
                <h1 className="companyName">Haul of Fame</h1>
                <nav className="buttons">
                    <button
                        className={`button ${activeRoute === '/' ? 'active' : ''}`}
                        onClick={() => handleNavigation('/')}
                    >
                        Home
                    </button>

                    <button
                        className={`button ${activeRoute === '/about' ? 'active' : ''}`}
                        onClick={() => handleNavigation('/about')}
                    >
                        About
                    </button>

                    {dbUser ? ( // Check if user is logged in
                    <>
                        <button
                            className={`button ${activeRoute === '/catalog' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/catalog')}
                        >
                            Catalog
                        </button>

                        {userType === 'driver' ? ( // Check if userType is 'driver'
                                    <button
                                        className={`button ${activeRoute === '/cart' ? 'active' : ''}`}
                                        onClick={() => handleNavigation('/cart')}
                                    >
                                        Cart
                                    </button>
                        ) : null}

                        {userType === 'sponsor' ? ( // Check if userType is 'sponsor'
                                    <button
                                        className={`button ${activeRoute === '/sponsor' ? 'active' : ''}`}
                                        onClick={() => handleNavigation('/sponsor')}
                                    >
                                        Sponsor Dashboard
                                    </button>
                        ) : null}

                        <div
                            className="user-dropdown"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button
                                className="button"
                                id="usernameFont"
                                onClick={() => handleNavigation('/profile')}
                            >
                                {dbUser?.username || 'User'}
                            </button>

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleNavigation('/profile')}
                                    >
                                        View Profile
                                    </button>
                                    <button className="dropdown-item" onClick={onSignOut}>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                            </div>
                    </>
                    ) : (
                        <button
                            className={`button ${activeRoute === '/login' ? 'active' : ''}`}
                            onClick={() => handleNavigation('/login')}
                        >
                            Login
                        </button>
                    )}
                </nav>
            </div>
            </div>
        </>
    );
};

export default Navbar;
