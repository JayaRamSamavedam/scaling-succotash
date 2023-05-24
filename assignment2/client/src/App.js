import logo from './logo.svg';
import './App.css';
import SocialMediaApp from './components/post';
import HomePage from './components/home';
import LoginPage from './components/newlogin';
import SignupPage from './components/newsignup';
import { Route,Routes } from 'react-router-dom';
import NavBar from './components/nav';
function App() {
  return (
    // <SocialMediaApp/>
    
    <>
    <NavBar/>
    <Routes>
      <Route path="/home" element={<HomePage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<SignupPage/>}/>
    </Routes>
    {/* <LoginPage/> */}
    </>
  );
}

export default App;
