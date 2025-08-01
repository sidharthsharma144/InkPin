import React from 'react'
import './App.css'
import Home from './pages/Home/Home'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom'

const routes=(
  <Router>
    <Routes>
       <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" exact element={<Home />}/>
      <Route path="/login" exact element={<Login />}/>
      <Route path="/signup" exact element={<SignUp />}/>
    </Routes>
  </Router>
);

const App=()=>{
  return <div>{routes}</div>;

}


export default App
