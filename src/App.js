import React, { useContext } from 'react';
import { AuthContext } from './components/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/about';
import Register from './components/Register';
import ForgotPass from './components/ForgotPass'
import VerifyCode from './components/verifyCode';
import ProtectedRoute from './components/ProtectedRoute';
import SponsorDashboard from './pages/sponsorDashboard';
import Catalog from './pages/catalog';
import Cart from './components/Cart';
import AddPoints from './components/AddPoints';
import Orders from './components/orders';
import Login from './pages/login';
import Home from './pages/Home';
import Profile from './pages/profile';
import AdminDashboard from './pages/AdminDashboard';
import Update from './pages/update';
import Checkout from './components/checkout';


function App() {  
    const { user, dbUser,signOut } = useContext(AuthContext);
    return (
        <Router>
        <Navbar user={user} onSignOut={signOut}/>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgot" element={<ForgotPass />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/addpoints" element={<AddPoints />} />

            /* Anything below this is protected. It cannot be accessed unless the user is logged in. */
            <Route path="/profile" element={<ProtectedRoute user={user} target={<Profile />} alternativeContent={<Login />}/>}/>
            <Route path="/catalog" element={<ProtectedRoute user={user} target={<Catalog />} alternativeContent={<Login />} />} />
            <Route path="/sponsor" element={<ProtectedRoute user={user} target={<SponsorDashboard />} alternativeContent={<Login />} />} />
            <Route path="/update" element={<ProtectedRoute user={ user } target={<Update  user={user}/>} alternativeContent={<Login />} />} />
            <Route path="/admin" element={<ProtectedRoute user={ user } target={<AdminDashboard/>} alternativeContent={<Login />} />} />
            <Route path="/checkout" element={<ProtectedRoute user={ user } target={<Checkout  user={user}/>} alternativeContent={<Login />} />} />
            <Route path="/orders" element={<ProtectedRoute user={ user } target={<Orders  user={user}/>} alternativeContent={<Login />} />} />
        </Routes>
    </Router>
    );
  } export default App;


              