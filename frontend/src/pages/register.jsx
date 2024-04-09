import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Stack, TextField, Button, Typography } from '@mui/material';

function Register (props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        name, email, password
      });
      props.setTokenfunction(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response.data.error);
    }
  }

  function backtologin () {
    navigate('/');
  }

  return (
    <Container maxWidth="sm" style={{ minHeight: '100vh' }}>
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <Typography variant="h4" component="h2">
          Register
        </Typography>
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email address"
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="Enter your Password again"
          type="password"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={register}
          fullWidth
          style={{ margin: '10px 0' }}
        >
          Create account
        </Button>
        <Button
          variant="outlined"
          onClick={backtologin}
          fullWidth
          style={{ margin: '10px 0' }}
        >
          Back to Login
        </Button>
      </Stack>
    </Container>
  );
}

export default Register;
