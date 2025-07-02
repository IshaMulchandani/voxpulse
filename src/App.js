import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import PollsForYou from './PollsForYou';
import Reports from './components/Reports';
import TrendingTopics from './components/TrendingTopics';
import Header from './Header';
import Header2 from './Header2';
import Navbar from './components/Navbar';
import './App.css';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import Footer from './Footer'

function AppHeader() {
  const location = useLocation();
  // Show Header2 for all post-login pages
  if (["/dashboard", "/polls", "/reports", "/trending"].includes(location.pathname)) {
    return <Header2 />;
  }
  // Show Header for pre-login or other pages
  return <Header />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/signUp' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/polls" element={<PollsForYou />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/trending" element={<TrendingTopics />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
