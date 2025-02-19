import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        console.log('Received token:', token); // Debug log

        if (!token) {
          console.error('No token received');
          navigate('/login');
          return;
        }

        // Decode and process the token
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded); // Debug log

        // Store token and update auth context
        localStorage.setItem('token', token);
        login(token);

        // Let the AuthContext handle the redirection
      } catch (error) {
        console.error('Callback processing error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [location.search, login, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-gray-600">Processing your login...</p>
      </div>
    </div>
  );
}

export default GoogleCallback;