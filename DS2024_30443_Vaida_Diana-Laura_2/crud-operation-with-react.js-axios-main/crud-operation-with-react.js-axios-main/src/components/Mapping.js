import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import LoadingBar from 'react-top-loading-bar';
import axios from 'axios';

export default function Mapping() {
  const [clientId, setClientId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user')); 
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      navigate('/'); 
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
    try {
      setProgress(70); // Update progress before sending the request
      
      // Send requests to both endpoints in parallel using Promise.all
      const [response1, response2] = await Promise.all([
        axios.post(`/device/person/insert/${clientId}/${deviceId}`),
        axios.post(`/filereader/${clientId}/${deviceId}`)
      ]);
  
      // Handle both responses
      if (response1.status === 200 && response2.status === 200) {
        setSuccess(true);
        setError('');
        setProgress(100); // Complete progress on success
        setTimeout(() => {
          navigate('/read3'); // Navigate after successful mapping
        }, 1000);
      } else {
        // If any of the requests failed, reset progress and show error
        setProgress(0);
        setError('Failed to create mapping on one of the services.');
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