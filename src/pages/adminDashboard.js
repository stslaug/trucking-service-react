import React, { useEffect, useState, useContext } from 'react';
import "./css/general.css";
import "./css/admin.css";
import Addpoints from '../components/AddPoints';
import { AuthContext } from '../components/AuthContext';

const Admin = () => {
    const { username, dbUser, fetchUserProfile } = useContext(AuthContext);

    const handleACTION = () => {
        // Placeholder function that returns nothing
    };

    const [sponsors, setSponsors] = useState([
        {
            id: 1,
            companyName: 'Sponsor1',
            drivers: null, // Drivers will be loaded when dropdown is clicked
        },
        {
            id: 2,
            companyName: 'Sponsor2',
            drivers: null,
        },
    ]);

    // State to manage editing sponsor names and driver visibility
    const [sponsorStates, setSponsorStates] = useState({});

    useEffect(() => {
        // Initialize sponsorStates
        const initialStates = {};
        sponsors.forEach(sponsor => {
            initialStates[sponsor.id] = {
                isEditingName: false,
                editedName: sponsor.companyName,
                isDriversVisible: false,
                isLoadingDrivers: false,
            };
        });
        setSponsorStates(initialStates);
    }, [sponsors]);

    const handleEditSponsorName = (sponsorId) => {
        setSponsorStates(prevState => ({
            ...prevState,
            [sponsorId]: {
                ...prevState[sponsorId],
                isEditingName: !prevState[sponsorId].isEditingName,
            },
        }));
    };

    const handleSponsorNameChange = (sponsorId, newName) => {
        setSponsorStates(prevState => ({
            ...prevState,
            [sponsorId]: {
                ...prevState[sponsorId],
                editedName: newName,
            },
        }));
    };

    const handleConfirmSponsorName = (sponsorId) => {
        // Update the sponsor's companyName
        const newCompanyName = sponsorStates[sponsorId].editedName;
        setSponsors(prevSponsors => prevSponsors.map(sponsor => {
            if (sponsor.id === sponsorId) {
                return { ...sponsor, companyName: newCompanyName };
            }
            return sponsor;
        }));
        // Exit edit mode
        setSponsorStates(prevState => ({
            ...prevState,
            [sponsorId]: {
                ...prevState[sponsorId],
                isEditingName: false,
            },
        }));
        // Call handleACTION or any other function as needed
    };

    const handleCancelSponsorNameEdit = (sponsorId) => {
        // Revert the editedName to the original companyName
        const originalName = sponsors.find(sponsor => sponsor.id === sponsorId).companyName;
        setSponsorStates(prevState => ({
            ...prevState,
            [sponsorId]: {
                ...prevState[sponsorId],
                editedName: originalName,
                isEditingName: false,
            },
        }));
    };

    const handleToggleDrivers = (sponsorId) => {
        const sponsorState = sponsorStates[sponsorId];
        if (!sponsorState.isDriversVisible) {
            // Set isLoadingDrivers to true
            setSponsorStates(prevState => ({
                ...prevState,
                [sponsorId]: {
                    ...prevState[sponsorId],
                    isDriversVisible: true,
                    isLoadingDrivers: true,
                },
            }));
            // Simulate fetching drivers from database
            setTimeout(() => {
                const drivers = [
                    { id: 1, name: 'Driver1', points: 100 },
                    { id: 2, name: 'Driver2', points: 150 },
                ];
                setSponsors(prevSponsors => prevSponsors.map(sponsor => {
                    if (sponsor.id === sponsorId) {
                        return { ...sponsor, drivers: drivers };
                    }
                    return sponsor;
                }));
                // Set isLoadingDrivers to false
                setSponsorStates(prevState => ({
                    ...prevState,
                    [sponsorId]: {
                        ...prevState[sponsorId],
                        isLoadingDrivers: false,
                    },
                }));
            }, 1000); // Simulate network delay
        } else {
            // Hide drivers
            setSponsorStates(prevState => ({
                ...prevState,
                [sponsorId]: {
                    ...prevState[sponsorId],
                    isDriversVisible: false,
                },
            }));
        }
    };

    // State for users, loading, and error
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState(null);

    // Function to handle role changes
    const handleRoleChange = (userId, newRole) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.USER_ID === userId ? { ...user, USER_TYPE: newRole } : user
            )
        );
        // Call your actual role change handler here
        handleACTION();
    };

    // Fetch users from the API endpoint
    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true);
            setUsersError(null);
            try {
                const response = await fetch('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-getUsers/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! Response: ${response} status: ${response.status}`);
                }
                const data = await response.json();
                if (data.users) {
                    setUsers(data.users);
                } else {
                    throw new Error('Invalid data format received from API.');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsersError(error.message);
            } finally {
                setUsersLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-grid">
            {/* User View Container */}
            <div className="userView-container">
                <h2>Users</h2>
                {usersLoading ? (
                    <div className="loading-message">Loading users...</div>
                ) : usersError ? (
                    <div className="error-message">Error: {usersError}</div>
                ) : (
                    <div className="table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>USER_ID</th>
                                    <th>USERNAME</th>
                                    <th>EMAIL</th>
                                    <th>TIME_CREATED</th>
                                    <th>F_NAME</th>
                                    <th>L_NAME</th>
                                    <th>ADDRESS_ID</th>
                                    <th>PHONENUM</th>
                                    <th>USER_TYPE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="9">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr
                                            key={user.USER_ID}
                                            className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                        >
                                            <td>{user.USER_ID}</td>
                                            <td>{user.USERNAME}</td>
                                            <td>{user.EMAIL}</td>
                                            <td>{new Date(user.TIME_CREATED).toLocaleDateString()}</td>
                                            <td>{user.F_NAME}</td>
                                            <td>{user.L_NAME}</td>
                                            <td>{`${user.STREET}, ${user.CITY}, ${user.STATE} ${user.ZIP_CODE}, ${user.COUNTRY}`}</td>
                                            <td>{user.PHONENUM}</td>
                                            <td>
                                                {/* Why No Work To-do */}
                                                <select
                                                    value={user.USER_TYPE} 
                                                    onChange={e =>
                                                        handleRoleChange(user.USER_ID, e.target.value)
                                                    }
                                                >
                                                    <option value="Driver">Driver</option>
                                                    <option value="Sponsor">Sponsor</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Sponsor View Container */}
            <div className="sponsorView-container">
                <h2>Sponsors</h2>
                {sponsors.map((sponsor) => {
                    const sponsorState = sponsorStates[sponsor.id] || {};
                    return (
                        <div key={sponsor.id} className="sponsor-item">
                            <div className="sponsor-header">
                                <span className="sponsor-id">ID: {sponsor.id}</span>
                                {sponsorState.isEditingName ? (
                                    <input
                                        type="text"
                                        value={sponsorState.editedName}
                                        onChange={(e) => handleSponsorNameChange(sponsor.id, e.target.value)}
                                        className="company-name-input"
                                    />
                                ) : (
                                    <span className="sponsor-name">{sponsor.companyName}</span>
                                )}
                                <button
                                    className={`edit-button ${
                                        sponsorState.isEditingName
                                            ? sponsorState.editedName.trim() === ''
                                                ? 'cancel'
                                                : 'confirm'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        if (!sponsorState.isEditingName) {
                                            handleEditSponsorName(sponsor.id);
                                        } else {
                                            if (sponsorState.editedName.trim() === '') {
                                                handleCancelSponsorNameEdit(sponsor.id);
                                            } else {
                                                handleConfirmSponsorName(sponsor.id);
                                            }
                                        }
                                    }}
                                >
                                    {sponsorState.isEditingName
                                        ? sponsorState.editedName.trim() === ''
                                            ? 'Cancel'
                                            : 'Confirm'
                                        : 'Edit'}
                                </button>
                                <button
                                    className="dropdown-button"
                                    onClick={() => handleToggleDrivers(sponsor.id)}
                                >
                                    {sponsorState.isDriversVisible ? '▲' : '▼'}
                                </button>
                            </div>
                            {sponsorState.isDriversVisible && (
                                <div className="drivers-list">
                                    {sponsorState.isLoadingDrivers ? (
                                        <div className="loading-message">Loading drivers...</div>
                                    ) : (
                                        sponsor.drivers &&
                                        sponsor.drivers.map((driver) => (
                                            <div key={driver.id} className="driver-item">
                                                <span>{driver.name}</span>
                                                <input
                                                    type="number"
                                                    value={driver.points}
                                                    onChange={handleACTION}
                                                    className="points-input"
                                                />
                                                <button onClick={handleACTION}>Remove Driver</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* User Editor Container */}
            <div className="userEditor-container">
                <div className="relationship-container">
                    <h2>Add Relationship</h2>
                    <input type="text" placeholder="Driver ID" className="input-field" />
                    <input type="text" placeholder="Sponsor ID" className="input-field" />
                    <button className="add-relationship-button" onClick={handleACTION}>
                        Add Relationship
                    </button>
                </div>
                <div>
                    <Addpoints />
                </div>
            </div>
        </div>
    );

};

export default Admin;
