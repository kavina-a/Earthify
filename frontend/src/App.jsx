import React from 'react'; 
import { Outlet } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
// import Navigation from './pages/Auth/Navigation';
import './index.css';

// Main App component 
function App() { 
  return ( 
    <> 
    {/* <Navigation /> */}
    
      {/* Main Content Area */}
        {/* Outlet will render matching routes */}
        <Outlet /> 
        {/* //!this is the main content area where the routes will be rendered whenever the user navigates to a new route */}

      {/* Toast container for displaying toasts */}
      <ToastContainer /> 
    </>
  ); 
}

export default App;