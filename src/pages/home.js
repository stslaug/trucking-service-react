import React, { useEffect, useState } from 'react';
import "./css/general.css";

import { Amplify } from 'aws-amplify';

import { getCurrentUser } from 'aws-amplify/auth';


// configure Amplify
Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: '1eg3b3nk6nros25epjlh1feleu',
        userPoolId: 'us-east-1_3iUzSeYng'
      }
    }
  });

const Home = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const { username, userId, signInDetails } = await getCurrentUser();
                setCurrentUser({ username, userId, signInDetails });
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        }

        fetchCurrentUser();
    }, []);

    return (
        <div>
            <header>
                <h1>Home</h1>
                <p>Haul of Fame React Page</p>
            </header>
            <div>{currentUser && (
                    <div>
                        <h1>Welcome {currentUser.username}!</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;