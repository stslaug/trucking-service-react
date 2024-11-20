import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../components/AuthContext';
import './css/profile.css';
import edit from './css/images/edit.png';
import points from './css/images/points.png';

const Profile = () => {
    const { username } = useContext(AuthContext); // Access username from AuthContext
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!username) {
                setLoading(false);
                setError("Username not found in context.");
                return;
            }

            try {
                // Fetch user profile data from API Gateway
                const response = await fetch(`https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-getUsers?username=${username}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json' // Specify expected response format
                        // Removed 'Content-Type' header to avoid triggering preflight requests
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Determine how to extract user data based on the response structure
                    let parsedData = null;
                    if (data.body) {
                        // If response has a 'body' field, parse it
                        try {
                            parsedData = JSON.parse(data.body).user;
                            console.log("Fetched user data from body:", parsedData);
                        } catch (parseError) {
                            console.error("Error parsing response body:", parseError);
                            setError("Invalid response format from server.");
                            setLoading(false);
                            return;
                        }
                    } else if (data.user) {
                        // If response directly has a 'user' field, use it
                        parsedData = data.user;
                        console.log("Fetched user data directly:", parsedData);
                    } else {
                        // Unexpected response structure
                        console.error("Unexpected response structure:", data);
                        setError("Unexpected response format from server.");
                        setLoading(false);
                        return;
                    }

                    setProfileData(parsedData); // Set the fetched data to state
                } else {
                    // Attempt to parse error message from response
                    let errorMessage = `Failed to fetch user profile: ${response.status} ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        if (errorData.message) {
                            errorMessage = `Error: ${errorData.message}`;
                        }
                    } catch (parseError) {
                        console.error("Error parsing error response:", parseError);
                    }
                    setError(errorMessage);
                    console.error(errorMessage);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setError("An unexpected error occurred while fetching user data.");
            } finally {
                setLoading(false); // Update loading state
            }
        };

        fetchUserProfile();
    }, [username]); // Dependency on username, so it fetches data when username is available

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profileData) return <div>No user data available.</div>;

    // Destructure the user data
    const {
        firstName,
        lastName,
        userType,
        username: userUsername,
        email,
        phoneNumber,
        address,
        sponsor,
        driver,
        admin,
        dev
    } = profileData;

    // Determine additional subtype information based on USER_TYPE
    let subtypeInfo = null;
    switch (userType.toLowerCase()) {
        case 'driver':
            subtypeInfo = (
                <div className='info-row'>
                    <span className='label'>POINT TOTAL:</span>
                    <span className='value'>{driver?.pointTotal || 0}</span>
                </div>
            );
            break;
        case 'sponsor':
            subtypeInfo = (
                <>
                    <div className='info-row'>
                        <span className='label'>COMPANY NAME:</span>
                        <span className='value'>{sponsor?.companyName || 'N/A'}</span>
                    </div>
                    <div className='line-break'></div>
                </>
            );
            break;
        case 'admin':
            subtypeInfo = (
                <div className='info-row'>
                    <span className='label'>PERMISSIONS:</span>
                    <span className='value'>{admin?.permissions || 'N/A'}</span>
                </div>
            );
            break;
        case 'dev':
            subtypeInfo = (
                <>
                    <div className='info-row'>
                        <span className='label'>FIRST NAME:</span>
                        <span className='value'>{dev?.firstName || 'N/A'}</span>
                    </div>
                    <div className='line-break'></div>
                    <div className='info-row'>
                        <span className='label'>LAST NAME:</span>
                        <span className='value'>{dev?.lastName || 'N/A'}</span>
                    </div>
                    <div className='line-break'></div>
                    <div className='info-row'>
                        <span className='label'>DESCRIPTION:</span>
                        <span className='value'>{dev?.description || 'N/A'}</span>
                    </div>
                </>
            );
            break;
        default:
            subtypeInfo = null;
    }

    return (
        <div className="profile-container">
            <div className='welcome-text'>
                Welcome, {firstName || "User"}
            </div>
            <section className='bio-box'>
                <section className='bio-box-title'>
                    User Information:
                </section>
                <section className='bio-box-text'>
                    <div className='info-row'>
                        <span className='label'>USER TYPE:</span>
                        <span className='value'>{userType}</span>
                    </div>
                    <div className='line-break'></div>

                    <div className='info-row'>
                        <span className='label'>USERNAME:</span>
                        <span className='value'>{userUsername}</span>
                    </div>
                    <div className='line-break'></div>
                   
                    <div className='info-row'>
                        <span className='label'>EMAIL:</span>
                        <span className='value'>{email}</span>
                    </div>
                    <div className='line-break'></div>

                    <div className='info-row'>
                        <span className='label'>PHONE NUMBER:</span>
                        <span className='value'>{phoneNumber || 'N/A'}</span>
                    </div>
                    <div className='line-break'></div>

                    <div className='info-row'>
                        <span className='label'>ADDRESS:</span>
                        <span className='value'>
                            {address.street || 'N/A'}, {address.city || 'N/A'}, {address.state || 'N/A'} {address.zipCode || 'N/A'}, {address.country || 'N/A'}
                        </span>
                    </div>
                    <div className='line-break'></div>

                    {/* Display Subtype-Specific Information */}
                    {subtypeInfo}
                </section>
            </section>
            <section className='options-box'>
                <section className='options-box-title'>
                    OPTIONS
                </section>
                <section className='options-box-info'>
                    <img className='bio-box-pencil' src={edit} alt='Edit Icon' width='25' />
                    <Link to="/update">Update User Information</Link>
                    <div className='line-break'></div>

                    {userType === 'sponsor' && (
                    <>
                        <img className='bio-box-pencil' src={points} alt='Point Icon' width='25' />
                        <Link to="/addpoints">Add Points to Drivers</Link>
                        <div className='line-break'></div>
                    </>
                    )}
                </section>
            </section>
        </div>
    );
};

export default Profile;
