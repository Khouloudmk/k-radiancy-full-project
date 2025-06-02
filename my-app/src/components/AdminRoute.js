// Import React and useContext hook for accessing context values
import React, { useContext } from 'react';
// Import Navigate component to redirect users to a different route
import { Navigate } from 'react-router-dom';
// Import the Store context to access global state (such as user info)
import { Store } from '../Store';

// Define the AdminRoute component, which receives children components as props
export default function AdminRoute({ children }) {
  // Access the global state from the Store context
  const { state } = useContext(Store);
  // Destructure userInfo from the state for easier access
  const { userInfo } = state;
  // If userInfo exists and the user is an admin, render the children components
  // Otherwise, redirect the user to the "/signin" page
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
}