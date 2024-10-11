import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM.createRoot for React 18+
import App from './App'; // Import your main App component
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider, not AuthContext

// Create a root for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in React.StrictMode
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Use AuthProvider to provide context */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
