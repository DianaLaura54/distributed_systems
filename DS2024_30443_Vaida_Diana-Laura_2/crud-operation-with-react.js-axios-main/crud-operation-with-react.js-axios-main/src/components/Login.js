// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (name === '' || password === '' || role === '') {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('/person/login', {
        name,
        password,
        role, 
      });

      console.log('Login API response:', response.data);

      if (response.status === 200) {
        const personData = response.data;

        localStorage.setItem('user', JSON.stringify(personData));

        window.idUser = personData.id; 

        // Print the user ID to the console
        console.log('User ID:', personData.id);

        if (personData.role.toLowerCase() === 'admin') {
          navigate('/choice');
        } else if (personData.role.toLowerCase() === 'user') {
          navigate('/DevicePersonPage');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        console.error('Error during login:', error);
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        {error && <Message negative>{error}</Message>}
        <Form.Field>
          <label>Name</label>
          <input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Role</label>
          <input
            placeholder="Enter your role (e.g., admin, user)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </Form.Field>
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
    </div>
  );
}

export default Login;