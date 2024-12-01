import mysql from 'mysql2/promise';

export const handler = async (event) => {
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    let connection;

    try {
        console.log("Incoming event:", event.queryStringParameters);

        const httpMethod = event.httpMethod;
        if (httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'CORS preflight check successful' }),
            };
        }

        if (httpMethod !== 'GET') {
            return {
                statusCode: 405,
                headers: corsHeaders,
                body: JSON.stringify({ message: `Method Not Allowed: ${httpMethod}` }),
            };
        }

        // Retrieve driverId from query string parameters
        const driverId = event.queryStringParameters?.driverId;

        if (!driverId) {
            console.error("Missing driverId in query string parameters.");
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Driver ID is required.' }),
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

        // Retrieve all orders for the specified driverId
        const [orders] = await connection.execute(
            `SELECT 
                o.ORDER_ID,
                o.ORDER_STATUS,
                o.ORDER_DATE,
                o.POINTS_USED,
                i.ITEM_ID,
                i.TITLE AS ITEM_TITLE,
                i.PRICE AS ITEM_PRICE
             FROM 
                ORDERS o
             LEFT JOIN 
                ORDER_ITEMS i
             ON 
                o.ORDER_ID = i.ORDER_ID
             WHERE 
                o.DRIVER_ID = ?
             ORDER BY 
                o.ORDER_DATE DESC`,
            [driverId]
        );

        console.log("Orders retrieved successfully:", orders);

        // Group items by order
        const groupedOrders = {};
        orders.forEach((order) => {
            const {
                ORDER_ID,
                ORDER_STATUS,
                ORDER_DATE,
                POINTS_USED,
                ITEM_ID,
                ITEM_TITLE,
                ITEM_PRICE,
            } = order;

            if (!groupedOrders[ORDER_ID]) {
                groupedOrders[ORDER_ID] = {
                    orderId: ORDER_ID,
                    status: ORDER_STATUS,
                    date: ORDER_DATE,
                    pointsUsed: POINTS_USED,
                    items: [],
                };
            }

            if (ITEM_ID) {
                groupedOrders[ORDER_ID].items.push({
                    itemId: ITEM_ID,
                    title: ITEM_TITLE,
                    price: ITEM_PRICE,
                });
            }
        });

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(Object.values(groupedOrders)),
        };
    } catch (error) {
        console.error("Error retrieving orders:", error);

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
