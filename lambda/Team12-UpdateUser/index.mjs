// Filename: team12-UpdateUser.js

import mysql from 'mysql2/promise';

export const handler = async (event) => {
    // Environment Variables
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;

    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend domain in production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    };

    let connection;

    try {
        console.log("Incoming event:", JSON.stringify(event));

        const httpMethod = event.httpMethod;

        // Handle CORS Preflight
        if (httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'CORS preflight check successful' }),
            };
        }

        // Ensure Method is PUT
        if (httpMethod !== 'PUT') {
            return {
                statusCode: 405,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Method Not Allowed: ' + httpMethod }),
            };
        }

        // Parse Request Body
        let data;
        try {
            data = JSON.parse(event.body);
        } catch (parseError) {
            console.error("Error parsing request body:", parseError);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Invalid JSON format' }),
            };
        }

        // Destructure Incoming Data
        const {
            username,
            firstN,
            lastN,
            phoneNumber,
            addressLine1,
            city,
            state,
            zip,
            userType,
            company,      // Added to handle company name for sponsors
            permissions,  // Added for admin role
        } = data;

        // Validate Required Fields
        if (!username) {
            console.error("Username is required for updating user");
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Username is required' }),
            };
        }

        // Validate userType if provided
        const allowedUserTypes = ['driver', 'sponsor', 'admin', 'dev'];
        let newUserType = userType ? userType.trim().toLowerCase() : null;

        if (newUserType && !allowedUserTypes.includes(newUserType)) {
            console.error("Invalid user type provided:", newUserType);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Invalid user type' }),
            };
        }

        // Establish Database Connection
        connection = await mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName,
        });

        // Begin Transaction
        await connection.beginTransaction();

        // Fetch Existing User Data (USER_ID, ADDRESS_ID, USER_TYPE)
        const [userRows] = await connection.execute(
            `SELECT USER_ID, ADDRESS_ID, USER_TYPE FROM USERS WHERE USERNAME = ?`,
            [username]
        );

        if (userRows.length === 0) {
            await connection.rollback();
            console.error("User not found:", username);
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        const { USER_ID, ADDRESS_ID, USER_TYPE } = userRows[0];
        console.log(`USER_ID: ${USER_ID}, ADDRESS_ID: ${ADDRESS_ID}, USER_TYPE: ${USER_TYPE}`);

        // Prepare Fields for USERS Table Update
        const usersFields = [];
        const usersValues = [];

        if (firstN && firstN.trim() !== '') {
            usersFields.push("F_NAME = ?");
            usersValues.push(firstN.trim());
        }

        if (lastN && lastN.trim() !== '') {
            usersFields.push("L_NAME = ?");
            usersValues.push(lastN.trim());
        }

        if (phoneNumber && phoneNumber.trim() !== '') {
            usersFields.push("PHONENUM = ?");
            usersValues.push(phoneNumber.trim());
        }

        if (newUserType && newUserType !== USER_TYPE.toLowerCase()) {
            usersFields.push("USER_TYPE = ?");
            usersValues.push(newUserType.toUpperCase());
        }

        // Update USERS Table if Fields are Provided
        if (usersFields.length > 0) {
            const usersQuery = `UPDATE USERS SET ${usersFields.join(", ")} WHERE USERNAME = ?`;
            usersValues.push(username);
            console.log(`Executing USERS update: ${usersQuery} with values ${usersValues}`);
            await connection.execute(usersQuery, usersValues);
        }

        // Prepare Fields for ADDRESS Table Update
        const addressFields = [];
        const addressValues = [];

        if (addressLine1 && addressLine1.trim() !== '') {
            addressFields.push("STREET = ?");
            addressValues.push(addressLine1.trim());
        }

        if (city && city.trim() !== '') {
            addressFields.push("CITY = ?");
            addressValues.push(city.trim());
        }

        if (state && state.trim() !== '') {
            addressFields.push("STATE = ?");
            addressValues.push(state.trim());
        }

        if (zip && zip.trim() !== '') {
            addressFields.push("ZIP_CODE = ?");
            addressValues.push(zip.trim());
        }

        // Update ADDRESS Table if Fields are Provided
        if (addressFields.length > 0) {
            const addressQuery = `UPDATE ADDRESS SET ${addressFields.join(", ")} WHERE ADDRESS_ID = ?`;
            addressValues.push(ADDRESS_ID);
            console.log(`Executing ADDRESS update: ${addressQuery} with values ${addressValues}`);
            await connection.execute(addressQuery, addressValues);
        }

        // Handle userType Changes
        if (newUserType && newUserType !== USER_TYPE.toLowerCase()) {

            // Check if userType is changing from 'driver' to another type
            if (USER_TYPE.toLowerCase() === 'driver' && newUserType !== 'driver') {
                // Set all sponsor relationships to 'INACTIVE' for this driver
                await connection.execute(
                    'UPDATE SPONSOR_DRIVERS SET ASSOCIATE_STATUS = ? WHERE DRIVER_ID = ?',
                    ['INACTIVE', USER_ID]
                );
                console.log(`Set sponsor relationships to INACTIVE for DRIVER_ID ${USER_ID}`);
            }

            // Add to New Subtype Table
            switch (newUserType) {
                case 'driver':
                    // Check if user already exists in DRIVERS table
                    const [driverRows] = await connection.execute(
                        `SELECT DRIVER_ID FROM DRIVERS WHERE DRIVER_ID = ?`,
                        [USER_ID]
                    );
                    if (driverRows.length === 0) {
                        await connection.execute(
                            `INSERT INTO DRIVERS (DRIVER_ID, POINT_TOTAL) VALUES (?, ?)`,
                            [USER_ID, 0]
                        );
                    } else {
                        // User already exists in DRIVERS table
                        console.log(`User with USER_ID ${USER_ID} already exists in DRIVERS table.`);
                    }
                    break;
                case 'sponsor':
                    // Validate that 'company' is provided for sponsor
                    if (!company || company.trim() === '') {
                        throw new Error('Company name is required for sponsor role.');
                    }
                    // Check if user already exists in SPONSOR table
                    const [sponsorRows] = await connection.execute(
                        `SELECT SPONSOR_ID FROM SPONSOR WHERE SPONSOR_ID = ?`,
                        [USER_ID]
                    );
                    if (sponsorRows.length === 0) {
                        await connection.execute(
                            `INSERT INTO SPONSOR (SPONSOR_ID, COMPANY_NAME) VALUES (?, ?)`,
                            [USER_ID, company.trim()]
                        );
                    } else {
                        // User already exists in SPONSOR table, update COMPANY_NAME
                        await connection.execute(
                            `UPDATE SPONSOR SET COMPANY_NAME = ? WHERE SPONSOR_ID = ?`,
                            [company.trim(), USER_ID]
                        );
                    }
                    break;
                case 'admin':
                    const [adminRows] = await connection.execute(
                        `SELECT ADMIN_ID FROM ADMIN WHERE ADMIN_ID = ?`,
                        [USER_ID]
                    );
                    if (adminRows.length === 0) {
                        // Insert into ADMIN table
                        await connection.execute(
                            `INSERT INTO ADMIN (ADMIN_ID) VALUES (?)`,
                            [USER_ID]
                        );
                    }
                    break;
                case 'dev':
                    const [devRows] = await connection.execute(
                        `SELECT DEV_ID FROM DEVS WHERE DEV_ID = ?`,
                        [USER_ID]
                    );
                    if (devRows.length === 0) {
                        await connection.execute(
                            `INSERT INTO DEVS (DEV_ID, FirstName, LastName, Description) VALUES (?, ?, ?, ?)`,
                            [USER_ID, firstN ? firstN.trim() : null, lastN ? lastN.trim() : null, null]
                        );
                    } else {
                        // User already exists in DEVS table, update FirstName and LastName
                        await connection.execute(
                            `UPDATE DEVS SET FirstName = ?, LastName = ? WHERE DEV_ID = ?`,
                            [firstN ? firstN.trim() : null, lastN ? lastN.trim() : null, USER_ID]
                        );
                    }
                    break;
                default:
                    await connection.rollback();
                    console.error("Invalid new user type specified:", newUserType);
                    return {
                        statusCode: 400,
                        headers: corsHeaders,
                        body: JSON.stringify({ message: 'Invalid user type' }),
                    };
            }
        } else {
            // If userType hasn't changed, update subtype data if necessary
            await updateSubtypeData(connection, USER_ID, newUserType || USER_TYPE.toLowerCase(), { company, permissions, firstN, lastN });
        }

        // Commit Transaction
        await connection.commit();

        console.log("User updated successfully.");
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'User updated successfully' }),
        };
    } catch (error) {
        console.error("Error updating user:", error);
        if (connection) {
            await connection.rollback();
        }

        // Enhanced Error Handling for Foreign Key Constraint or Other SQL Errors
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Invalid foreign key reference.' }),
            };
        }

        // Custom Error Messages
        if (error.message.includes('Permissions') || error.message.includes('Company')) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: error.message }),
            };
        }

        // Log the full error for debugging
        console.error("Unhandled error:", error);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    } finally {
        if (connection) {
            await connection.end();
            console.log("Database connection closed.");
        }
    }
};

// Function to update subtype data when userType hasn't changed
async function updateSubtypeData(connection, userId, userType, { company, permissions, firstN, lastN }) {
    switch (userType) {
        case 'sponsor':
            if (company && company.trim() !== '') {
                // Update COMPANY_NAME in SPONSOR table
                await connection.execute(
                    `UPDATE SPONSOR SET COMPANY_NAME = ? WHERE SPONSOR_ID = ?`,
                    [company.trim(), userId]
                );
            }
            break;
        case 'admin':
            if (permissions && permissions.trim() !== '') {
                const defaultPermissions = permissions.trim();

                // Check if the provided permissions exist in PERMISSIONS table
                const [permRows] = await connection.execute(
                    `SELECT PERMISSION_ID FROM PERMISSIONS WHERE PERMISSION_ID = ?`,
                    [defaultPermissions]
                );

                if (permRows.length === 0) {
                    throw new Error(`Permissions '${defaultPermissions}' do not exist.`);
                }

                // Update PERMISSIONS in ADMIN table
                await connection.execute(
                    `UPDATE ADMIN SET PERMISSIONS = ? WHERE ADMIN_ID = ?`,
                    [defaultPermissions, userId]
                );
            }
            break;
        case 'dev':
            // Update DEVS table if necessary
            await connection.execute(
                `UPDATE DEVS SET FirstName = ?, LastName = ? WHERE DEV_ID = ?`,
                [firstN ? firstN.trim() : null, lastN ? lastN.trim() : null, userId]
            );
            break;
    }
}
