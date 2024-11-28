import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const Choice2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
   
    const loggedInUser = JSON.parse(localStorage.getItem('user')); 
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      navigate('/'); 
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