import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/about';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPass from './components/forgotPass'



function App() {  
    return (
        <Router>
        <Navbar />
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route exact path="/forgot" element={<ForgotPass />} />
            <Route path="/" element={<Home />} />
        </Routes>
    </Router>
    );
  } export default App;


              