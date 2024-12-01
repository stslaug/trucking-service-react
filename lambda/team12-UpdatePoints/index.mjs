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
        console.log("Incoming event:", event.body);

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
                body: JSON.stringify({ message: `Method Not Allowed: ${httpMethod}` }),
            };
        }

        // Parse the incoming request body
        const data = JSON.parse(event.body);
        console.log("Parsed request payload:", data);

        const { driverId, pointChange } = data;

        // Validate input
        if (!driverId || pointChange == null) {
            console.error("Missing required fields:", { driverId, pointChange });
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Driver ID and Point Change are required.' }),
            };
        }

        // Ensure pointChange is a number
        const pointChangeValue = parseInt(pointChange, 10);
        if (isNaN(pointChangeValue)) {
            console.error("Invalid pointChange value:", pointChange);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Invalid pointChange value.' }),
            };
        }

        // Establish database connection
        connection = await mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName,
        });
        console.log("Database connection established successfully.");

        // Begin a transaction
        await connection.beginTransaction();

        // Fetch the driver's current points
        const [driverRows] = await connection.execute(
            `SELECT POINT_TOTAL FROM DRIVERS WHERE DRIVER_ID = ?`,
            [driverId]
        );

        if (driverRows.length === 0) {
            console.error("Driver not found:", driverId);
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Driver not found.' }),
            };
        }

        const currentPoints = driverRows[0].POINT_TOTAL;
        console.log(`Driver's current points: ${currentPoints}`);

        // Calculate the new point total
        const newPointTotal = currentPoints + pointChangeValue;
        console.log(`New point total: ${newPointTotal}`);

        // Check if the new point total is negative
        if (newPointTotal < 0) {
            console.error("Insufficient points after deduction.");
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Insufficient points after deduction.' }),
            };
        }

        // Update the driver's points
        await connection.execute(
            `UPDATE DRIVERS SET POINT_TOTAL = ? WHERE DRIVER_ID = ?`,
            [newPointTotal, driverId]
        );
        console.log("Driver's points updated successfully.");

        // Commit the transaction
        await connection.commit();
        console.log("Transaction committed successfully.");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Points updated successfully.',
                updatedPointTotal: newPointTotal,
            }),
        };
    } catch (error) {
        console.error("Error processing request:", error);

        // Rollback transaction if any error occurs
        if (connection) {
            await connection.rollback();
        }

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
