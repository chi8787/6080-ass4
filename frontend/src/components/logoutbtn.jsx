import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

function Logout ({ token, setToken }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          Authorization: token,
        }
      });
      setToken(null);
      navigate('/');
    } catch (error) {
      alert(error.response.data.error);
    }
  }
  return (
    <Button onClick={logout} style={{ position: 'absolute', top: '10px', right: '10px' }}>Logout</Button>
  );
}

export default Logout;
