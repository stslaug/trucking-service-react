import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/about';
import Home from './pages/home';
import Login from './pages/login';



function App() {
    const handleNavigation = (route) => {
      
    };
  
    return (
        <Router>
        <Navbar />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Home />} />
        </Routes>
    </Router>
    );
  } export default App;


              