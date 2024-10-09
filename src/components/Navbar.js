import React, { useEffect, useState } from 'react';
import './css/Navbar.css'; // Import the CSS file


const Navbar = ({ onNavigate }) => {

    const [activeRoute, setActiveRoute] = useState('/');

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
            <h1 class="companyName">Haul of Fame</h1>
            <nav className="navbar">
                <button className={`button ${activeRoute === '/login' ? 'active' : ''}`} onClick={() => handleNavigation('/login')}>Login </button>
                <button className={`button ${activeRoute === '/about' ? 'active' : ''}`} onClick={() => handleNavigation('/about')}> About </button>
                <button className={`button ${activeRoute === '/' ? 'active' : ''}`} onClick={() => handleNavigation('/')}>Home </button>                
            </nav>
        </div>
        </>

    );
};

export default Navbar;


