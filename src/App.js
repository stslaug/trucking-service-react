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
import Update from './pages/update'
import { AuthContext } from './components/AuthContext';

import Cart from './pages/cart';
import Addpoints from './pages/addpoints';


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
            <Route path="/addpoints" element={<Addpoints />} />

            /* Anything below this is protected. It cannot be accessed unless the user is logged in. */
            <Route path="/catalog" element={<ProtectedRoute user={user} target={<Catalog />} alternativeContent={<Login />}/>}/>
            <Route path="/profile" element={<ProtectedRoute user={dbUser} target={<Profile />} alternativeContent={<Login />}>  <Profile />  </ProtectedRoute>}/>
            <Route path="/catalog" element={<ProtectedRoute user={user} target={<Catalog />} alternativeContent={<Login />} />} />
            <Route path="/update" element={<ProtectedRoute user={ user } target={<Update  user={user} dbUser={dbUser}/>} alternativeContent={<Login />} />} /> /* Update User Account */
        </Routes>
    </Router>
    );
  } export default App;


              