import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App'; 
import "./css/login.css";


const Login = () => {
    return (
        <div class="login-wrapper">
            <div class="login">
                <h2>Login</h2>
                <p>Log in to access your account</p>
                <form>
                    <label>
                        <input type="email" placeholder="Email" name="email"/>
                    </label>
                    <label>
                        <input type="password" placeholder="Password" name="password"/>
                    </label>
                    <section>
                        <button type="submit">Login</button>
                    </section>
                </form>
            </div>
        </div>
    );
};

export default Login;