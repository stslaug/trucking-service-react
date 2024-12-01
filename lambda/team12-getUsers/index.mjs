
import mysql from 'mysql2/promise';

export const handler = async (event) => {
    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // Adjust as needed for security
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    let connection;

    try {
        console.log("Incoming event:", JSON.stringify(event));

        // Safeguard: Ensure event and httpMethod are defined
        if (!event || !event.httpMethod) {
            console.error("Invalid event structure:", event);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Bad Request: Invalid event structure" }),
            };
        }

        const httpMethod = event.httpMethod;
        const path = event.path || '/';

        console.log("HTTP Method:", httpMethod);
        console.log("Request path:", path);

        // Handle CORS Preflight
        if (httpMethod === 'OPTIONS') {
            console.log("Handling CORS preflight (OPTIONS) request.");
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'CORS preflight check successful' }),
            };
        }

        // Ensure Method is GET
        if (httpMethod !== 'GET') {
            console.warn(`Unsupported HTTP method: ${httpMethod}`);
            return {
                statusCode: 405,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Method Not Allowed: " + httpMethod }),
            };
        }

        // Establish Database Connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log("Database connection established.");

        // Handle fetching sponsors
        if (path.endsWith('/sponsors')) {
            try {
                console.log("Fetching all sponsors.");

                // Fetch all sponsors from SPONSOR table
                const [sponsorRows] = await connection.execute(
                    `SELECT SPONSOR_ID, COMPANY_NAME FROM SPONSOR`
                );

                console.log(`Number of sponsors fetched: ${sponsorRows.length}`);

                if (sponsorRows.length === 0) {
                    console.warn("No sponsors found in the database.");
                    return {
                        statusCode: 200,
                        headers: corsHeaders,
                        body: JSON.stringify({ sponsors: [] }),
                    };
                } else {
                    // Return sponsors data
                    return {
                        statusCode: 200,
                        headers: corsHeaders,
                        body: JSON.stringify({ sponsors: sponsorRows }),
                    };
                }
            } catch (error) {
                console.error("Error fetching sponsors:", error);
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({ message: 'Internal server error' }),
                };
            }
        }
        // Handle fetching drivers
        else if (path.endsWith('/drivers')) {
            try {
                // Extract Query Parameters
                const sponsorId = event.queryStringParameters && event.queryStringParameters.userId;

                console.log("Sponsor ID provided:", sponsorId);

                let driverRows;

                if (sponsorId) {
                    console.log(`Fetching drivers not associated with sponsor ID: ${sponsorId}`);

                    // Corrected SQL Query using LEFT JOIN
                    [driverRows] = await connection.query(
                        `SELECT 
                            USERS.USER_ID, 
                            USERS.USERNAME, 
                            USERS.EMAIL, 
                            USERS.TIME_CREATED, 
                            USERS.F_NAME, 
                            USERS.L_NAME, 
                            USERS.PHONENUM, 
                            USERS.PAYMENT, 
                            USERS.USER_TYPE,
                            ADDRESS.STREET, 
                            ADDRESS.CITY, 
                            ADDRESS.STATE, 
                            ADDRESS.ZIP_CODE,
                            ADDRESS.COUNTRY
                         FROM USERS
                         LEFT JOIN ADDRESS ON USERS.ADDRESS_ID = ADDRESS.ADDRESS_ID
                         LEFT JOIN SPONSOR_DRIVERS ON USERS.USER_ID = SPONSOR_DRIVERS.DRIVER_ID 
                             AND SPONSOR_DRIVERS.SPONSOR_ID = ? 
                             AND SPONSOR_DRIVERS.ASSOCIATE_STATUS = 'ACTIVE'
                         WHERE USERS.USER_TYPE = 'DRIVER' 
                           AND SPONSOR_DRIVERS.SPONSOR_ID IS NULL`,
                        [sponsorId]
                    );
                } else {
                    console.log("Fetching all drivers.");

                    // Fetch all drivers from USERS table with USER_TYPE 'DRIVER'
                    [driverRows] = await connection.execute(
                        `SELECT 
                            USERS.USER_ID, 
                            USERS.USERNAME, 
                            USERS.EMAIL, 
                            USERS.TIME_CREATED, 
                            USERS.F_NAME, 
                            USERS.L_NAME, 
                            USERS.PHONENUM, 
                            USERS.PAYMENT, 
                            USERS.USER_TYPE,
                            ADDRESS.STREET, 
                            ADDRESS.CITY, 
                            ADDRESS.STATE, 
                            ADDRESS.ZIP_CODE,
                            ADDRESS.COUNTRY
                         FROM USERS
                         LEFT JOIN ADDRESS ON USERS.ADDRESS_ID = ADDRESS.ADDRESS_ID
                         WHERE USERS.USER_TYPE = 'DRIVER'`
                    );
                }

                console.log(`Number of drivers fetched: ${driverRows.length}`);

                if (driverRows.length === 0) {
                    console.warn("No drivers found in the database.");
                    return {
                        statusCode: 200, // Changed from 210 to 200 for standard HTTP status
                        headers: corsHeaders,
                        body: JSON.stringify({ drivers: [] }),
                    };
                }

                // Get driver IDs
                const driverIds = driverRows.map(driver => driver.USER_ID);

                if (driverIds.length === 0) {
                    console.warn("No driver IDs found after filtering.");
                    return {
                        statusCode: 200,
                        headers: corsHeaders,
                        body: JSON.stringify({ drivers: [] }),
                    };
                }

                // Fetch point totals for drivers
                const [driverPointRows] = await connection.query(
                    `SELECT DRIVER_ID, POINT_TOTAL FROM DRIVERS WHERE DRIVER_ID IN (?)`,
                    [driverIds]
                );

                // Build mapping from DRIVER_ID to POINT_TOTAL
                const driverPointsMap = {};
                driverPointRows.forEach(row => {
                    driverPointsMap[row.DRIVER_ID] = row.POINT_TOTAL;
                });

                // Fetch sponsors for drivers
                const [sponsorRows] = await connection.query(
                    `SELECT 
                        SPONSOR_DRIVERS.DRIVER_ID,
                        SPONSOR.SPONSOR_ID, 
                        SPONSOR.COMPANY_NAME
                     FROM SPONSOR_DRIVERS
                     JOIN SPONSOR ON SPONSOR_DRIVERS.SPONSOR_ID = SPONSOR.SPONSOR_ID
                     WHERE SPONSOR_DRIVERS.DRIVER_ID IN (?) AND SPONSOR_DRIVERS.ASSOCIATE_STATUS = 'ACTIVE'`,
                    [driverIds]
                );

                // Build mapping from DRIVER_ID to their sponsors
                const driverSponsorsMap = {};
                sponsorRows.forEach(row => {
                    const driverId = row.DRIVER_ID;
                    if (!driverSponsorsMap[driverId]) {
                        driverSponsorsMap[driverId] = [];
                    }
                    driverSponsorsMap[driverId].push({
                        sponsorId: row.SPONSOR_ID,
                        companyName: row.COMPANY_NAME,
                    });
                });

                // Assemble drivers data
                const drivers = driverRows.map(driver => ({
                    userId: driver.USER_ID,
                    username: driver.USERNAME,
                    email: driver.EMAIL,
                    timeCreated: driver.TIME_CREATED,
                    firstName: driver.F_NAME,
                    lastName: driver.L_NAME,
                    phoneNumber: driver.PHONENUM,
                    payment: driver.PAYMENT,
                    userType: driver.USER_TYPE,
                    address: {
                        street: driver.STREET,
                        city: driver.CITY,
                        state: driver.STATE,
                        zipCode: driver.ZIP_CODE,
                        country: driver.COUNTRY,
                    },
                    driver: {
                        pointTotal: driverPointsMap[driver.USER_ID] || 0,
                        sponsors: driverSponsorsMap[driver.USER_ID] || [],
                    },
                }));

                console.log(`Returning data for ${drivers.length} drivers.`);

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({ drivers: drivers }),
                };
            } catch (error) {
                console.error("Error fetching drivers:", error);
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({ message: 'Internal server error' }),
                };
            }
        } else if (path.endsWith('/users')) {
            try {
                let userRows;
                // Corrected SQL Query using LEFT JOIN
                [userRows] = await connection.query(
                    `SELECT 
                        USERS.USER_ID, 
                        USERS.USERNAME, 
                        USERS.EMAIL, 
                        USERS.TIME_CREATED, 
                        USERS.F_NAME, 
                        USERS.L_NAME, 
                        USERS.PHONENUM,  
                        USERS.USER_TYPE,
                        ADDRESS.STREET, 
                        ADDRESS.CITY, 
                        ADDRESS.STATE, 
                        ADDRESS.ZIP_CODE,
                        ADDRESS.COUNTRY
                     FROM USERS
                     LEFT JOIN ADDRESS ON USERS.ADDRESS_ID = ADDRESS.ADDRESS_ID`
                );

                console.log(`Number of users fetched: ${userRows.length}`);

                if (userRows.length === 0) {
                    console.warn("No users found in the database.");
                    return {
                        statusCode: 200, // Changed from 210 to 200 for standard HTTP status
                        headers: corsHeaders,
                        body: JSON.stringify({ users: [] }),
                    };
                } else {
                    return {
                        statusCode: 200,
                        headers: corsHeaders,
                        body: JSON.stringify({ users: userRows }),
                    };
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({ message: 'Internal server error' }),
                };
            }
        } else {
            console.log("Fetching a specific user by username.");

            // Existing code to fetch a specific user by username

            // Extract Query Parameters
            const username = event.queryStringParameters && event.queryStringParameters.username;

            if (!username) {
                console.error("Username is required to retrieve user information");
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({ message: 'Username is required' }),
                };
            }

            console.log(`Fetching data for username: ${username}`);

            // Fetch User Data from USERS and ADDRESS tables
            const [userRows] = await connection.execute(
                `SELECT 
                    USERS.USER_ID, 
                    USERS.USERNAME, 
                    USERS.EMAIL, 
                    USERS.TIME_CREATED, 
                    USERS.F_NAME, 
                    USERS.L_NAME, 
                    USERS.PHONENUM, 
                    USERS.PAYMENT, 
                    USERS.USER_TYPE,
                    ADDRESS.STREET, 
                    ADDRESS.CITY, 
                    ADDRESS.STATE, 
                    ADDRESS.ZIP_CODE,
                    ADDRESS.COUNTRY
                 FROM USERS
                 LEFT JOIN ADDRESS ON USERS.ADDRESS_ID = ADDRESS.ADDRESS_ID
                 WHERE USERS.USERNAME = ?`,
                [username]
            );

            console.log(`User rows fetched: ${userRows.length}`);

            if (userRows.length === 0) {
                console.warn(`User not found: ${username}`);
                return {
                    statusCode: 404,
                    headers: corsHeaders,
                    body: JSON.stringify({ message: 'User not found' }),
                };
            }

            const user = userRows[0];
            console.log(`User found: ${user.USERNAME} (ID: ${user.USER_ID})`);

            // Initialize userData with basic information
            const userData = {
                userId: user.USER_ID,
                username: user.USERNAME,
                email: user.EMAIL,
                timeCreated: user.TIME_CREATED,
                firstName: user.F_NAME,
                lastName: user.L_NAME,
                phoneNumber: user.PHONENUM,
                payment: user.PAYMENT,
                userType: user.USER_TYPE,
                address: {
                    street: user.STREET,
                    city: user.CITY,
                    state: user.STATE,
                    zipCode: user.ZIP_CODE,
                    country: user.COUNTRY,
                },
            };

            console.log(`User data initialized: ${JSON.stringify(userData)}`);

            // Fetch Subtype Data Based on USER_TYPE
            switch (user.USER_TYPE.toLowerCase()) {
                case 'driver':
                    try {
                        // Fetch POINT_TOTAL from DRIVERS table
                        const [driverRows] = await connection.execute(
                            `SELECT POINT_TOTAL FROM DRIVERS WHERE DRIVER_ID = ?`,
                            [user.USER_ID]
                        );
                        console.log(`Driver rows fetched: ${driverRows.length}`);
                        if (driverRows.length > 0) {
                            userData.driver = {
                                pointTotal: driverRows[0].POINT_TOTAL,
                            };
                            console.log(`Driver data: ${JSON.stringify(userData.driver)}`);
                        } else {
                            userData.driver = { pointTotal: 0 };
                        }

                        // Fetch Sponsors associated with the Driver
                        const [sponsorRows] = await connection.execute(
                            `SELECT 
                                SPONSOR.SPONSOR_ID, 
                                SPONSOR.COMPANY_NAME
                             FROM SPONSOR_DRIVERS
                             JOIN SPONSOR ON SPONSOR_DRIVERS.SPONSOR_ID = SPONSOR.SPONSOR_ID
                             WHERE SPONSOR_DRIVERS.DRIVER_ID = ? AND SPONSOR_DRIVERS.ASSOCIATE_STATUS = 'ACTIVE'`,
                            [user.USER_ID]
                        );
                        console.log(`Sponsor rows fetched: ${sponsorRows.length}`);

                        if (sponsorRows.length > 0) {
                            userData.driver.sponsors = sponsorRows.map(row => ({
                                sponsorId: row.SPONSOR_ID,
                                companyName: row.COMPANY_NAME,
                            }));
                            console.log(`Driver sponsors: ${JSON.stringify(userData.driver.sponsors)}`);
                        } else {
                            userData.driver.sponsors = [];
                        }
                    } catch (driverError) {
                        console.error("Error fetching driver data:", driverError);
                        // Optionally, continue without driver data or set default
                        userData.driver = { pointTotal: 0, sponsors: [] };
                    }
                    break;

                case 'sponsor':
                    try {
                        // Fetch COMPANY_NAME from SPONSOR table
                        const [sponsorRows] = await connection.execute(
                            `SELECT COMPANY_NAME FROM SPONSOR WHERE SPONSOR_ID = ?`,
                            [user.USER_ID]
                        );

                        if (sponsorRows.length > 0) {
                            userData.sponsor = {
                                companyName: sponsorRows[0].COMPANY_NAME,
                                drivers: [], // Initialize drivers array
                            };
                        }

                        // Fetch Drivers associated with the Sponsor
                        const [driverRows] = await connection.execute(
                            `SELECT 
                                USERS.USER_ID, 
                                USERS.USERNAME, 
                                USERS.F_NAME, 
                                USERS.L_NAME,
                                USERS.PHONENUM,
                                USERS.EMAIL,
                                DRIVERS.POINT_TOTAL
                            FROM SPONSOR_DRIVERS
                            JOIN USERS ON SPONSOR_DRIVERS.DRIVER_ID = USERS.USER_ID
                            LEFT JOIN DRIVERS ON USERS.USER_ID = DRIVERS.DRIVER_ID
                            WHERE SPONSOR_DRIVERS.SPONSOR_ID = ? AND SPONSOR_DRIVERS.ASSOCIATE_STATUS = 'ACTIVE'`,
                            [user.USER_ID]
                        );

                        if (driverRows.length > 0) {
                            userData.sponsor.drivers = driverRows.map(row => ({
                                driverId: row.USER_ID,
                                username: row.USERNAME,
                                firstName: row.F_NAME,
                                lastName: row.L_NAME,
                                pointTotal: row.POINT_TOTAL,
                                email: row.EMAIL,
                                phoneNumber: row.PHONENUM
                            }));
                        }
                    } catch (sponsorError) {
                        console.error("Error fetching sponsor data:", sponsorError);
                    }
                    break;

                case 'admin':
                    try {
                        const [adminRows] = await connection.execute(
                            `SELECT PERMISSIONS FROM ADMIN WHERE ADMIN_ID = ?`,
                            [user.USER_ID]
                        );
                        console.log(`Admin rows fetched: ${adminRows.length}`);
                        if (adminRows.length > 0) {
                            userData.admin = {
                                permissions: adminRows[0].PERMISSIONS,
                            };
                            console.log(`Admin data: ${JSON.stringify(userData.admin)}`);
                        }
                    } catch (adminError) {
                        console.error("Error fetching admin data:", adminError);
                    }
                    break;

                case 'dev':
                    try {
                        const [devRows] = await connection.execute(
                            `SELECT FirstName, LastName, Description FROM DEVS WHERE DEV_ID = ?`,
                            [user.USER_ID]
                        );
                        console.log(`Dev rows fetched: ${devRows.length}`);
                        if (devRows.length > 0) {
                            userData.dev = {
                                firstName: devRows[0].FirstName,
                                lastName: devRows[0].LastName,
                                description: devRows[0].Description,
                            };
                            console.log(`Dev data: ${JSON.stringify(userData.dev)}`);
                        }
                    } catch (devError) {
                        console.error("Error fetching dev data:", devError);
                    }
                    break;

                default:
                    console.warn("Unknown USER_TYPE:", user.USER_TYPE);
            }

            console.log(`Final user data to return: ${JSON.stringify(userData)}`);

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ user: userData }),
            };
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    } finally {
        if (connection) {
            try {
                await connection.end();
                console.log("Database connection closed.");
            } catch (closeError) {
                console.error("Error closing database connection:", closeError);
            }
        }
    }
};
