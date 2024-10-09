import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./css/login.css";


const ForgotPassword = () => {

    const [step, setStep] = useState(1);  // Step 1 is for email input, Step 2 is for code and new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Add logic to send a code to the user's email
    setStep(2);  // Move to the next step
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    // Add logic to verify code and reset password
    console.log('Code:', code, 'New Password:', newPassword);
    setStep(3);
  };


  const navigate = useNavigate();
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        navigate('/'); // Redirect to home page
      }, 4000); // 4000 milliseconds = 5 seconds

      // Clean up the timer if the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);





    return (
        <div class="login-wrapper">
            <div class="login">
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <h2>Forgot Password</h2>
            <p>Send a code to your email to verify your identity</p>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Code</button>
          </form>
        )} 
        {step === 2 && (
          <form onSubmit={handlePasswordReset}>
            <h2>Reset Password</h2>
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