import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Grid, Card, CardContent, Typography } from '@mui/material';
import Logout from '../components/logoutbtn';
import axios from 'axios';

function Dashboard ({ token, setTokenfunction }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const [presentations, setPresentations] = useState([]);

  if (token === null) {
    navigate('/');
  }

  useEffect(() => {
    axios.get('http://localhost:5005/store', {
      headers: {
        Authorization: token,
      }
    }).then(response => {
      setPresentations(response.data?.store?.store.presentations || []);
    }).catch(error => {
      alert(error.response.data.error);
    });
  }, [token]);

  const newPresentation = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    try {
      await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      }).then(response => {
        let fetchPresentations = response.data.store.store.presentations;
        console.log('load data:', fetchPresentations);
        console.log('newId:', response);
        if (!fetchPresentations) {
          fetchPresentations = [];
        }
        const newId = fetchPresentations.length > 0 ? fetchPresentations[fetchPresentations.length - 1].id + 1 : 1;
        const newPresentation = {
          id: newId,
          title: presentationName,
          slides: [{ textarea: {} }],
        };
        const presentationList = [...fetchPresentations, newPresentation];
        const putDatta = {
          store: {
            presentations: presentationList
          }
        };
        axios.put('http://localhost:5005/store', putDatta, {
          headers: {
            Authorization: token,
          }
        }).then(response => {
          setPresentations(presentationList);
        }).catch(error => {
          alert(error.response.data.error);
        });
      });
    } catch (error) {
      alert(error);
    }
    setPresentationName('');
    handleClose();
  };

  const guidePresentation = (presentationId) => {
    navigate(`/presentation/${presentationId}/0`);
  };

  return (
    <>
      <Logout token={token} setToken={setTokenfunction} />
      <h3>Dashboard</h3>
      <Button variant="contained" color="primary" onClick={newPresentation}>
        New Presentation
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Presentation</DialogTitle>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2}>
        {presentations.map(presentation => (
          <Grid key={presentation?.id} item xs={12} sm={6} md={4} lg={3}>
            <Card style={{ aspectRatio: '2 / 1' }}>
              <CardContent
                variant="contained"
                color="primary"
                onClick={() => guidePresentation(presentation.id)}
              >
                <Typography variant='h5'>
                  {presentation?.title || 'Untitled'}
                </Typography>
                <Typography>
                  {presentation?.slides?.length > 0 ? `${presentation.slides.length} slides` : 'No content'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Dashboard;
