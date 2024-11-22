import React, { createContext, useEffect, useState } from 'react';
import { CognitoUser, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: process.env.REACT_APP_USER_POOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID,
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null); // New state for username
  const [loading, setLoading] = useState(true);
  const [dbUser, setDBUser] = useState(null);

  useEffect(() => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          console.log('Error retrieving session:', err);
          setUser(null);
          setUsername(null);
        } else {
          const username = currentUser.getUsername();
          setUser(currentUser);
          setUsername(username); // Set username
          fetchUserProfile(username);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const formatPhoneNumber = (phoneNumber, countryCode = '+1') => {
    let cleaned = phoneNumber.replace(/\D/g, '');
    if (!cleaned.startsWith(countryCode.replace('+', ''))) {
      cleaned = `${countryCode}${cleaned}`;
    }
    return `+${cleaned}`;
  };

  const login = (identifier, password) => {
    return new Promise((resolve, reject) => {
      const authDetails = new AuthenticationDetails({
        Username: identifier,
        Password: password,
      });
  
      const cognitoUser = new CognitoUser({
        Username: identifier,
        Pool: userPool,
      });
  
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          const username = cognitoUser.getUsername();
          setUser(cognitoUser);
          setUsername(cognitoUser.getUsername()); // Set username on login
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
      setUsername(null); // Clear username on sign-out
    }
  };

  const register = (username, password, email, firstName, lastName, phoneNumber, addressLine, city, zip, state) => {
    return new Promise((resolve, reject) => {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      const attributeList = [
        { Name: 'email', Value: email },
        { Name: 'phone_number', Value: formattedPhoneNumber },
        { Name: 'custom:firstName', Value: firstName },
        { Name: 'custom:lastName', Value: lastName },
        { Name: 'custom:addressLine', Value: addressLine },
        { Name: 'custom:city', Value: city },
        { Name: 'custom:zipcode', Value: zip },
        { Name: 'custom:state', Value: state }
      ];
  
      userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
          if(err.code === 'InvalidParameterException') {
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

  // Grabs the user from the database
  const fetchUserProfile = async (username) => {
    if (!username) {
      console.log("Database Retrieval Failed. Contact Administrator | AuthContext.js");
      return;
    }
  
    try {
      const response = await fetch(
        `https://90f2jdh036.execute-api.us-east-1.amazonaws.com/default/team12-getUsers?username=${username}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json', // Specify expected response format
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        let parsedData = null;
  
        if (data.body) {
          try {
            parsedData = JSON.parse(data.body).user;
            console.log("Fetched user data from body:", parsedData);
          } catch (parseError) {
            console.error("Error parsing response body:", parseError);
            return;
          }
        } else if (data.user) {
          parsedData = data.user;
          console.log("Fetched user data directly:", parsedData);
        } else {
          console.error("Unexpected response structure:", data);
          return;
        }
  
        setDBUser(parsedData); // Set the fetched data to state
      } else {
        let errorMessage = `Failed to fetch user profile: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = `Error: ${errorData.message}`;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };




  return (
    <AuthContext.Provider value={{ user, dbUser, username, loading, login, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;