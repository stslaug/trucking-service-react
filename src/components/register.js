import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../pages/css/login.css";
import axios from 'axios';
import { AuthContext } from './AuthContext';



const Register = () => {
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstN, setFirstN] = useState('');
    const [lastN, setLastN] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [state, setLocState] = useState('');
    
    const navigate = useNavigate();


    const [passwordRequirementsMet, setPasswordRequirementsMet] = useState({
      minLength: false,
      hasNumber: false,
      hasSpecialChar: false,
      hasUppercase: false,
      hasLowercase: false,
      passwordsMatch: true, // Password is matching when empty...
    });
  
    const handlePasswordChange = (event) => {
      const newPassword = event.target.value;
      setPassword(newPassword);
  
      // Update password requirements state based on new password
      setPasswordRequirementsMet({
        minLength: newPassword.length >= 8,
        hasNumber: /\d/.test(newPassword),
        hasSpecialChar: /[^a-zA-Z0-9\s]/.test(newPassword),
        hasUppercase: /[A-Z]/.test(newPassword),
        hasLowercase: /[a-z]/.test(newPassword),
        passwordsMatch: newPassword === confPassword, // Check for match again
      });
    };
  
    const handleConfirmPasswordChange = (event) => {
      setConfPassword(event.target.value);
      setPasswordRequirementsMet({ ...passwordRequirementsMet, passwordsMatch: password === event.target.value }); // Update passwordsMatch
    };


    const apiUrl = 'https://qcygwj5wwc.execute-api.us-east-1.amazonaws.com/default/team12-createUser'; // Replace with your API Gateway URL
    const fullAddress = `${addressLine1}, ${city}, ${state}, ${zip}`;

        // Prepare the data to send
        const userData = {
            username,
            email,
            firstName: firstN,
            lastName: lastN,
            address: fullAddress,
            phoneNumber
        };


        const handleSubmit = async (e) => {
          e.preventDefault();
          
          // Check if password and confirmation password match
          if (password !== confPassword) {
            alert("Passwords do not match!");
            return;
          }
      
          try {
            // Register user with AWS Cognito
            await register(username, password, email, firstN, lastN, phoneNumber, addressLine1, city, zip, state);
      
            // If registration is successful, send data to the database through Lambda
            const response = await axios.post(apiUrl, userData, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
      
            console.log("Data sent to Lambda:", response.data);
            navigate('/verify');
          } catch (error) {
            console.error('Registration or Lambda Call Error:', error);
            alert('Registration failed. Please try again.');
          }
        };

    return (
    <div className="login-wrapper">
      <div className="login" id="register" >
        <h2>Register</h2>
        <p>Create your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-wrapper">
            <div className="leftCol">
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
                      onChange={handlePasswordChange}
                      />
                </label>
                <label>
                  <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      id="confPassword" 
                      onChange={handleConfirmPasswordChange} />
                </label>
            </div>

            <div className="rightCol">
              <label>
                  <input 
                      type="text" 
                      placeholder="Phone Number" 
                      id="phoneNumber" 
                      onChange={(e) => setPhoneNumber(e.target.value)} />
                </label>
                <label>
                  <input 
                      type="text" 
                      placeholder="Address Line" 
                      id="addressLine1" 
                      onChange={(e) => setAddressLine1(e.target.value)} />
                </label>

                <label>
                      <input type="text" 
                      placeholder="City" 
                      id="city" 
                      onChange={(e) => setCity(e.target.value)} />
                </label>
              
                <div className="equal-fields">
                  <label>
                    <input type="text" 
                    placeholder="Zipcode" 
                    id="zip" 
                    onChange={(e) => setZip(e.target.value)} />
                  </label>

                  <label>
                    <input type="text" 
                    placeholder="State" 
                    id="state" 
                    onChange={(e) => setLocState(e.target.value)} />
                  </label>
                </div>
                
                <ul className="password-requirements">
                    <li className={passwordRequirementsMet.minLength ? 'met' : ''}>
                      Minimum 8 characters
                    </li>
                    <li className={passwordRequirementsMet.hasNumber ? 'met' : ''}>
                      Contains at least 1 number
                    </li>
                    <li className={passwordRequirementsMet.hasSpecialChar ? 'met' : ''}>
                      Contains at least 1 special character
                    </li>
                    <li className={passwordRequirementsMet.hasUppercase ? 'met' : ''}>
                      Contains at least 1 uppercase letter
                    </li>
                    <li className={passwordRequirementsMet.hasLowercase ? 'met' : ''}>
                      Contains at least 1 lowercase letter
                    </li>
                    <li className={passwordRequirementsMet.passwordsMatch ? 'met' : 'not-met'}>
                      Passwords must match
                    </li>
                  </ul>

          
        
            </div>
          </div>

          <div className="after">
                  <button  type="submit">Create Account</button>
          </div> 
          </form>
          
          <div className="accmgmt_lower">
                <Link to="/login" className="accmgmt_lower_btn">Back to Login</Link>
          </div>
      </div>
    </div>
  );
};

export default Register;
