import {
    ResendConfirmationCodeCommand,
    CognitoIdentityProviderClient,
  } from "@aws-sdk/client-cognito-identity-provider";
  
  // Create the Cognito client
  const client = new CognitoIdentityProviderClient({});
  
  
  export const handler = async (event) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
    };
  
    console.log('Received event:', JSON.stringify(event)); // Log the event
  
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 201,
        headers: headers,
        body: JSON.stringify({}),
      };
    }
  
    if (!event.body) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ error: 'Request body is required.' }),
      };
    }
  
    const { clientId, username } = JSON.parse(event.body);
  
    console.log('Parsed body:', { clientId, username }); // Log the parsed body
  
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: clientId,
        Username: username,
      });
  
      await client.send(command);
      console.log('Command sent successfully'); // Log successful send
  
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ message: 'Confirmation code resent successfully.' }),
      };
    } catch (error) {
      console.error('Error resending confirmation code:', error); // Log the error
  
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
  