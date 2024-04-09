import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stack, Card, CardContent, Typography, TextField, Button, Container } from '@mui/material';

function Login (props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function gotoregister () {
    navigate('/register');
  }

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/login', {
        email, password
      });
      props.setTokenfunction(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response.data.error);
    }
  }
  return (
    <Container maxWidth="sm" style={{ minHeight: '100vh' }}>
      <Stack
        direction="column"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Card style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              Login
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Email address"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                size="medium"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                size="medium"
              />
              <Button variant="contained" color="primary" onClick={login} fullWidth size="large">
                Login
              </Button>
              <Button variant="contained" color="secondary" onClick={gotoregister} fullWidth size="large">
                Register
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default Login;
