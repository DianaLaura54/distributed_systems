import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import {jwtDecode} from 'jwt-decode'; 

const Choice2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); 
      return;
    }

    try {
     
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role; 

  
      if (role !== 'admin') {
        navigate('/'); 
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/login'); 
    }
  }, [navigate]);

  return (
    <div className="choice-container">
      <h1>Choose an Option (users)</h1>
      <div className="button-group">
        <Button primary onClick={() => navigate('/create')}>Create</Button>
        <Button secondary onClick={() => navigate('/read')}>Read</Button>
      </div>
    </div>
  );
};

export default Choice2;
