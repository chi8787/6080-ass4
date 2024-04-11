import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Logout from '../components/logoutbtn';
import { Button, Dialog, DialogContent, DialogActions, TextField, Typography, Box, Grid, Paper, Slider } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Presentation ({ token, setTokenfunction }) {
  const navigate = useNavigate();
  const { presentationId } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [findPrestation, setFindPresentation] = useState(null); // edit target title
  const [openTitle, setOpenTitle] = useState(false);
  const [openSlide, setOpenSlide] = useState(false);
  const [slideName, setSlideName] = useState(''); // create new slide
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideSize, setSlideSize] = useState({ width: 100, height: 100 });
  const [fontSize, setFontSize] = useState('1');
  const [color, setColor] = useState('#000000');
  const [layerNumber, setLayerNumber] = useState('1');

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
        const foundPresentation = response.data.store.store.presentations.find((p) => p.id === parseInt(presentationId));
        setPresentation(foundPresentation);
        setSlideIndex(0);
      }).catch(error => {
        alert(error);
      });
    }
  }, [token, presentationId]);

  if (!presentation) {
    return <div>Loading...</div>;
  }

  const deletePresentation = async () => { // find the whole list and delete the target presentation by filter
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

  const editTitle = () => { // press to trigger the modal
    setOpenTitle(true);
  };

  const cancelTitle = () => {
    setOpenTitle(false);
  };

  const saveTitle = async () => { // press save to update the title
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      let foundPresentation = response.data?.store.store.presentations.find((p) => p.id === parseInt(presentationId));
      let presentationList = response.data.store.store.presentations;
      const updatedPresentations = presentationList.filter(p => p.id !== presentation.id);
      if (!presentationList) {
        presentationList = [];
      }
      foundPresentation = {
        id: foundPresentation.id,
        title: findPrestation,
        slides: foundPresentation.slides,
      };
      const updateList = [...updatedPresentations, foundPresentation];
      const putData = {
        store: {
          presentations: updateList
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
  };

  /** ***************** slide from here ***************** **/

  const createSlide = () => {
    setOpenSlide(true);
    setSlideName('');
    setSlideSize({ width: 100, height: 100 });
  };

  const cancelSlide = () => {
    setOpenSlide(false);
    setSlideName('');
  };

  const saveSlide = async () => {
    setOpenSlide(false);
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      let foundPresentation = response.data?.store.store.presentations.find((p) => p.id === parseInt(presentationId));
      let presentationList = response.data.store.store.presentations;
      const updatedPresentations = presentationList.filter(p => p.id !== presentation.id);
      const existSlide = foundPresentation.slides;
      if (!presentationList) {
        presentationList = [];
      }
      const newSlide = {
        name: slideName,
        width: slideSize.width,
        height: slideSize.height,
        fontSize: fontSize,
        color: color,
        layer: layerNumber,
      };
      foundPresentation = {
        id: foundPresentation.id,
        title: foundPresentation.title,
        slides: [...existSlide, newSlide],
      };
      const updateList = [...updatedPresentations, foundPresentation];
      const putData = {
        store: {
          presentations: updateList
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
  };

  const goToNextSlide = () => {
    if (slideIndex < presentation.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const deleteSlide = async () => {
    const slideCount = presentation.slides.length;
    if (slideCount <= 1) {
      alert('Can\'t delete the last slide');
      return;
    }
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      const updatedPresentations = response.data.store.store.presentations.filter(p => p.id !== presentation.id);
      const newSlides = presentation.slides.filter((_, index) => index !== slideIndex); // filter out the target slide
      const updateSlideOfPresentation = {
        id: presentation.id,
        title: presentation.title,
        slides: newSlides,
      };
      const updateList = [...updatedPresentations, updateSlideOfPresentation];
      const putData = {
        store: {
          presentations: updateList
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
  };

  const back2dashboard = () => {
    navigate('/dashboard');
  };

  const handleSizeChange = (name, value) => {
    setSlideSize(prev => ({ ...prev, [name]: value }));
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
        {presentation.slides.length > 0 && (
          <Grid container spacing={2} sx={{ position: 'relative', minHeight: '450px' }}>
            {presentation.slides.map((slide, index) => (
              <Grid
                item key={index} xs={12}
                sx={{ position: 'absolute', top: 0, left: 0, width: `${slide.width}%`, height: `${slide.height}%`, display: index === slideIndex ? 'block' : 'none' }}>
                <Paper elevation={2} sx={{ minHeight: `${slide.height}%`, position: 'relative' }}>
                  <Typography sx={{ fontSize: `${slide.fontSize}em`, color: slide.color }}>{slide.name || 'Empty slide'}</Typography>
                  <Box position="absolute" bottom="10px" right="10px">
                    {slideIndex > 0 && (<Button onClick={goToPreviousSlide}><ArrowBackIosIcon /></Button>)}
                    {slideIndex < presentation.slides.length - 1 && (<Button onClick={goToNextSlide}><ArrowForwardIosIcon /></Button>)}
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1em',
                  }}>
                    {index + 1}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} my={2}>
          <Button variant="contained" color="primary" onClick={createSlide}>Create slide</Button>
          <Button variant="contained" color="error" onClick={deleteSlide}>Delete Slide</Button>
        </Box>
      </Paper>
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} my={2}>
        <Button variant="contained" color="primary" onClick={editTitle}>Edit title</Button>
        <Button variant="contained" color="error" onClick={deletePresentation}>Delete presentation</Button>
      </Box>
      <Dialog open={openSlide} onClose={cancelSlide}>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Create New Slide"
            value={slideName}
            onChange={e => setSlideName(e.target.value)}
          />
          <Typography variant="h6">Slide Settings</Typography><br/>
          <TextField
            label="Font Size (em)"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            type="number"
            inputProps={{ step: 0.1 }}
            size="small"
          />
          <TextField
            label="Color (HEX)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            type="text"
            size="small"
          />
           <TextField
            label="Layer"
            value={layerNumber}
            onChange={(e) => setLayerNumber(e.target.value)}
            type="number"
            size="small"
          />
          <Typography gutterBottom>Width (%)</Typography>
          <Slider
            value={slideSize.width}
            onChange={(e, newValue) => handleSizeChange('width', newValue)}
            aria-labelledby="width-slider"
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
          <Typography gutterBottom>Height (%)</Typography>
          <Slider
            value={slideSize.height}
            onChange={(e, newValue) => handleSizeChange('height', newValue)}
            aria-labelledby="height-slider"
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={saveSlide}>Save</Button>
          <Button onClick={cancelSlide}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTitle} onClose={cancelTitle}>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Edit Title"
            value={findPrestation}
            onChange={e => setFindPresentation(e.target.value)}
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
