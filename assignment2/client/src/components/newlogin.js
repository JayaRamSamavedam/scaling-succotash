import React, { useState } from 'react'
import Main from "./main"
import Avtar from "../assets/images/avatar.svg"
import Bg from "../assets/images/bg.svg"
import Wave from "../assets/images/wave.png"
import  "./styles/style.css"
import { Await, NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
// import { sentOtpFunction } from '../services/Apis'
const Base =process.env.BASE_URL;
function Login() {
	const navigate=useNavigate();
	const [spiner,setSpiner] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	// const [message, setMessage] = useState('');
  
	const handleLogin = async (e) => {
		console.log(username,password);
		e.preventDefault();
		setSpiner(false);
	  try {
		const response = await fetch(`https://qwert-ujnp.onrender.com/login`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ username, password }),
		});
		setSpiner(true);
		const data = await response.json();
  
		if (response.ok) {
		  // Save the token in localStorage or sessionStorage
		  localStorage.setItem('token', data.token);
		//   setMessage(data.message);
		  toast.success(username+" successfully logged in");
		  window.setTimeout(10);
		  navigate("/home");
		} else {
		//   setMessage('Invalid username or password');
		  toast.error("invalid username or password");
		}
	  } catch (error) {
		console.error(error);
		// setMessage('An error occurred. Please try again.');
		toast.error("an error occured.please try again");
	  }
	};

  return (
    <div>
		<head>
    {/* <link rel="stylesheet" type="text/css" href={style}/> */}
        </head>
		
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
  <input type="text" class="form-control" name='username' placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" onChange={(e)=>setUsername(e.target.value)} />
</div>

<div class="input-group flex-nowrap">
  <span class="input-group-text" id="addon-wrapping">password</span>
  <input type="password" class="form-control" name='password' placeholder="Password" aria-label="password" aria-describedby="addon-wrapping" onChange={(e)=>setPassword(e.target.value)}/>
</div>
           		
            	{/* <a href="#" style={{float:"right" ,padding:"20px"}}>Forgot Password?</a> */}
				<a  href="#" style={{float:"none",padding:"20px"}}><NavLink to="/register">Not regestered yet?</NavLink></a>
                {/* <a href="#" style={{float:"right",padding:"20px"}}>Signup</a> */}
                <button className='btn' onClick={handleLogin}>Login
				{
                            spiner ? <span><Spinner animation="border" /></span>:""
                        }
				</button>
            	{/* <input type="submit" class="btn" value="Login"/> */}
            </form>
            
        </div>
		<ToastContainer />
    </div>
    <script type="text/javascript" src={Main}></script>
    </div>
  )
}

export default Login
