import { useEffect, useState } from "react";
import {Container} from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { UserProvider } from "../UserContext";
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Posts from './pages/Posts';
import './App.css'

function App() {

  return (
    <>
      <UserProvider>
        <Router>
          <AppNavbar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/logout" element={<Logout />}/>
              <Route path="/posts" element={<Posts />}/>
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  )
}

export default App
