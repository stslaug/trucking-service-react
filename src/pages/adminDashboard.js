// Filename: Admin.js

import React, { useEffect, useState, useContext } from 'react';
import "./css/general.css";
import "./css/admin.css";
import Addpoints from '../components/addPoints';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const { username, dbUser, fetchUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleACTION = () => {
        // Placeholder function that returns nothing
    };

    // State for users, loading, and error
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState(null);

    // State for sorting
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });

    // State to manage edit mode and edited fields for users
    const [editingUsers, setEditingUsers] = useState({});

    // Function to handle sorting
    const handleSort = (columnKey, isNumeric) => {
        let direction = 'ascending';

        if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === columnKey && sortConfig.direction === 'descending') {
            direction = 'ascending';
        } else {
            // Initial sort direction based on data type
            direction = isNumeric ? 'ascending' : 'descending';
        }

        setSortConfig({ key: columnKey, direction });
    };

    // Function to sort users
    const sortedUsers = React.useMemo(() => {
        if (users.length === 0 || !sortConfig.key) {
            return users;
        }

        const sortedArray = [...users];

        sortedArray.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
            } else {
                // For strings, compare case-insensitively
                const aString = aValue.toString().toLowerCase();
                const bString = bValue.toString().toLowerCase();

                if (aString < bString) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aString > bString) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            }
        });

        return sortedArray;
    }, [users, sortConfig]);

    // Function to handle role changes (for USER_TYPE)
    const handleRoleChange = (userId, newRole) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.USER_ID === userId ? { ...user, USER_TYPE: newRole } : user
            )
        );
        // Optionally, call your actual role change handler here (e.g., update via API)
        handleACTION();
    };

    // Function to enter edit mode for a user
    const handleEditUser = (user) => {
        setEditingUsers(prevState => ({
            ...prevState,
            [user.USER_ID]: {
                isEditing: true,
                editedData: {
                    F_NAME: user.F_NAME || '',
                    L_NAME: user.L_NAME || '',
                    EMAIL: user.EMAIL || '',
                    PHONENUM: user.PHONENUM || '',
                    STREET: user.STREET || '',
                    CITY: user.CITY || '',
                    STATE: user.STATE || '',
                    ZIP_CODE: user.ZIP_CODE || '',
                    USER_TYPE: user.USER_TYPE ? user.USER_TYPE.toLowerCase() : 'N/A',
                    COMPANY_NAME: user.COMPANY_NAME || '', // Initialize COMPANY_NAME
                    PERMISSIONS: user.PERMISSIONS || '',
                },
            },
        }));
    };

    // Function to handle changes in editable fields
    const handleEditFieldChange = (userId, field, value) => {
        setEditingUsers(prevState => ({
            ...prevState,
            [userId]: {
                ...prevState[userId],
                editedData: {
                    ...prevState[userId].editedData,
                    [field]: value,
                },
            },
        }));
    };

    // Function to confirm and save changes
    const handleConfirmEdit = async (userId) => {
        const editedData = editingUsers[userId].editedData;
        const user = users.find(u => u.USER_ID === userId);
    
        // Prepare the request body with only the fields that have been changed
        const updatedFields = {};
    
        if (editedData.F_NAME.trim() !== user.F_NAME) updatedFields.firstN = editedData.F_NAME.trim();
        if (editedData.L_NAME.trim() !== user.L_NAME) updatedFields.lastN = editedData.L_NAME.trim();
        if (editedData.EMAIL.trim() !== user.EMAIL) updatedFields.email = editedData.EMAIL.trim(); // Add email if needed
        if (editedData.PHONENUM.trim() !== user.PHONENUM) updatedFields.phoneNumber = editedData.PHONENUM.trim();
        if (editedData.STREET.trim() !== user.STREET) updatedFields.addressLine1 = editedData.STREET.trim();
        if (editedData.CITY.trim() !== user.CITY) updatedFields.city = editedData.CITY.trim();
        if (editedData.STATE.trim() !== user.STATE) updatedFields.state = editedData.STATE.trim();
        if (editedData.ZIP_CODE.trim() !== user.ZIP_CODE) updatedFields.zip = editedData.ZIP_CODE.trim();
        if (editedData.USER_TYPE.trim() !== user.USER_TYPE.toLowerCase()) updatedFields.userType = editedData.USER_TYPE.trim().toLowerCase();
    
        // Include COMPANY_NAME if USER_TYPE is sponsor
        if (editedData.USER_TYPE.trim().toLowerCase() === 'sponsor') {
            if (editedData.COMPANY_NAME.trim() === '') {
                alert("Company Name is required for sponsors.");
                return;
            }
            updatedFields.company = editedData.COMPANY_NAME.trim();
        }
    
        // Include PERMISSIONS if USER_TYPE is admin
        if (editedData.USER_TYPE.trim().toLowerCase() === 'admin' && editedData.PERMISSIONS.trim() !== user.PERMISSIONS) {
            updatedFields.permissions = editedData.PERMISSIONS.trim();
        }
    
        // If no fields have changed, do nothing
        if (Object.keys(updatedFields).length === 0) {
            alert("No changes detected.");
            return;
        }
    
        console.log('Updated Fields:', updatedFields);
    
        try {
            const response = await fetch(`https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/Team12-UpdateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.USERNAME,
                    ...updatedFields,
                }),
            });
    
            console.log('Fetch Response Status:', response.status);
    
            const responseData = await response.json(); // Read the response body once
    
            console.log('Fetch Response Body:', responseData);
    
            if (response.ok) {
                alert("User updated successfully!");
    
                // Update the local user data
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.USER_ID === userId ? { ...u, ...editedData } : u
                    )
                );
    
                // Exit edit mode
                setEditingUsers(prevState => ({
                    ...prevState,
                    [userId]: {
                        isEditing: false,
                    },
                }));
            } else {
                console.error("Failed to update user:", responseData.message);
                alert(`Failed to update user information: ${responseData.message}`);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user information. Please try again.");
        }
    };

    // Function to cancel editing
    const handleCancelEdit = (userId) => {
        setEditingUsers(prevState => ({
            ...prevState,
            [userId]: {
                isEditing: false,
            },
        }));
    };

    // Fetch users from the API endpoint
    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true);
            setUsersError(null);
            try {
                const response = await fetch('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-getUsers/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
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

    // New State for sponsors
    const [sponsors, setSponsors] = useState([]);
    const [sponsorsLoading, setSponsorsLoading] = useState(false);
    const [sponsorsError, setSponsorsError] = useState(null);

    // State to manage expanded sponsors and their drivers
    const [expandedSponsors, setExpandedSponsors] = useState({});

    // Fetch sponsors from the API endpoint
    useEffect(() => {
        const fetchSponsors = async () => {
            setSponsorsLoading(true);
            setSponsorsError(null);
            try {
                const response = await fetch('https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-getUsers/sponsors');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.sponsors) {
                    setSponsors(data.sponsors);
                } else {
                    throw new Error('Invalid data format received from API.');
                }
            } catch (error) {
                console.error('Error fetching sponsors:', error);
                setSponsorsError(error.message);
            } finally {
                setSponsorsLoading(false);
            }
        };

        fetchSponsors();
    }, []);

    const handleToggleSponsor = (sponsorId) => {
        setExpandedSponsors(prevState => ({
            ...prevState,
            [sponsorId]: {
                isExpanded: !prevState[sponsorId]?.isExpanded,
                drivers: prevState[sponsorId]?.drivers || [],
                loading: !prevState[sponsorId]?.isExpanded ? true : false,
                error: null,
            },
        }));

        if (!expandedSponsors[sponsorId]?.isExpanded) {
            // Fetch drivers for the sponsor
            const fetchSponsorDrivers = async () => {
                try {
                    const response = await fetch(`https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-getSponsorDrivers?sponsorId=${sponsorId}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    if (data.drivers) {
                        setExpandedSponsors(prevState => ({
                            ...prevState,
                            [sponsorId]: {
                                ...prevState[sponsorId],
                                drivers: data.drivers,
                                loading: false,
                            },
                        }));
                    } else {
                        throw new Error('Invalid data format received from API.');
                    }
                } catch (error) {
                    console.error('Error fetching sponsor drivers:', error);
                    setExpandedSponsors(prevState => ({
                        ...prevState,
                        [sponsorId]: {
                            ...prevState[sponsorId],
                            loading: false,
                            error: error.message,
                        },
                    }));
                }
            };

            fetchSponsorDrivers();
        }
    };

    return (
        <div style={{'margin': '10px 20px auto 10px'}}>
        

            <div className="admin-grid">
                {/* User View Container */}
                <div style={{gridColumn: ' 1 / span 2'}} className="userView-container">
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
                                        <th onClick={() => handleSort('USER_ID', true)}>
                                            USER_ID {sortConfig.key === 'USER_ID' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th onClick={() => handleSort('USERNAME', false)}>
                                            USERNAME {sortConfig.key === 'USERNAME' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th onClick={() => handleSort('EMAIL', false)}>
                                            EMAIL {sortConfig.key === 'EMAIL' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th onClick={() => handleSort('TIME_CREATED', false)}>
                                            TIME_CREATED {sortConfig.key === 'TIME_CREATED' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th onClick={() => handleSort('F_NAME', false)}>
                                            F_NAME {sortConfig.key === 'F_NAME' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th onClick={() => handleSort('L_NAME', false)}>
                                            L_NAME {sortConfig.key === 'L_NAME' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th onClick={() => handleSort('ADDRESS', false)}>
                                            ADDRESS {sortConfig.key === 'ADDRESS' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th onClick={() => handleSort('PHONENUM', false)}>
                                            PHONENUM {sortConfig.key === 'PHONENUM' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th onClick={() => handleSort('USER_TYPE', false)}>
                                            USER_TYPE {sortConfig.key === 'USER_TYPE' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                        </th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="table-body-container">
                                <table className="user-table">
                                    <tbody>
                                        {sortedUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="10">No users found.</td>
                                            </tr>
                                        ) : (
                                            sortedUsers.map((user, index) => {
                                                const address = `${user.STREET}, ${user.CITY}, ${user.STATE} ${user.ZIP_CODE}, ${user.COUNTRY}`;

                                                // Check if the user is in edit mode
                                                const isEditing = editingUsers[user.USER_ID]?.isEditing;
                                                const editedData = editingUsers[user.USER_ID]?.editedData || {};

                                                return (
                                                    <tr
                                                        key={user.USER_ID}
                                                        className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                                    >
                                                        <td>{user.USER_ID}</td>
                                                        <td>{user.USERNAME}</td>
                                                        <td>
                                                            {isEditing ? (
                                                                <input
                                                                    type="email"
                                                                    value={editedData.EMAIL}
                                                                    onChange={(e) => handleEditFieldChange(user.USER_ID, 'EMAIL', e.target.value)}
                                                                    className="edit-input"
                                                                />
                                                            ) : (
                                                                user.EMAIL
                                                            )}
                                                        </td>
                                                        <td>{new Date(user.TIME_CREATED).toLocaleDateString()}</td>
                                                        <td>
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={editedData.F_NAME}
                                                                    onChange={(e) => handleEditFieldChange(user.USER_ID, 'F_NAME', e.target.value)}
                                                                    className="edit-input"
                                                                />
                                                            ) : (
                                                                user.F_NAME
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={editedData.L_NAME}
                                                                    onChange={(e) => handleEditFieldChange(user.USER_ID, 'L_NAME', e.target.value)}
                                                                    className="edit-input"
                                                                />
                                                            ) : (
                                                                user.L_NAME
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={editedData.STREET}
                                                                        onChange={(e) => handleEditFieldChange(user.USER_ID, 'STREET', e.target.value)}
                                                                        placeholder="Street"
                                                                        className="edit-input"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={editedData.CITY}
                                                                        onChange={(e) => handleEditFieldChange(user.USER_ID, 'CITY', e.target.value)}
                                                                        placeholder="City"
                                                                        className="edit-input"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={editedData.STATE}
                                                                        onChange={(e) => handleEditFieldChange(user.USER_ID, 'STATE', e.target.value)}
                                                                        placeholder="State"
                                                                        className="edit-input"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={editedData.ZIP_CODE}
                                                                        onChange={(e) => handleEditFieldChange(user.USER_ID, 'ZIP_CODE', e.target.value)}
                                                                        placeholder="Zip Code"
                                                                        className="edit-input"
                                                                    />
                                                                    {/* Conditionally render Company Name input if USER_TYPE is sponsor */}
                                                                    {editedData.USER_TYPE === 'sponsor' && (
                                                                        <input
                                                                            type="text"
                                                                            value={editedData.COMPANY_NAME}
                                                                            onChange={(e) => handleEditFieldChange(user.USER_ID, 'COMPANY_NAME', e.target.value)}
                                                                            placeholder="Company Name"
                                                                            className="edit-input"
                                                                        />
                                                                    )}
                                                                </>
                                                            ) : (
                                                                address
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={editedData.PHONENUM}
                                                                    onChange={(e) => handleEditFieldChange(user.USER_ID, 'PHONENUM', e.target.value)}
                                                                    className="edit-input"
                                                                />
                                                            ) : (
                                                                user.PHONENUM
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <select
                                                                    value={editedData.USER_TYPE}
                                                                    onChange={(e) => handleEditFieldChange(user.USER_ID, 'USER_TYPE', e.target.value)}
                                                                    className="edit-select"
                                                                >
                                                                    <option value="driver">Driver</option>
                                                                    <option value="sponsor">Sponsor</option>
                                                                    <option value="admin">Admin</option>
                                                                    <option value="dev">Dev</option>
                                                                </select>
                                                            ) : (
                                                                <span style={{ textTransform: 'capitalize' }}>{user.USER_TYPE}</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isEditing ? (
                                                                <>
                                                                    <button
                                                                        className="edit-button confirm"
                                                                        onClick={() => handleConfirmEdit(user.USER_ID)}
                                                                    >
                                                                        Confirm
                                                                    </button>
                                                                    <button
                                                                        className="edit-button cancel"
                                                                        onClick={() => handleCancelEdit(user.USER_ID)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    className="edit-button"
                                                                    onClick={() => handleEditUser(user)}
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>



                {/* Sponsor View Container */}
                <div className="sponsorView-container">
                    <h2>Sponsors</h2>
                    {sponsorsLoading ? (
                        <div className="loading-message">Loading sponsors...</div>
                    ) : sponsorsError ? (
                        <div className="error-message">Error: {sponsorsError}</div>
                    ) : (
                        <div className="sponsors-list">
                            {sponsors.length === 0 ? (
                                <div>No sponsors found.</div>
                            ) : (
                                sponsors.map((sponsor, index) => (
                                    <div key={sponsor.SPONSOR_ID} className="sponsor-container">
                                        {/* Sponsor Header */}
                                        <div className="sponsor-header">
                                            <div className="sponsor-info">
                                                <span className="sponsor-id">ID: {sponsor.SPONSOR_ID}</span>
                                                <span className="sponsor-name">{sponsor.COMPANY_NAME}</span>
                                            </div>
                                            <button
                                                className="dropdown-button"
                                                onClick={() => handleToggleSponsor(sponsor.SPONSOR_ID)}
                                            >
                                                {expandedSponsors[sponsor.SPONSOR_ID]?.isExpanded ? '▲' : '▼'}
                                            </button>
                                        </div>
                                        {expandedSponsors[sponsor.SPONSOR_ID]?.isExpanded && (
                                            <div className="drivers-container">
                                                {expandedSponsors[sponsor.SPONSOR_ID]?.loading ? (
                                                    <div className="loading-message">Loading drivers...</div>
                                                ) : expandedSponsors[sponsor.SPONSOR_ID]?.error ? (
                                                    <div className="error-message">
                                                        Error: {expandedSponsors[sponsor.SPONSOR_ID].error}
                                                    </div>
                                                ) : (
                                                    <div className="drivers-table-container">
                                                        <table className="drivers-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>SP_DR_ID</th>
                                                                    <th>DRIVER_ID</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {expandedSponsors[sponsor.SPONSOR_ID].drivers.length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan="2">No drivers found.</td>
                                                                    </tr>
                                                                ) : (
                                                                    expandedSponsors[sponsor.SPONSOR_ID].drivers.map((driver, idx) => (
                                                                        <tr key={driver.SP_DR_ID} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                                                                            <td>{driver.SP_DR_ID}</td>
                                                                            <td>{driver.DRIVER_ID}</td>
                                                                        </tr>
                                                                    ))
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
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
                    <div style={{marginTop: '15px'}}>
                        <Addpoints />
                    </div>
                </div>
            </div>
        </div>

    );

};

export default Admin;
