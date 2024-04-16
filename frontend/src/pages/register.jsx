import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Stack, TextField, Button, Typography, Alert, CircularProgress, Paper } from '@mui/material';

function Register (props) {
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setLoading(false);
      setError('');
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.password2) { // check if passwords match
      setError('Passwords do not match');
      return;
    }
    if (!form.email || !form.password || !form.name) { // check if all fields are filled
      setError('Please fill in all fields');
      return;
    }

    setLoading(true); // trigger UI change
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/register', form);
      props.setTokenfunction(response.data.token);
      navigate('/dashboard'); // if successful, redirect to dashboard
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Failed to register');
      }
    } finally {
      setLoading(false); // reset UI state
    }
  };

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={2} sx={{ p: 3, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              data-testid="name-input" 
              fullWidth
              required
            />
            <TextField
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={form.password2}
              onChange={handleChange('password2')}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 1, mb: 2 }}
              aria-label="create account"
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              fullWidth
              aria-label="back to login"
            >
              Back to Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default Register;
