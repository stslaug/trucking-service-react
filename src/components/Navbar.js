import React, { useEffect, useState } from 'react';
import './css/Navbar.css'; // Import the CSS file


const Navbar = ({ user, onSignOut }) => {

    const [activeRoute, setActiveRoute] = useState('/');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
    const [isAuth, setIsAuth] = useState(false); // State for dropdown visibility


    const handleNavigation = (route) => {
        window.location.href = route;
        setActiveRoute(route); // Update the active route
        console.log(`Navigating to ${route}`); 
    };


    useEffect(() => {
        const currentPath = window.location.pathname; // Get the current path
        setActiveRoute(currentPath); // Update active route based on current path
    }, []);
    
    return (
        <>
        <div id='navbar'>
            <h1 className="companyName">Haul of Fame</h1>
            <nav className="navbar">
             
                <button className={`button ${activeRoute === '/' ? 'active' : ''}`} onClick={() => handleNavigation('/')}>Home </button>                
                
                <button className={`button ${activeRoute === '/about' ? 'active' : ''}`} onClick={() => handleNavigation('/about')}> About </button>
                 
              
                
                    

                {user ? ( // Check if user is logged in
                <div style={{display: 'flex'}}>
                <div style={{flexBasis: '100%'}}>
                    <button  className={`button ${activeRoute === '/catalog' ? 'active' : ''}`} onClick={() => handleNavigation('/catalog')}> Catalog </button>
                </div>
                <div style={{flexBasis: '100%'}}  className="user-dropdown" 
                    onMouseEnter={() => setIsDropdownOpen(true)} 
                    onMouseLeave={() => setIsDropdownOpen(false)}>

                            <button className="button" id="usernameFont">{user.getUsername()}</button>
                            
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <button className="dropdown-item" onClick={() => handleNavigation('/profile')}>View Profile</button>
                                    <button className="dropdown-item" onClick={onSignOut}>Sign Out</button>
                                </div>
                            )}
                        </div></div>
                    ) : (
                        <button className={`button ${activeRoute === '/login' ? 'active' : ''}`} onClick={() => handleNavigation('/login')}>Login </button>
                    )}
            </nav>
        </div>
        </>

    );
};

export default Navbar;


