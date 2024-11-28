import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message, Dropdown } from 'semantic-ui-react';
import LoadingBar from 'react-top-loading-bar';
import axios from 'axios';

export default function Create() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  
  

  const validateFields = () => {
    if (!name || !role || !password) {
      setError('Please fill in all fields');
      setProgress(0);
      return false;
    }
    return true;
  };

  const postData = async () => {
    try {
      const response = await axios.post('/person', {
        name,
        role,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        const personId = response.data;

        if (personId) {
          localStorage.setItem('user', JSON.stringify({ id: personId, name, role }));
          window.idUser = personId;

          setSuccess(true);
          setError('');

          try {
            const secondResponse = await axios.post(`/device/${window.idUser}`, {
              personId, 
              name,
              role,
            });
            if (secondResponse.status !== 200) {
              console.warn("Second API call failed with status:", secondResponse.status);
            }
          } catch (secondError) {
            console.error("Error in second API call:", secondError);
            setError("User created, but there was an error with the second operation.");
          }

          
          setTimeout(() => {
            if (role === 'user') {
              navigate('/DevicePersonPage'); 
            } else {
              navigate('/choice'); 
            }
          }, 1000);
        } else {
          setError('Failed to retrieve user ID from the server.');
        }
      }
    } catch (error) {
      console.error('Error posting data:', error);
      if (error.response) {
        if (error.response.status === 409) {
          setError('Username already exists. Please choose a different name.');
        } else {
          setError(error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`);
        }
      } else {
        setError('Failed to create user. Please check your network connection or try again.');
      }
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    setProgress(50);
    setError('');
    setSuccess(false);

    if (validateFields()) {
      postData();
    }
  };

  const roleOptions = [
    { key: 'admin', text: 'Admin', value: 'admin' },
    { key: 'user', text: 'User', value: 'user' },
  ];

  return (
    <div>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {error && <Message negative>{error}</Message>}
      {success && <Message positive>User created successfully!</Message>}
      <Form className="create-form" onSubmit={handleButtonClick}>
        <Form.Field>
          <label>Name</label>
          <input
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Role</label>
          <Dropdown
            placeholder='Select Role'
            fluid
            selection
            options={roleOptions}
            value={role}
            onChange={(e, { value }) => setRole(value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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