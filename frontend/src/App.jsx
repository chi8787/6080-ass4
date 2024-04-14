import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Presentation from './pages/presentation';

function App () {
  let lstoken = null;
  if (localStorage.getItem('token')) {
    lstoken = localStorage.getItem('token');
  }
  const [token, setToken] = React.useState(lstoken);
  const setTokenAbstract = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register token={token} setTokenfunction={setTokenAbstract}/>} />
        <Route path="/" element={<Login token={token} setTokenfunction={setTokenAbstract}/>} />
        <Route path="/dashboard" element={<Dashboard token={token} setTokenfunction={setTokenAbstract}/>} />
        <Route path="/presentation/:presentationId/:slideId" element={<Presentation token={token} setTokenfunction={setTokenAbstract}/>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
