import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation after verification
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { useLocation } from 'react-router-dom';
import './css/verifyCode.css';
import { AuthContext } from './AuthContext';
import { cognitoConfig } from './cognitoConfig';


const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});

const VerifyCode = () => {
  const { login } = useContext(AuthContext);
  const location = useLocation(); // Get the location object
  const [username, setUsername] = useState(location.state?.username || '');
  const [password] = useState(location.state?.password || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // for navigation

  const handleVerification = (event) => {
    event.preventDefault();

    const userData = {
      Username: username,
      Pool: userPool
    };
    
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }
      console.log('Verification successful: ', result);
      login(username, password);
      // Redirect to login or another page after successful verification
      navigate('/');
    });
  };


  const callLambda = async () => {
    try {
      const response = await fetch(
        'https://kej65tnku5.execute-api.us-east-1.amazonaws.com/default/team12-cognito-verificationEmail',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username, clientId: cognitoConfig.ClientId }),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
  
      // Ensure you parse JSON only if there's content in the response
      const result = response.status !== 204 ? await response.json() : null;
  
      if (result) {
        console.log('Lambda response:', result);
      } else {
        console.log('No content in Lambda response');
      }
    } catch (error) {
      console.error('Error calling Lambda:', error);
    }
  };
  

  return (
    <div className="verify-wrapper">
        <div className="verify">
      <h2>Verify Your Account</h2>
      <form onSubmit={handleVerification}>
        <label>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </label>
        <label>
          <div className="inlineInputButton">
          <input 
            type="text" 
            placeholder="Verification Code" 
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required 
          />
          <button onClick={callLambda} type="button" className="resend">Resend</button>
          </div>
        </label>

        <button type="submit">Verify</button>
      </form>
    </div>
    </div>
  );
};

export default VerifyCode;
