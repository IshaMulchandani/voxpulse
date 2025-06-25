import './App.css';
import logo from './Assets/main_logo.png'
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Footer from './Footer';
import SignUp from './SignUp';
import Login from './Login';
import Dashboard from './Dashboard';
import PollsForYou from './PollsForYou';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/signUp' element={ <SignUp/> }/>
          <Route path='/login' element={<Login/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/pollsForYou' element={<PollsForYou/>} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
