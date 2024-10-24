// src/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { cognitoConfig } from './cognitoConfig';

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          console.log('Error retrieving session:', err);
          setUser(null);
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const formatPhoneNumber = (phoneNumber, countryCode = '+1') => {
    // Remove any non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
  
    // Add country code
    if (!cleaned.startsWith(countryCode.replace('+', ''))) {
      cleaned = `${countryCode}${cleaned}`;
    }
  
    return `+${cleaned}`;
  };



  const login = (identifier, password) => {
    return new Promise((resolve, reject) => {
      const authDetails = new AuthenticationDetails({
        Username: identifier, // Can be email or username 
        Password: password,
      });
  
      const cognitoUser = new CognitoUser({
        Username: identifier, 
        Pool: userPool,
      });
  
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          setUser(cognitoUser);
          resolve(session);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };
  
  const signOut = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
      setUser(null);
    }
  };

  const register = (username, password, email, firstName, lastName, phoneNumber, addressLine, city, zip, state) => {
    return new Promise((resolve, reject) => {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);


      const attributeList = [
        { Name: 'email', Value: email },                // Standard attribute
        { Name: 'phone_number', Value: formattedPhoneNumber },   // Standard attribute
        { Name: 'custom:firstName', Value: firstName }, // Custom attribute
        { Name: 'custom:lastName', Value: lastName },   // Custom attribute
        { Name: 'custom:addressLine', Value: addressLine }, // Custom attribute
        { Name: 'custom:city', Value: city },           // Custom attribute
        { Name: 'custom:zipcode', Value: zip },         // Custom attribute
        { Name: 'custom:state', Value: state }          // Custom attribute
      ];
  
      userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
          if(err.code === 'InvalidParameterException')
          {
            alert("Not all required fields are filled out. Please fill all text boxes and resubmit.")
          } else if (err.code === 'UsernameExistsException') {
            alert("Username already exists")
          } else {
            alert(err);
          }
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
  

  return (
    <AuthContext.Provider value={{ user, loading, login, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
