import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stack, Card, CardContent, Typography, TextField, Button, Container, CircularProgress } from '@mui/material';

function Login ({ setTokenfunction }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEnter = (event) => {
      if (event.key === 'Enter') {
        login();
      }
    };
    document.addEventListener('keydown', handleEnter);
    return () => document.removeEventListener('keydown', handleEnter);
  }, [email, password]);

  const login = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/login', { email, password });
      setTokenfunction(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response.data.error || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ minHeight: '100vh' }}>
      <Stack
        direction="column"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Card style={{ width: '100%', padding: '20px' }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              Login
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                error={!!error}
                helperText={error}
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                error={!!error}
                helperText={error}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={login}
                fullWidth
                size="large"
                disabled={loading}
                aria-label="login submit"
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/register')}
                fullWidth
                size="large"
                aria-label="go to register page"
              >
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
