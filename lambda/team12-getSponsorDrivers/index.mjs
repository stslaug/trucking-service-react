import mysql from 'mysql2/promise';

export const handler = async (event) => {
    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    let connection;

    try {
        console.log("Incoming event:", JSON.stringify(event));

        // Handle CORS Preflight
        if (event.httpMethod === 'OPTIONS') {
            console.log("Handling CORS preflight (OPTIONS) request.");
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'CORS preflight check successful' }),
            };
        }

        // Ensure HTTP method is GET
        if (event.httpMethod !== 'GET') {
            console.warn(`Unsupported HTTP method: ${event.httpMethod}`);
            return {
                statusCode: 405,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
        }

        // Validate sponsorId parameter
        const sponsorId = event.queryStringParameters && event.queryStringParameters.sponsorId;
        if (!sponsorId) {
            console.error("Sponsor ID is missing.");
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Bad Request: sponsorId is required' }),
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

        // Query the SPONSOR_DRIVERS table for active entries
        const [rows] = await connection.query(
            `SELECT SP_DR_ID, DRIVER_ID 
             FROM SPONSOR_DRIVERS 
             WHERE SPONSOR_ID = ? AND ASSOCIATE_STATUS = 'ACTIVE'`,
            [sponsorId]
        );

        console.log(`Fetched ${rows.length} entries for sponsor ID ${sponsorId}`);

        // Return the results
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ drivers: rows }),
        };
    } catch (error) {
        console.error("Error fetching sponsor drivers:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Internal Server Error' }),
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
