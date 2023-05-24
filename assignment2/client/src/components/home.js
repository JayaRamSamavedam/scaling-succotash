import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';

import Posts from  './post';
import { useNavigate } from 'react-router-dom';

const Base =process.env.BASE_URL;
const HomePage = () => {

  const navigate =useNavigate("");
  const handlelogut = (e) =>{
    e.preventDefault();
    window.localStorage.removeItem('token');
    navigate("/login");
  }

  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://qwert-ujnp.onrender.com/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        } else {
          // Handle authentication error
          // For example, redirect to login page
          console.log('Authentication error');
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchUserData();
  }, []);
  
const login = window.localStorage.getItem('token');
  return (
    <><Container maxWidth="sm">
      { login && 
      <>
      <nav><button onClick={handlelogut}>Logout</button></nav><Typography variant="h3" align="center" gutterBottom>
        Welcome, {username}!
      </Typography>
      <br/>
      <br/>
      <Posts/>
      </>
      }
      {/* Rest of the home page content */}
    </Container>
    {/* <Posts/> */}
    </>
  );
};

export default HomePage;
