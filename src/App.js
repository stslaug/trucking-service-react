import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/about';
import Home from './pages/home';
import Login from './pages/login';
import Register from './components/register';
import ForgotPass from './components/forgotPass'
import VerifyCode from './components/verifyCode'
import Catalog from './pages/catalog'
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/profile'
import { AuthContext } from './components/AuthContext';
import ItemDetails from './components/itemDetails';
import Cart from './pages/cart';


function App() {  
    const { user, signOut } = useContext(AuthContext);
    return (
        <Router>
        <Navbar user={user} onSignOut={signOut}/>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgot" element={<ForgotPass />} />
            <Route path="/catalog" element={<ProtectedRoute user={user} target={<Catalog />} alternativeContent={<Login />}/>}/>
            <Route path="/profile" element={<ProtectedRoute user={user} target={<Profile />} alternativeContent={<Login />}>  <Profile />  </ProtectedRoute>}/>
            <Route path="/catalog" element={<ProtectedRoute user={user} target={<Catalog />} alternativeContent={<Login />} />} />
            <Route path="/item/:itemId" element={<ProtectedRoute user={user} target={<ItemDetails />} alternativeContent={<Login />} />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
        </Routes>
    </Router>
    );
  } export default App;


              