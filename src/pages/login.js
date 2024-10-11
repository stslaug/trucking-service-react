import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import "./css/login.css";
import AuthContext from '../components/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await login(username, password);
        window.location.href = '/';
      } catch (error) {
        console.error('Login error:', error);
      }
    };


    return (
        <div className="login-wrapper">
            <div className="login">
                <h2>Login</h2>
                <p>Log in to access your account</p>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input type="text" 
                        placeholder="Username or Email" 
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}/>
                    </label>
                    <label>
                        <input type="password" 
                        placeholder="Password" 
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}/>
                    </label>
                    <section>
                        <button type="submit">Login</button>
                    </section>
                </form>
                    <div className="createAccount">
                        <Link to="/forgot" className="btn btn-primary create">Forgot Password</Link>
                        <Link to="/register" className="btn btn-primary create">Create New Account</Link>
                    </div>
            </div>
        </div>
    );
};

export default Login;