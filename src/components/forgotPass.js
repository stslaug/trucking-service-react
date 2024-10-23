import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { cognitoConfig } from './cognitoConfig';
import { AuthContext } from './AuthContext';

import "../pages/css/login.css";


const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});


const ForgotPassword = () => {
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState(1);  // Step 1 is for email input, Step 2 is for code and new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [error, setError] = useState('');


  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    // Request a password reset
    cognitoUser.forgotPassword({
      onSuccess: () => {
        setStep(2); // Move to step 2
      },
      onFailure: (err) => {
        if(err.code === 'LimitExceededException')
        {
          alert("Error (LimitExceededException) sending email: Please contact system Administrators");
        }
        else
        console.error(err);
        setError(err.message || JSON.stringify(err));
      }
      });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();

    if (newPassword !== confPassword) {
      setError("Passwords do not match!");
      return;
    }
const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    // Confirm the new password
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        setStep(3); // Move to step 3
      },
      onFailure: (err) => {
        console.error(err);
        setError(err.message || JSON.stringify(err));
      },
    });
  };


  const navigate = useNavigate();
  useEffect(() => {
    if (step === 3) {
      login(email, newPassword);
      const timer = setTimeout(() => {
        navigate('/'); // Redirect to home page
      }, 4000); // 4 Second wait time
      return () => clearTimeout(timer);
    }
  }, [step, navigate, login, email, newPassword]);





    return (
        <div class="login-wrapper">
            <div class="login" id="forgot">
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <h2>Forgot Password</h2>
            <p>If an account exists, we will send a code to your email to verify your identity. It should arrive momentarily.</p>
            <input
              type="text"
              value={email}
              placeholder="Email or Username"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Code</button>
          </form>
        )} 
        {step === 2 && (
          <form onSubmit={handlePasswordReset}>
            <h2>Reset Password</h2>
            <p>The verification code may take a few minutes to arrive.</p>
            <input
              type="text"
              value={code}
              placeholder="Verification Code"
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              type="password"
              value={newPassword}
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              value={confPassword}
              placeholder="Confirm New Password"
              onChange={(e) => setConfPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        )}
        {step === 3 && (
            <>
            <h2>Password Successfully Reset</h2>
            <p>You will be redirected to our home page momentarily.</p>
            <Link to="/" className="btn btn-primary create">If not automatically redirected, please click here</Link>
            </>
          )}
        </div>
      </div>
    );
};

export default ForgotPassword;