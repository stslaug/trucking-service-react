import React from 'react';
import "./css/login.css";


const Register = () => {
    return (
        <div class="login-wrapper">
            <div class="login">
                <h2>Register</h2>
                <p>Create your account</p>
                <form>
                    <label>
                        <input type="text" placeholder="First Name" id="firstName"/>
                    </label>
                    <label>
                        <input type="text" placeholder="Last Name" id="lastName"/>
                    </label>
                    <label>
                        <input type="email" placeholder="Email" id="email"/>
                    </label>
                    <label>
                        <input type="password" placeholder="Password" id="password"/>
                    </label>
                    <label>
                        <input type="password" placeholder="Confirm Password" id="confPassword"/>
                    </label>
                
                    <label>
                        <div class= "container">
                            <div class="select">
                                <select>
                                <option value="0">Select your role:</option>
                                    <option value="1">Driver</option>
                                    <option value="2">Sponsor</option>
                                    <option value="3">Admin</option>
                                </select>
                            </div>
                        </div> 
                    </label>

                    <label>
                        <input type="password" placeholder="Access Key" id="accesskey"/>
                    </label>


                    <section>
                        <button type="submit">Create Account</button>
                    </section>
                        
                </form>
            </div>
        </div>
    );
};










export default Register;