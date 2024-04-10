import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Logout from '../components/logoutbtn';
import { Button, Dialog, DialogContent, DialogActions, TextField, Typography, Box, Grid, Paper } from '@mui/material';

function Presentation ({ token, setTokenfunction }) {
  const navigate = useNavigate();
  const { presentationId } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [store, setStore] = useState(null);
  const [openTitle, setOpenTitle] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  if (token === null) {
    navigate('/');
  }

  useEffect(() => {
    if (token && presentationId) {
      axios.get('http://localhost:5005/store/', {
        headers: {
          Authorization: token,
        }
      }).then(response => {
        const foundPresentation = response.data?.store.store.presentations.find((p) => p.id === parseInt(presentationId));
        if (foundPresentation) {
          setPresentation(foundPresentation);
          setStore(response.data.store.store);
        } else {
          console.log('Presentation not found');
        }
      }).catch(error => {
        alert(error);
      });
    }
  }, [token, presentationId]);

  if (!presentation) {
    return <div>Loading...</div>;
  }

  const deletePresentation = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        const response = await axios.get('http://localhost:5005/store', {
          headers: {
            Authorization: token,
          }
        });
        const presentationList = response.data.store.store.presentations;
        const updatedPresentations = presentationList.filter(p => p.id !== presentation.id);
        const putData = {
          store: {
            presentations: updatedPresentations
          }
        };
        await axios.put('http://localhost:5005/store', putData, {
          headers: {
            Authorization: token,
          }
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error in deletePresentation:', error);
        alert(error?.response?.data?.error || 'An error occurred');
      }
    }
  };

  const editTitle = () => {
    setOpenTitle(true);
  };

  const saveTitle = async () => {
    const updatetarget = store.presentations.map(p => {
      if (p.id === presentation.id) {
        p.title = presentation.title;
      }
      return p;
    });
    const putData = {
      store: {
        presentations: updatetarget
      }
    };
    try {
      await axios.put('http://localhost:5005/store', { putData }, {
        headers: {
          Authorization: token,
        }
      });
      setStore({ ...store, presentations: updatetarget });
      setOpenTitle(false);
    } catch (error) {
      alert(error?.response?.data?.error || 'An error occurred');
    }
  };

  const cancelTitle = () => {
    setOpenTitle(false);
  };

  const createSlide = async () => {
    const updateSlide = [...presentation.slides, { content: '' }];
    const updatePresentation = { ...presentation, slides: updateSlide };
    const updateStore = store.presentations.map(p => {
      if (p.id === presentation.id) {
        return updatePresentation;
      }
      return p;
    });
    const putData = {
      store: {
        presentations: updateStore
      }
    };
    try {
      await axios.put('http://localhost:5005/store', putData, {
        headers: {
          Authorization: token,
        }
      });
      setPresentation(updatePresentation);
      setStore({ ...store, presentations: updateStore });
      setSlideIndex(updateSlide.length - 1);
    } catch (error) {
      alert(error?.response?.data?.error || 'An error occurred');
    }
  };

  const previousSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const nextSlide = () => {
    if (slideIndex < presentation.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const deleteSlide = async () => {
    if (presentation.slides.length === 1) {
      alert('You cannot delete the last slide');
      return;
    }
    const updateSlide = [...presentation.slides];
    updateSlide.splice(slideIndex, 1);
    const updatePresentation = { ...presentation, slides: updateSlide };
    const updateStore = store.presentations.map(p => {
      if (p.id === presentation.id) {
        return updatePresentation;
      }
      return p;
    });
    const putData = {
      store: {
        presentations: updateStore
      }
    };
    try {
      await axios.put('http://localhost:5005/store', putData, {
        headers: {
          Authorization: token,
        }
      });
      setPresentation(updatePresentation);
      setStore({ ...store, presentations: updateStore });
      if (slideIndex === presentation.slides.length - 1) {
        setSlideIndex(updateSlide.length - 1);
      }
    } catch (error) {
      alert(error?.response?.data?.error || 'An error occurred');
    }
  };

  const back2dashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Box p={3}>
    <Logout token={token} setToken={setTokenfunction} />
    <Typography variant="h3" gutterBottom>
      Slide {presentationId}
    </Typography>
    <Button variant="outlined" onClick={back2dashboard}>Back to dashboard</Button>
    <Paper elevation={3} sx={{ padding: 2, margin: '20px 0' }}>
      <Typography variant="h4" gutterBottom>{presentation.title}</Typography>
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} my={2}>
        <Button variant="contained" color="primary" onClick={editTitle}>Edit title</Button>
        <Button variant="contained" color="secondary" onClick={createSlide}>Create slide</Button>
        <Button variant="contained" color="error" onClick={deletePresentation}>Delete presentation</Button>
      </Box>
    </Paper>
    <Grid container spacing={2}>
      {presentation.slides.map((slide, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ padding: 2 }}>
            <Typography>{slide.content || 'Empty slide'}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} my={2}>
      <Button variant="contained" onClick={previousSlide}>Previous Slide</Button>
      <Button variant="contained" color="info" onClick={nextSlide}>Next Slide</Button>
      <Button variant="contained" color="error" onClick={deleteSlide}>Delete Slide</Button>
    </Box>
    <Dialog open={openTitle} onClose={cancelTitle}>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          label="Edit Title"
          value={presentation.title}
          onChange={e => setPresentation({ ...presentation, title: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={saveTitle}>Save</Button>
        <Button onClick={cancelTitle}>Cancel</Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
}

export default Presentation;
