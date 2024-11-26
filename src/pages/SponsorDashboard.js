import React, { useEffect, useState, useContext } from 'react';
import "./css/general.css";
import "./css/sponsor.css";
import Addpoints from './addpoints';
import { AuthContext } from '../components/AuthContext';

const Sponsor = () => {
    const { username, dbUser, fetchUserProfile } = useContext(AuthContext);
    const [refresh, setRefresh] = useState(true);
    const [allDrivers, setAllDrivers] = useState([]); // State to store all drivers
    const [loading, setLoading] = useState(true); // State to manage loading
    const [driverIdInput, setDriverIdInput] = useState('');
    const [sponsorIdInput, setSponsorIdInput] = useState('');

    useEffect(() => {
        if (username && refresh) {
            fetchUserProfile(username); // Fetch user profile data
            setRefresh(false);
        }
    }, [username, fetchUserProfile, refresh]);

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
      
      const handleAddDriver = async () => {
        if (!driverIdInput) {
          console.log("Driver ID not inputted. Can't Complete Request");
          return;
        }
      
        try {
          const response = await fetch('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-updateDriverSponsors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'add',
              sponsorUsername: username,
              driverId: driverIdInput,
            }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            console.log('Driver added successfully.');
            fetchUserProfile(username);
            setDriverIdInput('');
          } else {
            console.error(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error('Error adding driver:', error);
        }
      };

      const handleAddDriverbyId = async (id) => {
        if (!id) {
          console.log("Driver ID not inputted. Can't Complete Request");
          return;
        }
      
        try {
          const response = await fetch('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-updateDriverSponsors', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'add',
              sponsorUsername: username,
              driverId: id,
            }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            console.log('Driver added successfully.');
            fetchUserProfile(username);
            setDriverIdInput('');
          } else {
            console.error(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error('Error adding driver:', error);
        }
      };
    const handleRemoveDriver = async (id) => {
        if (!id) {
          console.log("Driver ID not provided. Cannot complete request.");
          return;
        }
      
        try {
          const response = await fetch('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-updateDriverSponsors', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'remove',
              sponsorUsername: username,
              driverId: id,
            }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            console.log('Driver relationship set to INACTIVE successfully.');
            fetchUserProfile(username);
          } else {
            console.error(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error('Error removing driver:', error);
        }
      };

      useEffect(() => {
        // Check if dbUser is available
        if (!dbUser || !dbUser.userId) {
            return; // Exit early if dbUser is not available
        }
    
        const fetchAllDrivers = async () => {
            try {
                const response = await fetch(`https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-getUsers/drivers?sponsorId=${dbUser.userId}`);
        
                const data = await response.json();
                console.log("Fetching Drivers: ", data);
                if (data && data.drivers) {
                    // Filter out drivers who are already associated with the current sponsor
                    const filteredDrivers = data.drivers.filter(driver => {
                        // Check if driver.driver.sponsors contains dbUser.userId
                        if (driver.driver && driver.driver.sponsors) {
                            // If any sponsor in the driver's sponsors array has the sponsorId equal to dbUser.userId, exclude this driver
                            return !driver.driver.sponsors.some(sponsor => sponsor.sponsorId === dbUser.userId);
                        }
                        // Include the driver if they have no sponsors or no driver data
                        return true;
                    });
        
                    setAllDrivers(filteredDrivers);
                } else {
                    setAllDrivers([]);
                }
            } catch (error) {
                console.error('Error fetching all drivers:', error);
                setAllDrivers([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchAllDrivers();
    }, [dbUser]); // Add dbUser to the dependency array
    
    

    if (!dbUser) return <div>No user data available.</div>;

    return (
        <div className="sponsor-container">
            {/* Existing Drivers Section */}
            <div className="drivers">
                <span className="drivers-title">Your Drivers:</span>
                <span className="drivers-list-container">
                    {dbUser.sponsor.drivers && dbUser.sponsor.drivers.length > 0 ? (
                        <div className="scroll-container">
                            <ul className="drivers-list">
                                {dbUser.sponsor.drivers.map((driver, index) => (
                                    <li
                                        className={`driver-item ${index % 2 === 0 ? 'light' : 'dark'}`}
                                        key={driver.driverId}
                                    >
                                        <span className="driver-name">{driver.firstName} {driver.lastName}</span>
                                        <span className="text">Username: {driver.username}</span>
                                        <span className="text">ID: {driver.driverId}</span>
                                        <span className="text">Phone Number: {driver.phoneNumber}</span>
                                        <span className="text">Email: {driver.email}</span>
                                        <span className="text">Points: {driver.pointTotal}</span>
                                        <div>
                                            <input placeholder='Points'></input>
                                            <button>Add Points</button>
                                            <button>Remove Points</button>
                                            <button onClick={() => handleRemoveDriver(driver.driverId)}>Remove Driver</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="no-drivers">No drivers associated.</div>
                    )}
                </span>
            </div>

            {/* New All Drivers Section */}
            <div className="drivers">
                <span className="drivers-title">All Drivers:</span>
                <span className="drivers-list-container">
                    {loading ? (
                        <div>Loading all drivers...</div>
                    ) : allDrivers && allDrivers.length > 0 ? (
                        <div className="scroll-container">
                            <ul className="drivers-list">
                                {allDrivers.map((driver, index) => (
                                    <li
                                        className={`driver-item ${index % 2 === 0 ? 'light' : 'dark'}`}
                                        key={driver.userId}
                                    >
                                        <span className="driver-name">{driver.firstName} {driver.lastName}</span>
                                        <span className="text">Username: {driver.username}</span>
                                        <span className="text">ID: {driver.userId}</span>
                                        <span className="text">Points: {driver.driver.pointTotal}</span>
                                        {driver.driver.sponsors && driver.driver.sponsors.length > 0 && (
                                            <span className="driver-sponsors">
                                                Sponsors: {driver.driver.sponsors.map(s => s.companyName).join(', ')}
                                            </span>
                                        )}
                                        <button onClick={() => handleAddDriverbyId(driver.userId)}>Add Driver</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="no-drivers">No drivers found.</div>
                    )}
                </span>
            </div>
        </div>
    );
};

export default Sponsor;
