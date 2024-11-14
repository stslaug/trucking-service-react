import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../pages/css/login.css";

const Update = () => {
    const [firstN, setFirstN] = useState('');
    const [lastN, setLastN] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [state, setLocState] = useState('');
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('driver'); // Default value
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combine address fields into a single address string
        const address = `${addressLine1}, ${city}, ${state} ${zip}`;

        try {
            const response = await fetch(`https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/Team12-GetUpdateUsers`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    firstN,
                    lastN,
                    phoneNumber,
                    address,
                    userType, // Include userType in the request body
                }),
            });

            if (response.ok) {
                alert("User updated successfully!");
                navigate("/profile"); // Navigate back to profile page
            } else {
                console.error("Failed to update user:", response.statusText);
                alert("Failed to update user information. Please try again.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user information. Please try again.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login" id="register">
                <h2>Update</h2>
                <p>Account Information</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-wrapper">
                        <div className="leftCol">
                            <label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstN}
                                    onChange={(e) => setFirstN(e.target.value)}
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastN}
                                    onChange={(e) => setLastN(e.target.value)}
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </label>
                            <label>
                                <select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                >
                                    <option value="driver">Driver</option>
                                    <option value="sponsor">Sponsor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </label>
                        </div>
                        <div className="rightCol">
                            <label>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    placeholder="Address Line"
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    placeholder="Zipcode"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={state}
                                    onChange={(e) => setLocState(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="after">
                        <button type="submit">Update Account</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;
