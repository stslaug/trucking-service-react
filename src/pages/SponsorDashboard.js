import React, { useEffect, useState, useContext } from 'react';
import "./css/general.css";
import "./css/sponsor.css";
import { AuthContext } from '../components/AuthContext';

const Sponsor = () => {
    const { username, dbUser, fetchUserProfile } = useContext(AuthContext);
    const [refresh, setRefresh] = useState(true);
    const [allDrivers, setAllDrivers] = useState([]); // State to store all drivers
    const [loading, setLoading] = useState(true); // State to manage loading
    const [driverIdInput, setDriverIdInput] = useState('');
    const [sponsorIdInput, setSponsorIdInput] = useState('');
    const [point, setPointChange] = useState('');

    // Function to handle adding or removing points
    const handlePointChange = async (t_driverId, operation) => {
        if (!point || !t_driverId) {
            console.error("Points or Driver ID missing.");
            return;
        }

        // Parse the point input to an integer
        let pointValue = parseInt(point, 10);
        if (isNaN(pointValue)) {
            console.error("Invalid point value:", point);
            return;
        }

        // Determine if points should be added or subtracted
        let pointChangeValue = pointValue;
        if (operation === 'subtract') {
            pointChangeValue = -pointValue; // Make it negative for subtraction
        }

        const updatePointsPayload = {
            driverId: t_driverId,
            pointChange: pointChangeValue,
        };

        console.log(`Updating driver ${updatePointsPayload.driverId}'s points by ${updatePointsPayload.pointChange}`);

        try {
            const updatePointsResponse = await fetch(
                'https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-UpdatePoints',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatePointsPayload),
                }
            );

            const updatePointsData = await updatePointsResponse.json();
            console.log('Update Points Lambda response:', updatePointsData);

            if (updatePointsResponse.ok) {
                // Refresh the user profile to reflect updated points
                fetchUserProfile(username);
                setPointChange(''); // Clear the input field
            } else {
                console.error(`Error updating points: ${updatePointsData.message}`);
            }
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    // Fetch user profile on component mount
    useEffect(() => {
        if (username && refresh) {
            fetchUserProfile(username); // Fetch user profile data
            setRefresh(false);
        }
    }, [username, fetchUserProfile, refresh]);

    // Function to add a sponsor
    const handleAddSponsor = async () => {
        if (!sponsorIdInput) {
            console.log("Sponsor ID not inputted. Can't complete request.");
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
                    sponsorId: sponsorIdInput,
                    driverUsername: username,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Sponsor added successfully.');
                fetchUserProfile(username); // Refresh user profile
                setSponsorIdInput(''); // Clear input field
            } else {
                console.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding sponsor:', error);
        }
    };

    // Function to remove a sponsor
    const handleRemoveSponsor = async (id) => {
        if (!id) {
            console.log("Sponsor ID not provided. Cannot complete request.");
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
                    sponsorId: id,
                    driverUsername: username,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Sponsor relationship set to INACTIVE successfully.');
                fetchUserProfile(username); // Refresh user profile
            } else {
                console.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error removing sponsor:', error);
        }
    };

    // Function to add a driver
    const handleAddDriver = async () => {
        if (!driverIdInput) {
            console.log("Driver ID not inputted. Can't complete request.");
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
                fetchUserProfile(username); // Refresh user profile
                setDriverIdInput(''); // Clear input field
            } else {
                console.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding driver:', error);
        }
    };

    // Function to add a driver by ID (duplicate of handleAddDriver, can be consolidated)
    const handleAddDriverbyId = async (id) => {
        if (!id) {
            console.log("Driver ID not inputted. Can't complete request.");
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
                fetchUserProfile(username); // Refresh user profile
                setDriverIdInput(''); // Clear input field
            } else {
                console.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding driver:', error);
        }
    };

    // Function to remove a driver
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
                fetchUserProfile(username); // Refresh user profile
            } else {
                console.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error removing driver:', error);
        }
    };

    // Fetch all available drivers not associated with the sponsor
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
            {/* Your Drivers Section */}
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
                                            <input
                                                type="number"
                                                onChange={(e) => setPointChange(e.target.value)}
                                                placeholder='Points'
                                            />
                                            <button onClick={() => handlePointChange(driver.driverId, 'add')}>Add Points</button>
                                            <button onClick={() => handlePointChange(driver.driverId, 'subtract')}>Remove Points</button>
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

            {/* All Drivers Section */}
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
