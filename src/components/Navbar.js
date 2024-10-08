import React, { useEffect, useState } from 'react';
import './css/Navbar.css'; // Import the CSS file

import { Amplify } from "aws-amplify"
import { signOut } from "aws-amplify/auth"
import outputs from "../amplify_outputs.json"

Amplify.configure(outputs)

export function SignoutButton() {
    async function handleSignOut() {
      await signOut()
    }
  
    return (
      <button className="signout" onClick={handleSignOut}>
        Sign out
      </button>
    )
  }

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
        <nav className="navbar">
            <button className={`button ${activeRoute === '/' ? 'active' : ''}`} onClick={() => handleNavigation('/')} >Home </button>
            <button className={`button ${activeRoute === '/about' ? 'active' : ''}`} onClick={() => handleNavigation('/about')}> About </button>
            <div>
                <SignoutButton/>
            </div>
        </nav>
    );
};

export default Navbar;


