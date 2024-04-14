import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Logout from '../components/logoutbtn';
import { Button, Dialog, DialogContent, DialogActions, TextField, Typography, Box, Grid, Paper, RadioGroup, FormControlLabel, Radio, Checkbox, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Presentation ({ token, setTokenfunction }) {
  const navigate = useNavigate();
  const { presentationId } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [findPresentation, setFindPresentation] = useState(null); // edit target title
  const [openTitle, setOpenTitle] = useState(false);
  const [openSlide, setOpenSlide] = useState(false);
  const [slideName, setSlideName] = useState(''); // create new slide
  const [slideIndex, setSlideIndex] = useState(0);
  const [fontSize, setFontSize] = useState('1');
  const [color, setColor] = useState('#000000');
  const [openOption, setOpenOption] = useState(false);
  const [openTextBox, setOpenTextBox] = useState(false);
  const [openImageBox, setOpenImageBox] = useState(false);
  const [openVideoBox, setOpenVideoBox] = useState(false);
  const [openCodeBox, setOpenCodeBox] = useState(false);
  const [textBoxContent, setTextBoxContent] = useState('');
  const [textBoxFontSize, setTextBoxFontSize] = useState('1');
  const [textBoxColor, setTextBoxColor] = useState('#000000');
  const [textBoxSize, setTextBoxSize] = useState({ width: 50, height: 50 });
  const [textBoxLayer, setTextBoxLayer] = useState('2');
  const [contentType, setContentType] = useState('text');
  const [imageData, setImageData] = useState({ url: '', alt: '', width: 50, height: 50, layer: '2' });
  const [videoData, setVideoData] = useState({ url: '', width: 100, height: 100, autoplay: false });
  const [codeData, setCodeData] = useState({ code: '', language: 'python', fontSize: 1, textareaWidth: 50, textareaHeight: 50 });
  const [slideOption, setSlideOption] = useState({ slidefontFamily: 'Arial', slidebackground: '#ffffff', direction: 'to left top', slidebackground2: '#000000' });
  const [openslideEditor, setOpenSlideEditor] = useState(false);

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
        title: findPresentation,
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
      const newId = existSlide.length > 0 ? existSlide[existSlide.length - 1].id + 1 : 1;
      if (!presentationList) {
        presentationList = [];
      }
      const newSlide = {
        id: newId,
        name: slideName,
        fontSize: fontSize,
        color: color,
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
      const newIndex = Math.min(slideIndex + 1, presentation.slides.length - 1);
      setSlideIndex(slideIndex + 1);
      navigate(`/presentation/${presentationId}/${newIndex}`);
    }
  };

  const goToPreviousSlide = () => {
    const newIndex = Math.max(slideIndex - 1, 0);
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
      navigate(`/presentation/${presentationId}/${newIndex}`);
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

  const createTextArea = async () => {
    setOpenOption(false);
    setOpenSlide(false);
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      let presentationList = response.data?.store.store.presentations;
      let foundPresentation = presentationList.find((p) => p.id === parseInt(presentationId)); // target presentation
      const updatedPresentations = presentationList.filter(p => p.id !== presentation.id); // filter out the target presentation
      const existSlide = foundPresentation.slides;
      const foundSlide = existSlide.find((_, index) => index === slideIndex); // target slide
      console.log('foundSlide:', foundSlide);
      const updatedSlide = foundPresentation.slides.filter((_, index) => index !== slideIndex); // filter out the target slide
      if (!presentationList) {
        presentationList = [];
      }
      const textarea = {
        name: textBoxContent || 'none',
        fontSize: textBoxFontSize || 'none',
        color: textBoxColor || 'none',
        width: textBoxSize.width,
        imagewidth: imageData.width || 'none',
        videoWidth: videoData.width || 'none',
        height: textBoxSize.height || 'none',
        imageheight: imageData.height || 'none',
        videoheight: videoData.height || 'none',
        imageurl: imageData.url || 'none',
        alt: imageData.alt || 'none',
        videourl: videoData.url || 'none',
        layer: textBoxLayer || 2,
        autoplay: videoData.autoplay || 'none',
        code: codeData.code || 'none',
        language: codeData.language || 'none',
        codeFontSize: codeData.fontSize || 'none',
        codeWidth: codeData.textareaWidth || 'none',
        codeHeight: codeData.textareaHeight || 'none',
      };
      const newSlide = {
        id: foundSlide.id,
        name: foundSlide.name,
        fontSize: foundSlide.fontSize,
        color: foundSlide.color,
        textarea: textarea,
      };
      foundPresentation = {
        id: foundPresentation.id,
        title: foundPresentation.title,
        slides: [...updatedSlide, newSlide],
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

  const handleContentChange = (event) => {
    setContentType(event.target.value);
    console.log('contentType:', contentType);
  };

  const addContent = () => {
    setOpenOption(true);
    if (contentType === 'text') {
      setOpenTextBox(true);
      setImageData({ url: 'none', alt: 'none', width: 'none', height: 'none', layer: '2' });
      setVideoData({ url: 'none', width: 'none', height: 'none', autoplay: false });
      setCodeData({ code: 'none', language: 'none', fontSize: 'none', textareaWidth: 'none', textareaHeight: 'none' });
    } else if (contentType === 'image') {
      setOpenImageBox(true);
      setTextBoxSize({ width: 'none', height: 'none' });
      setVideoData({ url: 'none', width: 'none', height: 'none', autoplay: false });
      setCodeData({ code: 'none', language: 'none', fontSize: 'none', textareaWidth: 'none', textareaHeight: 'none' });
    } else if (contentType === 'video') {
      setOpenVideoBox(true);
      setTextBoxSize({ width: 'none', height: 'none' });
      setImageData({ url: 'none', alt: 'none', width: 'none', height: 'none', layer: '2' });
      setCodeData({ code: 'none', language: 'none', fontSize: 'none', textareaWidth: 'none', textareaHeight: 'none' });
    } else if (contentType === 'code') {
      setOpenCodeBox(true);
      setImageData({ url: 'none', alt: 'none', width: 'none', height: 'none', layer: '2' });
      setVideoData({ url: 'none', width: 'none', height: 'none', autoplay: false });
    }
  };

  const editSlide = async () => {
    setOpenSlideEditor(false)
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      let presentationList = response.data?.store.store.presentations;
      let foundPresentation = presentationList.find((p) => p.id === parseInt(presentationId)); // target presentation
      const updatedPresentations = presentationList.filter(p => p.id !== presentation.id); // filter out the target presentation
      const existSlide = foundPresentation.slides;
      const foundSlide = existSlide.find((_, index) => index === slideIndex); // target slide
      const foundSlideOption = foundSlide.textarea;
      const updatedSlide = foundPresentation.slides.filter((_, index) => index !== slideIndex); // filter out the target slide
      if (!presentationList) {
        presentationList = [];
      }
      const textarea = {
        name: textBoxContent || foundSlideOption.name || 'none',
        fontSize: textBoxFontSize || foundSlideOption.fontSize || 'none',
        color: textBoxColor || foundSlideOption.color || 'none',
        width: textBoxSize.width,
        imagewidth: imageData.width || foundSlideOption.imagewidth || 'none',
        videoWidth: videoData.width || foundSlideOption.videoWidth || 'none',
        height: textBoxSize.height || foundSlideOption.height || 'none',
        imageheight: imageData.height || foundSlideOption.imageheight || 'none',
        videoheight: videoData.height || foundSlideOption.videoheight || 'none',
        imageurl: imageData.url || foundSlideOption.imageurl || 'none',
        alt: imageData.alt || foundSlideOption.alt || 'none',
        videourl: videoData.url || foundSlideOption.videourl || 'none',
        layer: textBoxLayer || 2,
        autoplay: videoData.autoplay || foundSlideOption.autoplay || 'none',
        code: codeData.code || foundSlideOption.code || 'none',
        language: codeData.language || foundSlideOption.language || 'none',
        codeFontSize: codeData.fontSize || foundSlideOption.codeFontSize || 'none',
        codeWidth: codeData.textareaWidth || foundSlideOption.codeWidth || 'none',
        codeHeight: codeData.textareaHeight || foundSlideOption.codeHeight || 'none',
        fontFamily: slideOption.slidefontFamily || 'none',
        background: slideOption.slidebackground || 'white',
        background2: slideOption.slidebackground2 || 'none',
        direction: slideOption.direction || 'none',
      };
      const newSlide = {
        id: foundSlide.id,
        name: foundSlide.name,
        fontSize: foundSlide.fontSize,
        color: foundSlide.color,
        textarea: textarea,
      };
      foundPresentation = {
        id: foundPresentation.id,
        title: foundPresentation.title,
        slides: [...updatedSlide, newSlide],
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
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', display: index === slideIndex ? 'flex' : 'none', flexDirection: 'column' }}>
                <Paper
                  elevation={2}
                  sx={{
                    minHeight: '400px',
                    position: 'relative',
                    background: `linear-gradient(${slide.direction}, ${slide.background}, ${slide.background2})`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: `${slide.fontSize}em`,
                      color: slide.color,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      m: 1,
                      zIndex: 1,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}>
                    {slide.name || 'Empty slide'}
                  </Typography>
                  {slide.textarea?.name && slide.textarea?.videourl === 'none' && slide.textarea?.code === 'none' && (
                    <Box
                      sx={{
                        width: `${slide.textarea.width}%`,
                        height: `${slide.textarea.height}%`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #e8e8e8',
                        p: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        background: `linear-gradient(${slide.textarea.direction}, ${slide.textarea.background}, ${slide.textarea.background2})`,
                        zIndex: slide.textarea.layer,
                      }}>
                      <Typography sx={{ fontSize: `${slide.textarea.fontSize}em`, color: slide.textarea.color, fontFamily: slide.textarea?.fontFamily || 'Arial' }}>
                        {slide.textarea.name || ''}
                      </Typography>
                    </Box>
                  )}
                  {slide.textarea?.name === 'none' && slide.textarea?.imageurl && slide.textarea?.code === 'none' && slide.textarea?.videourl === 'none' && (
                    <Box
                      sx={{
                        width: `${slide.textarea.imagewidth}%`,
                        height: `${slide.textarea.imageheight}%`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #e8e8e8',
                        p: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        zIndex: slide.textarea.layer,
                      }}>
                      <img
                        src={slide.textarea.imageurl}
                        alt={slide.textarea.alt || 'image description'}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  )}
                  {slide.textarea?.name === 'none' && slide.textarea?.imageurl === 'none' && slide.textarea?.code === 'none' && slide.textarea?.videourl && (
                    <Box
                      sx={{
                        width: `${slide.textarea.videoWidth}%`,
                        height: `${slide.textarea.videoheight}%`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #e8e8e8',
                        p: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        zIndex: slide.textarea.layer,
                      }}
                    >
                      {slide.textarea?.videourl.includes('youtube.com') || slide.textarea?.videourl.includes('youtu.be')
                        ? (
                          <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(slide.textarea.videourl).search).get('v')}` + `?autoplay=${slide.textarea.autoplay ? '1' : '0'}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded youtube"
                      />)
                        : (
                        <video
                          width="100%"
                          height="100%"
                          controls
                          autoPlay={slide.textarea.autoPlay}
                          muted={!!slide.textarea.autoPlay}
                        >
                          <source src={slide.textarea.videourl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                          )}
                    </Box>
                  )}
                  {slide.textarea?.name === 'none' && slide.textarea?.imageurl === 'none' && slide.textarea?.videourl === 'none' && slide.textarea?.code && (
                    <Box
                      sx={{
                        width: `${slide.textarea.codeWidth}%`,
                        height: `${slide.textarea.codeHeight}%`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        border: '1px solid #e8e8e8',
                        p: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        zIndex: slide.textarea.layer,
                      }}>
                      <Typography sx={{ fontSize: `${slide.textarea.codeFontSize}em`, color: slide.textarea.color, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {slide.textarea.code || ''}
                      </Typography>
                      <Typography sx={{ fontSize: '1em', marginLeft: 'auto', marginTop: 'auto', color: 'gray' }}>
                        language: {slide.textarea.language || ''}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                  }}>
                    {slideIndex > 0 && (<Button style={{ position: 'relative', zIndex: 10 }} onClick={goToPreviousSlide}><ArrowBackIosIcon /></Button>)}
                    {slideIndex < presentation.slides.length - 1 && (<Button style={{ position: 'relative', zIndex: 10 }} onClick={goToNextSlide}><ArrowForwardIosIcon /></Button>)}
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
          <Button variant="contained" color="info" onClick={() => setOpenOption(true)}>Add Content</Button>
          {presentation.slides[slideIndex]?.textarea && (
            <Button variant="contained" color="secondary" onClick={() => setOpenSlideEditor(true)}>Edit Component</Button>
          )}
        </Box>
        <Dialog open={openslideEditor} onClose={() => setOpenSlideEditor(false)}>
          <DialogContent>
            <Typography>Select content type:</Typography>
            <RadioGroup value={contentType} onChange={handleContentChange}>
              <TextField
                label="Background Color (HEX)"
                type="text"
                value={slideOption.slidebackground}
                onChange={(e) => setSlideOption({ ...slideOption, slidebackground: e.target.value })}
                fullWidth
              />
              <TextField
                label="Second Background Color (HEX)"
                type="text"
                value={slideOption.slidebackground2}
                onChange={(e) => setSlideOption({ ...slideOption, slidebackground2: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="font-family-label">Font Family</InputLabel>
                <Select
                  labelId="font-family-label"
                  value={slideOption.fontFamily}
                  onChange={(e) => setSlideOption({ ...slideOption, fontFamily: e.target.value })}
                  label="Font Family"
                >
                  <MenuItem value="Arial">Arial</MenuItem>
                  <MenuItem value="Helvetica">Helvetica</MenuItem>
                  <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="backgroung-direction">Background Direction</InputLabel>
                <Select
                  value={slideOption.direction}
                  onChange={(e) => setSlideOption({ ...slideOption, direction: e.target.value })}
                  label="Background Direction"
                >
                  <MenuItem value="to right top">RIGHT TOP</MenuItem>
                  <MenuItem value="to right bottom">RIGHT BOTTOM</MenuItem>
                  <MenuItem value="to left top">LEFT TOP</MenuItem>
                  <MenuItem value="to left bottom">LEFT BOTTOM</MenuItem>
                </Select>
              </FormControl>
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={editSlide}>Save</Button>
            <Button onClick={() => setOpenSlideEditor(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openOption} onClose={() => setOpenOption(false)}>
          <DialogContent>
            <Typography>Select content type:</Typography>
            <Dialog open={openOption} onClose={() => setOpenOption(false)}>
              <DialogContent>
                <Typography>Select content type:</Typography>
                <RadioGroup value={contentType} onChange={handleContentChange}>
                  <FormControlLabel value="text" control={<Radio />} label="Text" />
                  <FormControlLabel value="image" control={<Radio />} label="Image" />
                  <FormControlLabel value="video" control={<Radio />} label="Video" />
                  <FormControlLabel value="code" control={<Radio />} label="Code" />
                </RadioGroup>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenOption(false)}>Cancel</Button>
                <Button onClick={addContent}>Next</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openTextBox} onClose={() => setOpenTextBox(false)}>
              <DialogContent>
                <TextField
                  label="Text Content"
                  multiline
                  rows={4}
                  value={textBoxContent}
                  onChange={(e) => setTextBoxContent(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Font Size (em)"
                  type="number"
                  value={textBoxFontSize}
                  onChange={(e) => setTextBoxFontSize(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Color (HEX)"
                  type="text"
                  value={textBoxColor}
                  onChange={(e) => setTextBoxColor(e.target.value)}
                  fullWidth
                />
                <Typography>Size:</Typography>
                <TextField
                  label="Width (%)"
                  type="number"
                  value={textBoxSize.width}
                  onChange={(e) => setTextBoxSize({ ...textBoxSize, width: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Height (%)"
                  type="number"
                  value={textBoxSize.height}
                  onChange={(e) => setTextBoxSize({ ...textBoxSize, height: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Layer"
                  type="text"
                  value={textBoxLayer}
                  onChange={(e) => setTextBoxLayer(e.target.value)}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { setOpenTextBox(false); setOpenOption(false); }}>Cancel</Button>
                <Button onClick={createTextArea}>Add</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openImageBox} onClose={() => setOpenImageBox(false)}>
              <DialogContent>
                <TextField
                  label="Image URL or Base64"
                  value={imageData.url}
                  onChange={(e) => setImageData({ ...imageData, url: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Alt Description"
                  value={imageData.alt}
                  onChange={(e) => setImageData({ ...imageData, alt: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Width"
                  type="number"
                  value={imageData.width}
                  onChange={(e) => setImageData({ ...imageData, width: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Height"
                  type="number"
                  value={imageData.height}
                  onChange={(e) => setImageData({ ...imageData, height: e.target.value })}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { setOpenImageBox(false); setOpenOption(false); }}>Cancel</Button>
                <Button onClick={createTextArea}>Add</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openVideoBox} onClose={() => setOpenVideoBox(false)}>
              <DialogContent>
                <TextField
                  label="YouTube Video URL"
                  value={videoData.url}
                  onChange={(e) => setVideoData({ ...videoData, url: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Width"
                  type="number"
                  value={videoData.width}
                  onChange={(e) => setVideoData({ ...videoData, width: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Height"
                  type="number"
                  value={videoData.height}
                  onChange={(e) => setVideoData({ ...videoData, height: e.target.value })}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={videoData.autoplay}
                      onChange={(e) => setVideoData({ ...videoData, autoplay: e.target.checked })}
                    />
                  }
                  label="Auto-play"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { setOpenVideoBox(false); setOpenOption(false); }}>Cancel</Button>
                <Button onClick={createTextArea}>Add</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openCodeBox} onClose={() => setOpenCodeBox(false)}>
              <DialogContent>
                <TextField
                  label="Code"
                  name="code"
                  value={codeData.code}
                  onChange={(e) => setCodeData({ ...codeData, code: e.target.value })}
                  multiline
                  fullWidth
                />
                <Select value={codeData.language} onChange={(e) => setCodeData({ ...codeData, language: e.target.value })} fullWidth>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="c">C</MenuItem>
                  <MenuItem value="javascript">JavaScript</MenuItem>
                </Select>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      label="Font Size (em)"
                      type="number"
                      name="fontSize"
                      value={codeData.fontSize}
                      onChange={(e) => setCodeData({ ...codeData, fontSize: e.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Textarea Width"
                      type="number"
                      name="textareaWidth"
                      value={codeData.textareaWidth}
                      onChange={(e) => setCodeData({ ...codeData, textareaWidth: e.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Textarea Height"
                      type="number"
                      name="textareaHeight"
                      value={codeData.textareaHeight}
                      onChange={(e) => setCodeData({ ...codeData, textareaHeight: e.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { setOpenCodeBox(false); setOpenOption(false); }}>Cancel</Button>
                <Button onClick={createTextArea} color="primary">Add</Button>
              </DialogActions>
            </Dialog>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelSlide}>Cancel</Button>
            <Button onClick={saveSlide}>Save</Button>
          </DialogActions>
        </Dialog>
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
          <Typography variant="h6">Slide Settings</Typography><br />
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
            value={findPresentation}
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
