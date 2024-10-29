import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/about';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPass from './components/forgotPass'
import VerifyCode from './components/verifyCode'
import Catalog from './pages/catalog'
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/profile'
import { AuthContext } from './components/AuthContext';


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
            <Route path="/catalog" element={<ProtectedRoute user={user} alternativeContent={<Login />}>  <Catalog />  </ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute user={user} alternativeContent={<Login />}>  <Profile />  </ProtectedRoute>}/>
            <Route path="/" element={<Home />} />
        </Routes>
    </Router>
    );
  } export default App;


              