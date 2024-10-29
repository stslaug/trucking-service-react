import React from 'react';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext'


const ProtectedRoute = ({ target, alternativeContent, user }) => {
  // If the user is logged in, render the target (actual page)
  if (user) {

    return (
    <div>
        <>{target}</>
    </div>
    );

  } else {
        // If the user is not logged in, display the alternative content
         return <>{alternativeContent}</>;
  }

};

export default ProtectedRoute;
