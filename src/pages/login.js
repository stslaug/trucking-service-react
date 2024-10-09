import React from 'react';
import { Link } from "react-router-dom";
import "./css/login.css";


const Login = () => {
    return (
        <div class="login-wrapper">
            <div class="login">
                <h2>Login</h2>
                <p>Log in to access your account</p>
                <form>
                    <label>
                        <input type="email" placeholder="Email" id="email"/>
                    </label>
                    <label>
                        <input type="password" placeholder="Password" id="password"/>
                    </label>
                    <section>
                        <button type="submit">Login</button>
                    </section>
                </form>
                    <div class="createAccount">
                        <Link to="/forgot" className="btn btn-primary create">Forgot Password</Link>
                        <Link to="/register" className="btn btn-primary create">Create New Account</Link>
                    </div>
            </div>
        </div>
    );
};

export default Login;