import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import './index.css'; 
import App from './App'; 
import reportWebVitals from './reportWebVitals';  

// Prepare the environment for Cornerstone
const prepareEnvironment = () => {
  if (typeof window !== 'undefined') {
    // Create cornerstone object if it doesn't exist
    window.cornerstone = window.cornerstone || {};
    
    // Add any global configuration needed for OHIF
    window.config = {
      routerBasename: '/',
      enableGoogleCloudAdapter: false,
      showLoadingIndicator: true
    };
  }
};

// Call preparation function
prepareEnvironment();

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <App />
);  

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();