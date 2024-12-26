import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import LoadingBar from 'react-top-loading-bar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function Mapping() {
  const [clientId, setClientId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem('token'); // Remove expired token
        navigate('/'); // Redirect to login
      } else if (decoded.role !== 'admin') {
        navigate('/'); // Redirect non-admin users to login
      }
    } catch (error) {
      console.error('Error decoding token:', error.message);
      localStorage.removeItem('token');
      navigate('/'); // Redirect on token error
    }
  }, [navigate]);

  const validateFields = () => {
    if (!clientId || !deviceId) {
      setError('Please fill in all fields');
      setProgress(0);
      return false;
    }
    return true;
  };

  const postMapping = async () => {
    const token = localStorage.getItem('token');
    try {
      setProgress(70); // Update progress before sending the request

      // Send the request to the API endpoint
      const response = await axios.post(
        `/device/person/insert/${clientId}/${deviceId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSuccess(true);
        setError('');
        setProgress(100); // Complete progress on success
        setTimeout(() => {
          navigate('/read3'); // Navigate after successful mapping
        }, 1000);
      } else {
        // If the request failed, reset progress and show error
        setProgress(0);
        setError('Failed to create mapping.');
      }
    } catch (error) {
      setProgress(0); // Reset progress on error
      console.error('Error posting mapping data:', error);

      if (error.response) {
        setError(
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`
        );
      } else {
        setError('Failed to create mapping. Please check your network connection or try again.');
      }
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    setProgress(30); // Start progress
    setError('');
    setSuccess(false);

    if (validateFields()) {
      postMapping();
    }
  };

  return (
    <div>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {error && <Message negative>{error}</Message>}
      {success && <Message positive>Mapping created successfully!</Message>}
      <Form className="mapping-form" onSubmit={handleButtonClick}>
        <Form.Field>
          <label>Client ID</label>
          <input
            placeholder='Client ID'
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Device ID</label>
          <input
            placeholder='Device ID'
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            required
          />
        </Form.Field>
        <Button type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
}