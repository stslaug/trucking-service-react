import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthContext } from './AuthContext';
import { cognitoConfig } from './cognitoConfig';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import '../pages/css/login.css';


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
      navigate('/login');
    });
  };

  const callLambda = async () => {
    try {
      setButtonState(true);
      setTimeout(() => setButtonState(false), 30000); //30 seconds prevent spamming

      let data = JSON.stringify({
        clientId: cognitoConfig.ClientId,
        username: username
      });
  
      // Define the request
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://kej65tnku5.execute-api.us-east-1.amazonaws.com/default/team12-cognito-verificationEmail',
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
      };
  
      // Send the request using axios
      const response = await axios.request(config);
  
      // Log the response (handle cases where there might be no data)
      console.log('Lambda response:', response.status, response.data || 'No content');
  
      setTimeout(() => setButtonState(false), 30000); //30 seconds prevent spamming
  
    } catch (error) {
      if(error.code === 'LimitExceededException')
      { // If Cognito's Email Limit is Exceeded
        alert("Error (LimitExceededException) sending email: Please contact system Administrators");
      }
      else
      {
        console.error('Error calling Lambda:', error.response ? error.response.data : error.message);
      }
    }
  };
  
  
  

  return (
    <div className="login-wrapper">
      <div className="login" id="verify">
        <h2>Verify Your Account</h2>
        <p>A verification code should arrive in your inbox shortly if the account exists. Be sure to check your spam or junk folders.</p>
        <form onSubmit={handleVerification}>
          <label>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
            />
          </label>
          <label>
              <input
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}/>
        
          </label>

       
          {buttonState && (
          <p className="errorText">If an account exists, the verification code may take a few minutes to arrive.
          You can resend this code in another 30 seconds.</p>
          )}

          <div className="form-wrapper" style={ {width: '100%' }}>
            <button
                  disabled={buttonState}
                  onClick={callLambda}
                  type="button"
                  className="resend leftCol">
                      Resend Code
                </button>
          <button type="submit" className="rightCol">Verify</button>
          </div>
        </form>
        { error && 
        (<p className="errorText">The verification code provided is incorrect, or doesn't correspond to the username/email provided.</p>)
        }
      </div>
    </div>
  );
};

export default VerifyCode;
