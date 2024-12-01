import mysql from 'mysql2/promise';

export const handler = async (event) => {
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    let connection;

    try {
        console.log("Incoming event:", JSON.stringify(event));

        const httpMethod = event.httpMethod;

        if (httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'CORS preflight check successful' }),
            };
        }

        if (httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
        }

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

        const { username, email, firstName, lastName, phoneNumber, userType, fullAddress, companyName } = data;

        if (!username || !email || !firstName || !lastName || !userType || !fullAddress) {
            console.error("Missing required fields in request body");
            return {
                statusCode: 401,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Missing required user data fields : ' + 
                (username || "(User = N/A)") + (email || " (Email = N/A)") + (firstName || " (First = N/A)") + 
                ( lastName || " (Last = N/A)") + (userType || " (Role = N/A)") + (fullAddress || " (Address = N/A)") }),
            };
        }

        const [street, city, state, zip] = fullAddress.split(',').map(item => item.trim());

        connection = await mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName,
        });

        // Insert address and get ADDRESS_ID
        const [addressResult] = await connection.execute(
            `INSERT INTO ADDRESS (STREET, CITY, STATE, ZIP_CODE) VALUES (?, ?, ?, ?)`,
            [street, city, state, zip]
        );
        const addressId = addressResult.insertId;

        // Insert into USERS table
        const [userResult] = await connection.execute(
            `INSERT INTO USERS (USERNAME, EMAIL, F_NAME, L_NAME, ADDRESS_ID, PHONENUM, USER_TYPE) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, email, firstName, lastName, addressId, phoneNumber, userType.toUpperCase()]
        );
        const userId = userResult.insertId;

        // Insert into appropriate subtype table with additional attributes
        switch (userType.toLowerCase()) {
            case 'driver':
                await connection.execute(
                    `INSERT INTO DRIVERS (DRIVER_ID, POINT_TOTAL) VALUES (?, ?)`,
                    [userId, 0]
                );
                break;
            case 'sponsor':
                await connection.execute(
                    `INSERT INTO SPONSOR (SPONSOR_ID, COMPANY_NAME) VALUES (?, ?)`,
                    [userId, companyName || null]
                );
                break;
            case 'admin':
                await connection.execute(
                    `INSERT INTO ADMIN (ADMIN_ID) VALUES (?)`,
                    [userId]
                );
                break;
            case 'dev':
                await connection.execute(
                    `INSERT INTO DEVS (DEV_ID) VALUES (?)`,
                    [userId]
                );
                break;
            default:
                console.error("Invalid user type specified");
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ message: 'Invalid user type' }),
                };
        }

        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'User created successfully', userId }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
