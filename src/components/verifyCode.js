import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation after verification
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { useLocation } from 'react-router-dom';
import './css/verifyCode.css';
import { AuthContext } from './AuthContext';

const poolData = {
  UserPoolId: 'us-east-1_3iUzSeYng', // Your User Pool ID
  ClientId: '1eg3b3nk6nros25epjlh1feleu' // Your App Client ID
};

const userPool = new CognitoUserPool(poolData);

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
          <input 
            type="text" 
            placeholder="Verification Code" 
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required 
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Verify</button>
      </form>
    </div>
    </div>
  );
};

export default VerifyCode;
