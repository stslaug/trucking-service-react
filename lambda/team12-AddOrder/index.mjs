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

        const { driverId, totalPoints, items } = data;

        // Validate input
        if (!driverId || totalPoints == null || !items || !Array.isArray(items) || items.length === 0) {
            console.error("Missing or invalid required fields:", { driverId, totalPoints, items });
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Driver ID, total points, and items are required.' }),
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

        // Insert the order into the ORDERS table
        const [orderResult] = await connection.execute(
            `INSERT INTO ORDERS (DRIVER_ID, ORDER_STATUS, POINTS_USED, ITEMS) 
             VALUES (?, 'PENDING', ?, ?)`,
            [driverId, totalPoints, JSON.stringify(items)]
        );

        const orderId = orderResult.insertId; // Get the generated order ID
        console.log("Order ID generated:", orderId);

        // Insert each item into the ORDER_ITEMS table
        const itemInsertPromises = items.map((item) => {
            return connection.execute(
                `INSERT INTO ORDER_ITEMS (ORDER_ID, ITEM_ID, TITLE, PRICE) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.itemId, item.title, parseFloat(item.price)]
            );
        });

        await Promise.all(itemInsertPromises);
        console.log("All items added successfully.");

        // Commit the transaction
        await connection.commit();
        console.log("Transaction committed successfully.");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Order and items added successfully.',
                orderId: orderId,
            }),
        };
    } catch (error) {
        console.error("Error processing request:", error);

        // Rollback the transaction in case of any error
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
