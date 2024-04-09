import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Logout from '../components/logoutbtn';
import { Dialog } from '@mui/material';

function Slide ({ token, setTokenfunction }) {
  const navigate = useNavigate();
  const { presentationId } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [store, setStore] = useState(null);
  const [openTitle, setOpenTitle] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  if (token === null) {
    navigate('/login');
  }

  console.log(presentationId);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      }).then(response => {
        const matchSlide = response.data.store.presentations.find(p => p.id === parseInt(presentationId));
        setPresentation(matchSlide);
      }).catch(error => {
        alert(error?.response?.data?.error || 'An error occurred');
      });
    }
  }, []);

  if (!presentation || !store) {
    return <div>Loading...</div>;
  }

  const editPresentation = () => {
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

  const deletePresentation = async () => {
    if (window.confirm('Are you sure you want to delete this presentation?')) {
      const updateStore = store.presentations.filter(p => p.id !== presentation.id);
      const putData = {
        store: {
          presentations: updateStore
        }
      };
      try {
        await axios.put('http://localhost:5005/store', { putData }, {
          headers: {
            Authorization: token,
          }
        });
        navigate('/dashboard');
      } catch (error) {
        alert(error?.response?.data?.error || 'An error occurred');
      }
    }
  };

  return (
    <>
      <Logout token={token} setToken={setTokenfunction} />
      <h3>Slide</h3>
      <div>
        <h4>{presentation.title}</h4>
        <button onClick={editPresentation}>Edit title</button>
        <button onClick={createSlide}>Create slide</button>
        <button onClick={deletePresentation}>Delete presentation</button>
        <button onClick={back2dashboard}>Back to dashboard</button>
        <div>{presentation.slides.map((slide, index) => (
          <div key={index} style={{ position: 'absolute' }}>
            <div>{slide.content}</div>
          </div>
        ))}</div>
      </div>
      <div>
        <button onClick={previousSlide}>Previous</button>
        <button onClick={nextSlide}>Next</button>
        <button onClick={deleteSlide}>Delete</button>
      </div>
      <Dialog open={openTitle} onClose={cancelTitle}>
        <div>
          <input value={presentation.title} onChange={e => setPresentation({ ...presentation, title: e.target.value })} />
          <button onClick={saveTitle}>Save</button>
          <button onClick={cancelTitle}>Cancel</button>
        </div>
      </Dialog>
    </>
  );
}

export default Slide;
