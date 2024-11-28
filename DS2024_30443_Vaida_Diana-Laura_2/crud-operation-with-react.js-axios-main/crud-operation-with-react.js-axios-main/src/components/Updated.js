import React, { useEffect, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import axios from 'axios';

export default function Update() {
  const [id, setID] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(0);
  const history = useNavigate();

  useEffect(() => {
   
    const loggedInUser = JSON.parse(localStorage.getItem('user')); 
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      history('/'); 
    }

    setID(localStorage.getItem('ID'));
    setName(localStorage.getItem('Name')); 
    setRole(localStorage.getItem('Role')); 
    setPassword(localStorage.getItem('Password')); 
  }, [history]);

  const updateAPIData = () => {
    axios.put(`/person/${id}`, { 
      name,
      role,
      password,
    })
    .then(() => {
      history('/read');
    })
    .catch((error) => {
      console.error('Error updating data:', error);
    });
  }

  const handleButtonClick = () => {
    setProgress(100); 
    updateAPIData();  
  }

  return (
    <div>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)} 
      />
      <Form className="update-form" onSubmit={(e) => e.preventDefault()}>
        <Form.Field>
          <label>ID</label>
          <input placeholder='ID' value={id} disabled />
        </Form.Field>
        <Form.Field>
          <label>Name</label>
          <input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Role</label>
          <input placeholder='Role' value={role} onChange={(e) => setRole(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            type='password' 
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Field>
        <Button type='submit' onClick={handleButtonClick}>Update</Button>
      </Form>
    </div>
  );
}