import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./css/login.css";
import { AuthContext } from '../components/AuthContext';



const Register = () => {
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstN, setFirstN] = useState('');
    const [lastN, setLastN] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if password and confirmation password match
        if (password !== confPassword) {
          alert("Passwords do not match!");
          return;
        }
    
        try {
          await register(username, password, email);
          navigate('/verify', { state: { username, password } });
        } catch (error) {
          console.error('Registration error:', error);
        }
      };

    return (
    <div className="login-wrapper">
      <div className="login">
        <h2>Register</h2>
        <p>Create your account</p>
        <form onSubmit={handleSubmit}>
          <label>
            <input 
                type="text" 
                placeholder="First Name" 
                id="firstName" 
                onChange={(e) => setFirstN(e.target.value)} />
          </label>

          <label>
            <input 
                type="text" 
                placeholder="Last Name" 
                id="lastName" 
                onChange={(e) => setLastN(e.target.value)} />
          </label>

          <label>
                <input type="email" 
                placeholder="Email" 
                id="email" 
                onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            <input 
                type="text" 
                placeholder="Username" 
                id="username" 
                onChange={(e) => setUsername(e.target.value)} />
          </label>


          <label>
          <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
          </label>
          <label>
            <input 
                type="password" 
                placeholder="Confirm Password" 
                id="confPassword" 
                onChange={(e) => setConfPassword(e.target.value)} />
          </label>

          <label>
            <div className="container">
              <div className="select">
                <select onChange={(e) => setRole(e.target.value)}>
                  <option value="0">Select your role:</option>
                  <option value="Driver">Driver</option>
                  <option value="Sponsor">Sponsor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          </label>

        

          <section>
            <button type="submit">Create Account</button>
          </section>
          <div className="createAccount">
            <Link to="/login" className="btn btn-primary create">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
