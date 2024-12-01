import mysql from 'mysql2/promise';

export const handler = async (event) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  };

  let connection;

  try {
    console.log('Incoming event:', JSON.stringify(event));

    // Handle CORS Preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'CORS preflight check successful' }),
      };
    }

    if (!['POST', 'DELETE'].includes(event.httpMethod)) {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the request body
    const body = JSON.parse(event.body);
    const { action, sponsorId, driverId, sponsorUsername, driverUsername } = body;

    if (!action || (!sponsorId && !sponsorUsername) || (!driverId && !driverUsername)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Missing required parameters' }),
      };
    }

    // Establish Database Connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Database connection established.');

    // Get Sponsor ID if sponsorUsername is provided
    let sponsorID = sponsorId;
    if (!sponsorID && sponsorUsername) {
      const [sponsorRows] = await connection.execute(
        'SELECT USER_ID FROM USERS WHERE USERNAME = ? AND USER_TYPE = ?',
        [sponsorUsername, 'SPONSOR']
      );

      if (sponsorRows.length === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Sponsor not found' }),
        };
      }

      sponsorID = sponsorRows[0].USER_ID;
    }

    // Get Driver ID if driverUsername is provided
    let driverID = driverId;
    if (!driverID && driverUsername) {
      const [driverRows] = await connection.execute(
        'SELECT USER_ID FROM USERS WHERE USERNAME = ? AND USER_TYPE = ?',
        [driverUsername, 'DRIVER']
      );

      if (driverRows.length === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Driver not found' }),
        };
      }

      driverID = driverRows[0].USER_ID;
    }

    // Verify Sponsor exists
    const [sponsorRows] = await connection.execute(
      'SELECT SPONSOR_ID FROM SPONSOR WHERE SPONSOR_ID = ?',
      [sponsorID]
    );

    if (sponsorRows.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Sponsor not found' }),
      };
    }

    // Verify Driver exists
    const [driverRows] = await connection.execute(
      'SELECT DRIVER_ID FROM DRIVERS WHERE DRIVER_ID = ?',
      [driverID]
    );

    if (driverRows.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Driver not found' }),
      };
    }

    if (event.httpMethod === 'DELETE') {
      // Set relationship to INACTIVE
      const [relationRows] = await connection.execute(
        'SELECT SP_DR_ID FROM SPONSOR_DRIVERS WHERE SPONSOR_ID = ? AND DRIVER_ID = ? AND ASSOCIATE_STATUS = ?',
        [sponsorID, driverID, 'ACTIVE']
      );

      if (relationRows.length === 0) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Active relationship not found' }),
        };
      }

      await connection.execute(
        'UPDATE SPONSOR_DRIVERS SET ASSOCIATE_STATUS = ? WHERE SP_DR_ID = ?',
        ['INACTIVE', relationRows[0].SP_DR_ID]
      );

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Relationship set to INACTIVE' }),
      };
    }

    if (action === 'add') {
      // Check for existing relationship
      const [relationRows] = await connection.execute(
        'SELECT SP_DR_ID, ASSOCIATE_STATUS FROM SPONSOR_DRIVERS WHERE SPONSOR_ID = ? AND DRIVER_ID = ?',
        [sponsorID, driverID]
      );

      if (relationRows.length > 0) {
        const currentStatus = relationRows[0].ASSOCIATE_STATUS;
        if (currentStatus === 'ACTIVE') {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Relationship already exists' }),
          };
        } else {
          // Update existing relationship to ACTIVE
          await connection.execute(
            'UPDATE SPONSOR_DRIVERS SET ASSOCIATE_STATUS = ?, ASSOCIATE_DATE = NOW() WHERE SP_DR_ID = ?',
            ['ACTIVE', relationRows[0].SP_DR_ID]
          );
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Relationship updated to ACTIVE' }),
          };
        }
      } else {
        // Insert new relationship
        await connection.execute(
          'INSERT INTO SPONSOR_DRIVERS (SPONSOR_ID, DRIVER_ID, ASSOCIATE_DATE, ASSOCIATE_STATUS) VALUES (?, ?, NOW(), ?)',
          [sponsorID, driverID, 'ACTIVE']
        );
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Relationship added successfully' }),
        };
      }
    } else if (action === 'remove') {
      // Set relationship to INACTIVE
      const [relationRows] = await connection.execute(
        'SELECT SP_DR_ID FROM SPONSOR_DRIVERS WHERE SPONSOR_ID = ? AND DRIVER_ID = ? AND ASSOCIATE_STATUS = ?',
        [sponsorID, driverID, 'ACTIVE']
      );

      if (relationRows.length === 0) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Active relationship not found' }),
        };
      }

      await connection.execute(
        'UPDATE SPONSOR_DRIVERS SET ASSOCIATE_STATUS = ? WHERE SP_DR_ID = ?',
        ['INACTIVE', relationRows[0].SP_DR_ID]
      );
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Relationship set to INACTIVE' }),
      };
    } else {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Invalid action' }),
      };
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed.');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
};
