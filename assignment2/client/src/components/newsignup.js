import React, { useState } from 'react'
import Main from "./main"
import Avtar from "../assets/images/avatar.svg"
import Bg from "../assets/images/bg.svg"
import Wave from "../assets/images/wave.png"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import "./styles/style.css";


const Base =process.env.BASE_URL;

// import {registerfunction} from "../services/Apis";
// import { NavLink } from 'react-router-dom'
function Login() {
  
const navigate=useNavigate();
  const [inputdata,setInputdata]=useState({
    username:"",
    email:"",
    password:""
  });
  const handleChange=(e)=>{
    const {name,value}=e.target;
    setInputdata({...inputdata,[name]:value})
  }



// register data

const handleSubmit=async(e)=>{
  e.preventDefault();
  const {username,email,password}=inputdata;
  // console.log(username,email,password);
  if (username === ""){
    toast.error("enter the username");
  }
  else if (email === ""){
    toast.error("enter email");
  }
  else if(!email.includes("@")){
    toast.error("enter the vaid emial"); 
  }

  else if (password === ""  ){
    toast.error("enter the password");
  }
  else if(password.length<8){
    toast.error("password must be more than 8 charachters");
  }
  else if(password.includes(username)){
    toast.error("password doesnot contain the username");
  }
  else{
    e.preventDefault();

    try {
      const response = await fetch('https://qwert-ujnp.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      console.log(response);

      if (response.ok) {
        // Registration successful, redirect to login page or handle accordingly
        console.log('Registration successful');
        // setInputdata({...inputdata,username:"",email:"",password:""});
      navigate("/login");
      toast.success("sucessfully signedup in");
      } else {
        // Handle registration error
        console.log('Registration failed');
        toast.error("registration failed")
      }
    } 
    catch (error) {
      console.error(error);
      // Handle error
      toast.error("an error occured");
    }   
  }
  
}

  return (
    <div>
        
      <img class="wave" src={Wave}/>
	<div class="container">
		<div class="img">
			<img src={Bg}/>
		</div>
		<div class="login-content">
			<form>
				<img src={Avtar}/>
				<h2 class="title">Welcome</h2>
        <div class="input-group flex-nowrap">
  <span class="input-group-text" id="addon-wrapping">@</span>
  <input type="text" class="form-control" name='username' placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" onChange={handleChange} />
</div>
<div class="input-group flex-nowrap">
  <span class="input-group-text" id="addon-wrapping">email</span>
  <input type="email" class="form-control" name='email' placeholder="Email" aria-label="Username" aria-describedby="addon-wrapping" onChange={handleChange}/>
</div>
<div class="input-group flex-nowrap">
  <span class="input-group-text" id="addon-wrapping">password</span>
  <input type="password" class="form-control" name='password' placeholder="Password" aria-label="Username" aria-describedby="addon-wrapping" onChange={handleChange}/>
</div>
                   
           		
            	{/* <a href="#" style={{float:"right" ,padding:"20px"}}>Forgot Password?</a> */}
				<a  href="#" style={{float:"none",padding:"20px"}}><NavLink to="/login">Already registered?</NavLink></a>
                {/* <a href="#" style={{float:"right",padding:"20px"}}>Signup</a> */}
                <button className='btn' onClick={handleSubmit}>Signup</button>
            	{/* <input type="submit" class="btn" value="Login"/> */}
            </form>
            
        </div>
        <ToastContainer/>
    </div>
    <script type="text/javascript" src={Main}></script>
    </div>
  )
}

export default Login
