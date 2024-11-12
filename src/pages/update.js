import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../pages/css/login.css";
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';



const Update = () => {
    const { update } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [firstN, setFirstN] = useState('');
    const [lastN, setLastN] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [state, setLocState] = useState('');
    
    const navigate = useNavigate();

    // const apiUrl = 'https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/Team12-GetUpdateUsers'; // Replace with your API Gateway URL
    const fullAddress = `${addressLine1}, ${city}, ${state}, ${zip}`;

        // Prepare the data to send
        const userDataUpdate = {
            username,
            firstName: firstN,
            lastName: lastN,
            address: fullAddress,
            phoneNumber
        };


      //   const handleSubmit = async (e) => {
      //     e.preventDefault();
      
      //      try {
      //       // Register user with AWS Cognito
      //       await register(username, password, email, firstN, lastN, phoneNumber, addressLine1, city, zip, state);
      
      //       // If registration is successful, send data to the database through Lambda
      //       const response = await axios.post(apiUrl, userData, {
      //         headers: {
      //           'Content-Type': 'application/json'
      //         }
      //       });
      
      //       console.log("Data sent to Lambda:", response.data);
      //       navigate('/verify');
      //     } catch (error) {
      //       console.error('Registration or Lambda Call Error:', error);
      //       alert('Registration failed. Please try again.');
      //     }
      // };

    return (
    <div className="login-wrapper">
      <div className="login" id="register" >
        <h2>Update</h2>
        <p>Account Information</p>
        <form>
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
                  <input 
                      type="text" 
                      placeholder="Username" 
                      id="username" 
                      onChange={(e) => setUsername(e.target.value)} />
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

            </div>
          </div>

          <div className="after">
                  <button  type="submit">Update Account</button>
          </div> 
          </form>
          
          <div className="accmgmt_lower">
                <Link to="/profile" className="accmgmt_lower_btn">Back to Profile</Link>
          </div>
      </div>
    </div>
  );
};

export default Update;
