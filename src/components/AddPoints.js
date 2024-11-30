import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./css/addpoints.css";

const Addpoints = () => {
    const [username, setUsername] = useState('');
    const [driveruser, setDriveruser] = useState('');
    const [points, setPoints] = useState('');
    const [reason, setReason] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission initiated');

        // Prepare the request body with only the fields that have been changed
        const updatedFields = {};

        if (points.trim() !== '') updatedFields.points = points.trim();

        console.log('Updated Fields:', updatedFields);

        try {
            const response = await fetch(`https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/Team12-UpdateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    driveruser,
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
            <div className="box-wrap">
                <h2>Set a Driver's Point Total</h2>
                <p>Insert a driver's username and positive point total to set a driver's total points</p>
                <form className="form-wrapper" onSubmit={handleSubmit}>
                    <div className="form-wrapper">
                        <div>
                            <label>
                                <input
                                    type="text"
                                    placeholder="Driver name"
                                    value={driveruser}
                                    onChange={(e) => setDriveruser(e.target.value)}
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    placeholder="Set Point Total"
                                    value={points}
                                    onChange={(e) => setPoints(e.target.value)}
                                />
                            </label>
                            </div>
                            <div>
                            <label>
                                <textarea
                                    type="text"
                                    placeholder="Enter Reason for Point Change"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={7}
                                    cols={30}
                                />
                            </label>
                            </div>
                    </div>
                    <div className="after">
                        <button type="submit">Add Points</button>
                    </div>
                </form>
            </div>
    );
};

export default Addpoints;