import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/about';
import Home from './pages/home';

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';


function App() {
    const handleNavigation = (route) => {
      
    };
  
    return (
    <div>
        <Router>
        <Navbar />
        <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
        </Routes>
        </Router>
    </div>
    );
  } export default App;


              