import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../components/AuthContext';

import './css/profile.css';
import edit from './css/images/edit.png';
import points from './css/images/points.png';



const Profile = () => {
  const { username, dbUser, fetchUserProfile } = useContext(AuthContext);
  const [refresh, setRefresh] = useState(true);
  const [sponsorIdInput, setSponsorIdInput] = useState('');
  useEffect(() => {
    if (username && refresh) {
      fetchUserProfile(username); // Only call if username exists
      setRefresh(false);
    }
  }, [username, fetchUserProfile, refresh]);

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
    driver,
  } = dbUser;
  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }


  const handleAddSponsor = async () => {
    if (!sponsorIdInput) {
        console.log("sponsorID not inputed. Can't Complete Request");
      return;
    }
  
    try {
      // Call the Lambda function
      const response = await fetch('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-updateDriverSponsors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          sponsorId: sponsorIdInput,
          driverUsername: username,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Sponsor added successfully.');
        // Refresh the user profile to show the updated sponsor list
        fetchUserProfile(username);
        setSponsorIdInput('');
      } else {
        console.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding sponsor:', error);

    }
  };

  const handleRemoveSponsor = async (id) => {
    if (!id) {
      console.log("Sponsor ID not provided. Cannot complete request.");
      return;
    }
  
    try {
      // Call the Lambda function
      const response = await fetch('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-updateDriverSponsors', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'remove',
          sponsorId: id,
          driverUsername: username,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Sponsor relationship set to INACTIVE successfully.');
        // Refresh the user profile to show the updated sponsor list
        fetchUserProfile(username);
      } else {
        console.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error removing sponsor:', error);
    }
  };
  

  
  let subtypeInfo = null;
  switch (userType.toLowerCase()) {
    case 'driver':
        subtypeInfo = (
          <>
            <div className='bio-row'>
              <span className='label'>Point Balance:</span>
              <span className='value'>{driver.pointTotal || 0}</span>
            </div>
            <div className='bio-row'>
                <div className="list-wrapper">
                    <span className='label'>Sponsors:</span>
                    <span className='value'>
                    {driver.sponsors && driver.sponsors?.length > 0 ? (
                    <ul className="list">
                        {driver.sponsors.map((sponsor) => (
                        <li id="sponsors" key={sponsor.sponsorId}> {sponsor.companyName} | ID : {sponsor.sponsorId} 
                        <button className="removeSponsor" onClick={() => handleRemoveSponsor(sponsor.sponsorId)}>Remove Sponsor</button></li>
                        ))}
                    </ul>
                    ) : (
                    'No sponsors associated.'
                    )}
                    </span>
                </div>

                    <form
                    className="addSponsor-wrapper"
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent default form submission behavior
                        handleAddSponsor(); // Call the handler
                    }}
                    >
                        <span>Add Sponsor by Sponsor ID</span>
                        <input className="addSponsorInput"
                            value={sponsorIdInput}
                            onChange={(e) => setSponsorIdInput(e.target.value)} // Update state with input value
                            placeholder="Sponsor ID"
                        />
                        <button className="removeUser-button" type="submit">Add Sponsor</button>
                    </form>
            </div>
            {/* Add Sponsor Input and Button */}
            {/* <div className='bio-row'>
              <span className='label'>Add Sponsor:</span>
              <span className='value'>
                <input
                  type='text'
                  placeholder='Enter Sponsor ID'
                  value={sponsorIdInput}
                  onChange={(e) => setSponsorIdInput(e.target.value)}
                />
                <button onClick={handleAddSponsor}>Add Sponsor</button>
              </span>
            </div> */}
          </>
        );
        break;          case 'sponsor':
      subtypeInfo = (
        <>
          <div className='bio-row'>
            <span className='label'>Company Name:</span>
            <span className='value'>{dbUser.sponsor.companyName || 'N/A'}</span>
          </div>
        </>
      );
      break;
    case 'admin':
      subtypeInfo = (
        <div className='bio-row'>
          <span className='label'>Permissions:</span>
          <span className='value'>{dbUser.permissions || 'N/A'}</span>
        </div>
      );
      break;
    case 'dev':
      subtypeInfo = (
        <>
          <div className='bio-row'>
            <span className='label'>Description:</span>
            <span className='value'>{dbUser.description || 'N/A'}</span>
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
            <span className='label'>User ID:</span>
            <span className='value'>{dbUser.userId}</span>
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
              {address?.street || 'N/A'}, {address?.city || 'N/A'}, {address?.state || 'N/A'} {address?.zipCode || 'N/A'}, {address?.country || 'N/A'}
            </span>
            <div className="line"></div>
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

            <div className='bio-row'>
                <span className='label'>Date Created:</span>
                <span className='value'>{dbUser.timeCreated || 'N/A'}</span>
            </div>
        </section>
      </section>
    </div>
  );
};



export default Profile;
