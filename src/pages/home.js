import React, { useEffect, useState, useContext } from 'react';
import "./css/general.css"
import "./css/home.css"
import sponsorAWS from "./css/images/amazon.png"
import sponsorEbay from "./css/images/EBay.png"
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';


const Home = () => {
    const [activeRoute, setActiveRoute] = useState('/');
    const { user } = useContext(AuthContext);

    const handleNavigation = (route) => {
        window.location.href = route;
        setActiveRoute(route); // Update the active route
        console.log(`Navigating to ${route}`); 
    };

    const aboutClick = () => {
        //Go to about Page
        handleNavigation('/about')
    };

    const sponsorClick = () => {
        //Go to Sponsors page (to be added)
    };

    const handleAuthButton = () => {
        if (!user) {
            handleNavigation('/login');
        } else {
            handleNavigation('/profile');
        }
    };

    return (
        <div className="home-container">

            <header>
                <h1 style={{color:'white'}}>Welcome to Truck Driver Incentive Program!</h1>
                <p style={{color:'white'}}>CPSC 4910 | Team 10 | Fall 2024</p>
            </header>
            <main>
                <p className="home-description">The Truck Driver Incentive Program is a program by Haul of Fame that looks to reward good truck driving! Simply get rewards by driving save and effectively! You can use the below buttons or the naviagtion bar at the top to naviagte the website. You can check out our About Page, see our listed Sponsors, go to our Login page, or even just get help if you have any questions!</p>
            </main>

            <div className='home-button-section'>
                <button type="button" className='home-button' onClick={aboutClick}>
                    About Page</button>
                <button type="button" className='home-button' onClick={sponsorClick}>
                    Sponsor List</button>
                <button type="button" className='home-button' onClick={handleAuthButton}>
                    {user ? 'Profile' : 'Login'}
                </button>
            </div>

            <section className='sponsor-image-container'>
                Sponsors:
                <div className='sponsor-images-section'>
                    <img src={sponsorAWS} alt='Amazon Image' width='225'></img>
                    <img src={sponsorEbay} alt='E-bay Image' width='225'></img>
                </div>
            </section>

        </div>
    );
};

export default Home;