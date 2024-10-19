import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { useLocation } from 'react-router-dom';
import './css/verifyCode.css';
import { AuthContext } from './AuthContext';
import { cognitoConfig } from './cognitoConfig';
import axios from 'axios';


const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});

const VerifyCode = () => {
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || '');
  const [password] = useState(location.state?.password || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [buttonState, setButtonState] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerification = (event) => {
    event.preventDefault();

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }
      console.log('Verification successful: ', result);
      login(username, password);
      navigate('/');
    });
  };

  const callLambda = async () => {
    try {
      setButtonState(true);
  
      const response = await axios.post(
        'https://kej65tnku5.execute-api.us-east-1.amazonaws.com/default/team12-cognito-verificationEmail',{
          username: username,
          clientId: cognitoConfig.ClientId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Log the response for all status codes, including 204
      console.log('Lambda response:', response.status, response.data);
  
      if (response.status !== 204) {
        console.log('Lambda response:', response.data);
      } else {
        console.log('No content in Lambda response');
      }
  
      setTimeout(() => setButtonState(false), 15000);
  
    } catch (error) {
      console.error('Error calling Lambda:', error.response ? error.response.data : error.message);
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
            <div className="inlineInputButton" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <div 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ display: 'inline' }} // Ensure the hover effect captures mouse events
              >
                <button
                  disabled={buttonState}
                  onClick={callLambda}
                  type="button"
                  className="resend"
                >
                  Resend
                </button>

                {/* Show tooltip when hovered, even if the button is disabled */}
                {isHovered && (
                  <div className="tooltip">
                    The verification code may take a few minutes to arrive. You can resend this code in another 30 seconds.
                  </div>
                )}
              </div>
            </div>
          </label>

          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;
