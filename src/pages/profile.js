import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../components/AuthContext';
import './css/profile.css';
import edit from './css/images/edit.png';
import points from './css/images/points.png';

const Profile = ( ) => {
    const { username } = useContext(AuthContext); // Access username from AuthContext
    const { dbUser } = useContext(AuthContext);

    if (!dbUser) return <div>No user data available.</div>;
 

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
    } = dbUser;

    function titleCase(string){
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
      }

    // Determine additional subtype information based on USER_TYPE
    let subtypeInfo = null;
    switch (userType.toLowerCase()) {
        case 'driver':
            subtypeInfo = (
                <div className='bio-row'>
                    <span className='label'>Point Balance:</span>
                    <span className='value'>{driver?.pointTotal || 0}</span>
                </div>
            );
            break;
        case 'sponsor':
            subtypeInfo = (
                <>
                    <div className='bio-row'>
                        <span className='label'>Company Name:</span>
                        <span className='value'>{sponsor?.companyName || 'N/A'}</span>
                    </div>
                </>
            );
            break;
        case 'admin':
            subtypeInfo = (
                <div className='bio-row'>
                    <span className='label'>Permissions:</span>
                    <span className='value'>{admin?.permissions || 'N/A'}</span>
                </div>
            );
            break;
        case 'dev':
            subtypeInfo = (
                <>

                    <div className='bio-row'>
                        <span className='label'>Description:</span>
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
                    <div className='bio-row'>
                        <span className='label'>First Name:</span>
                        <span className='value'>{firstName || 'N/A'}</span>
                    </div>

                    <div className='bio-row'>
                        <span className='label'>Last Name:</span>
                        <span className='value'>{lastName || 'N/A'}</span>
                    </div>
                    <div className='bio-row'>
                        <span className='label'>User Type:</span>
                        <span className='value'>{titleCase(userType)}</span>
                    </div>


                    <div className='bio-row'>
                        <span className='label'>Username:</span>
                        <span className='value'>{userUsername}</span>
                    </div>

                   
                    <div className='bio-row'>
                        <span className='label'>Email:</span>
                        <span className='value'>{email}</span>
                    </div>


                    <div className='bio-row'>
                        <span className='label'>Phone Number:</span>
                        <span className='value'>{phoneNumber || 'N/A'}</span>
                    </div>


                    <div className='bio-row'>
                        <span className='label'>Address:</span>
                        <span className='value'>
                            {address.street || 'N/A'}, {address.city || 'N/A'}, {address.state || 'N/A'} {address.zipCode || 'N/A'}, {address.country || 'N/A'}
                        </span>
                    </div>


                    {/* Display Subtype-Specific Information */}
                    {subtypeInfo}
                </section>
            </section>
            <section className='bio-box' id="options">
                <section className='bio-box-title'>
                    Options
                </section>
                <section className='bio-box-text' id="options-text">
                    <div className='bio-row'>
                    <img className='bio-box-pencil' src={edit} alt='Edit Icon' width='25' />
                    <Link to="/update">Update User Information</Link>
                    </div>

                    {userType.toLowerCase() === 'sponsor' && (
                        <div className='bio-row'>
                            <img className='bio-box-pencil' src={points} alt='Point Icon' width='25' />
                            <Link to="/addpoints">Add Points to Drivers</Link>
                        </div>
                    )}
                </section>
            </section>
        </div>
    );
};

export default Profile;
