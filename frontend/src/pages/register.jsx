import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Stack, TextField, Button, Typography, Alert } from '@mui/material';

function Register (props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        name, email, password
      });
      props.setTokenfunction(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response.data.error || 'Failed to register');
    }
  };

  function backToLogin () {
    navigate('/');
  }

  return (
    <Container maxWidth="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" component="h1">
            Register
          </Typography>
          {error && (
            <Alert severity="error">{error}</Alert>
          )}
          <TextField
            label="Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Account
          </Button>
          <Button variant="outlined" onClick={backToLogin} fullWidth>
            Back to Login
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default Register;
