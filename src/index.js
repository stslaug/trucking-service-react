import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM.createRoot for React 18+
import App from './App'; // Import your main App component

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: '1eg3b3nk6nros25epjlh1feleu',
      userPoolId: 'us-east-1_3iUzSeYng',
      loginWith: {
        username: 'true',
        email: 'true',
      }
    }
  }
});


// Create a root for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in React.StrictMode
root.render(
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);
