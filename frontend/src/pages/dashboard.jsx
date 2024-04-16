import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, TextField, Grid, Card, CardActionArea, CardContent,
  Typography, ThemeProvider, Snackbar, Alert
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Logout from '../components/logoutbtn';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
    secondary: {
      main: '#e53935',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#0d0d0d',
      secondary: '#555555',
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #dedede',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#1565c0',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            backgroundColor: '#e3f2fd'
          },
        }
      }
    }
  }
});

function Dashboard ({ token, setTokenfunction }) {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const [presentations, setPresentations] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      axios.get('http://localhost:5005/store', { headers: { Authorization: token } })
        .then(response => {
          setPresentations(response.data?.store?.store.presentations || []);
        })
        .catch(error => {
          console.error('Error fetching presentations', error);
          setSnackbar({ open: true, message: 'Failed to fetch presentations', severity: 'error' });
        });
    }
  }, [token, navigate]);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!presentationName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a valid presentation name.', severity: 'warning' });
      return;
    }
    try {
      const response = await axios.get('http://localhost:5005/store', { headers: { Authorization: token } });
      const presentations = response.data.store.store.presentations || [];
      const newId = presentations.length > 0 ? presentations[presentations.length - 1].id + 1 : 1;
      const newPresentation = { id: newId, title: presentationName, slides: [] };
      const updatedPresentations = [...presentations, newPresentation];
      await axios.put('http://localhost:5005/store', { store: { presentations: updatedPresentations } }, { headers: { Authorization: token } });
      setPresentations(updatedPresentations);
      handleDialogClose();
      setSnackbar({ open: true, message: 'Presentation created successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error creating presentation: ' + (error.response.data.error || 'Unknown error'), severity: 'error' });
    }
    setPresentationName('');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Logout token={token} setToken={setTokenfunction} />
      <Typography variant="h3" component="h1" style={{ marginBottom: '20px' }}>Dashboard</Typography>
      <Button variant="contained" color="primary" onClick={handleDialogOpen} aria-label="Create new presentation" style={{ marginBottom: '20px' }}>
        New Presentation
      </Button>
      <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="new-presentation-dialog-title">
        <form onSubmit={handleCreate}>
          <DialogTitle id="new-presentation-dialog-title">New Presentation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the name of your new presentation.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Presentation Name"
              type="text"
              fullWidth
              value={presentationName}
              onChange={(e) => setPresentationName(e.target.value)}
              aria-label="Presentation name input"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} aria-label="Cancel creating presentation">Cancel</Button>
            <Button type="submit" color="primary" aria-label="Create presentation">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Grid container spacing={2}>
        {presentations.map(presentation => (
          <Grid item key={presentation.id} xs={12} sm={6} md={4} lg={3}>
            <Card tabIndex="0">
              <CardActionArea onClick={() => navigate(`/presentation/${presentation.id}/0`)} aria-label={`Go to presentation titled ${presentation.title}`}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {presentation.title || 'Untitled'}
                  </Typography>
                  <Typography>
                    {presentation.slides.length > 0 ? `${presentation.slides.length} slides` : 'No content'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Dashboard;
