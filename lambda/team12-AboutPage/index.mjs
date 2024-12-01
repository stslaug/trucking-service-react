import mysql from 'mysql2/promise';

export const handler = async (event) => {
    // Retrieve database connection details from environment variables
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;

    let connection;
    try {
        // Establish a connection to the RDS MySQL database
        connection = await mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPassword,
            database: dbName
        });
        console.log("Connected to the RDS MySQL database");

        const [rows] = await connection.execute('SELECT devID, FirstName, LastName, Description FROM Devs');
        
        // Map rows to the required format
        const developers = rows.map(row => ({
            devID: row.devID,
            FirstName: row.FirstName,
            LastName: row.LastName,
            Description: row.Description
        }));
        
        // Return the results from the database
        return {
            statusCode: 200,
            headers: {
            "Access-Control-Allow-Origin": "*", // Allow all domains
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT"
        },
            body: JSON.stringify(developers),
        };

    } catch (error) {
        console.error("Error connecting to the database:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error connecting to the database", error: error.message }),
        };
    } finally {
        // Ensure the database connection is closed
        if (connection) {
            await connection.end();
        }
    }
};

