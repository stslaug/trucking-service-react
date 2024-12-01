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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

        // Ensure Method is GET
        if (httpMethod !== 'GET') {
            return {
                statusCode: 405,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Method Not Allowed: ' + httpMethod }),
            };
        }

        // Get driverId from query parameters
        const driverId = event.queryStringParameters?.driverId;

        if (!driverId) {
            console.error("Driver ID is required.");
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Driver ID is required.' }),
            };
        }

        // Establish Database Connection
        connection = await mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName,
        });

        // Fetch Orders for the Driver
        const [orders] = await connection.execute(
            `SELECT ORDER_ID, PRODUCT_ID, ORDER_STATUS, ORDER_DATE, POINTS_USED 
             FROM ORDERS WHERE DRIVER_ID = ? ORDER BY ORDER_DATE DESC`,
            [driverId]
        );

        console.log(`Fetched ${orders.length} orders for DRIVER_ID ${driverId}`);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ orders }),
        };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Internal server error.' }),
        };
    } finally {
        if (connection) {
            await connection.end();
            console.log("Database connection closed.");
        }
    }
};
