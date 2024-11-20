// Filename: Update.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../pages/css/login.css";

const Update = ({ user }) => {
    const [firstN, setFirstN] = useState('');
    const [lastN, setLastN] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [state, setLocState] = useState('');
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState('driver'); // Default value
    const [company, setCompany] = useState(''); // Added for sponsors
    const [permissions, setPermissions] = useState(''); // Added for admin role
    const navigate = useNavigate();

    // Populate initial values from the user object
    useEffect(() => {
        if (user) {
            console.log('Populating user data:', user);
            setUsername(user.getUsername());
            setFirstN(user.firstName || '');
            setLastN(user.lastName || '');
            setPhoneNumber(user.phoneNumber || '');
            setAddressLine1(user.addressLine1 || '');
            setCity(user.city || '');
            setLocState(user.state || '');
            setZip(user.zip || '');
            setUserType(user.userType ? user.userType.toLowerCase() : 'driver');
            setCompany(user.company || ''); // Assuming 'company' is a field in user
            setPermissions(user.permissions || ''); // Assuming 'permissions' is a field in user
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission initiated');

        // Prepare the request body with only the fields that have been changed
        const updatedFields = {};

        if (firstN.trim() !== '') updatedFields.firstN = firstN.trim();
        if (lastN.trim() !== '') updatedFields.lastN = lastN.trim();
        if (phoneNumber.trim() !== '') updatedFields.phoneNumber = phoneNumber.trim();
        if (addressLine1.trim() !== '') updatedFields.addressLine1 = addressLine1.trim();
        if (city.trim() !== '') updatedFields.city = city.trim();
        if (state.trim() !== '') updatedFields.state = state.trim();
        if (zip.trim() !== '') updatedFields.zip = zip.trim();
        if (userType.trim() !== '') updatedFields.userType = userType.trim().toLowerCase();
        
        // Include company if userType is sponsor
        if (userType.trim().toLowerCase() === 'sponsor' && company.trim() !== '') {
            updatedFields.company = company.trim();
        }

        // Include permissions if userType is admin
        if (userType.trim().toLowerCase() === 'admin' && permissions.trim() !== '') {
            updatedFields.permissions = permissions.trim();
        }

        console.log('Updated Fields:', updatedFields);

        try {
            const response = await fetch(`https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/Team12-UpdateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    ...updatedFields,
                }),
            });

            console.log('Fetch Response Status:', response.status);

            const responseData = await response.json(); // Read the response body once

            console.log('Fetch Response Body:', responseData);

            if (response.ok) {
                alert("User updated successfully!");
                navigate("/profile"); // Navigate back to profile page
            } else {
                console.error("Failed to update user:", responseData.message);
                alert(`Failed to update user information: ${responseData.message}`);
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
                                <select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                >
                                    <option value="driver">Driver</option>
                                    <option value="sponsor">Sponsor</option>
                                    <option value="admin">Admin</option>
                                    <option value="dev">Dev</option>
                                </select>
                            </label>
                            {userType === 'sponsor' && (
                                <label>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                    />
                                </label>
                            )}
                            {userType === 'admin' && (
                                <label>
                                    <input
                                        type="text"
                                        placeholder="Permissions"
                                        value={permissions}
                                        onChange={(e) => setPermissions(e.target.value)}
                                    />
                                </label>
                            )}
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