import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const Choice3 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in and has the appropriate role
    const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      navigate('/'); // Redirect to home if not logged in or not admin
    }
  }, [navigate]);

  return (
    <div className="choice-container">
      <h1>Choose an Option (devices)</h1>
      <div className="button-group">
        <Button primary onClick={() => navigate('/create2')}>Create</Button>
        <Button secondary onClick={() => navigate('/read2')}>Read</Button>
      </div>
    </div>
  );
};

export default Choice3;