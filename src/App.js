import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import PollsForYou from './PollsForYou';
import Reports from './components/Reports';
import TrendingTopics from './components/TrendingTopics';
import PollPage from './components/PollPage';
import Header from './Header';
import Header2 from './Header2';
import Navbar from './components/Navbar';
import './App.css';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import Footer from './Footer'
import ReportView from './components/ReportView';
import VotingPage from './components/VotingPage';
import CommentsPage from './components/CommentsPage';
import AdminDashboard from './AdminDashboard';
import AdminCreatePolls from './components/AdminCreatePolls';
import CreatePoll from './components/CreatePoll';
import UserCreatePoll from './components/UserCreatePoll';
import CreateReport from './components/CreateReport';
import AdminReportView from './components/AdminReportView';
import AdminReports from './components/AdminReports';
import AdminManageAccess from './components/AdminManageAccess';
import EditProfile from './components/EditProfile';
import CategoryPage from './components/CategoryPage';

function AppHeader() {
  const location = useLocation();
  // Show Header2 for all post-login pages
  if (["/dashboard", "/polls", "/reports", "/trending", "/edit-profile", "/create-poll"].includes(location.pathname) || 
      location.pathname.startsWith("/report/") || 
      location.pathname.startsWith("/poll/") ||
      location.pathname.startsWith("/vote/") ||
      location.pathname.startsWith("/comments/") ||
      location.pathname.startsWith("/admin-") ||
      location.pathname.startsWith("/category/")) {
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
          <Route path="/create-poll" element={<UserCreatePoll />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/poll/:pollId" element={<PollPage />} />
          <Route path="/report/:reportType" element={<ReportView />} />
          <Route path="/vote/:pollId" element={<VotingPage />} />
          <Route path="/comments/:pollId" element={<CommentsPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-create-polls" element={<AdminCreatePolls />} />
          <Route path="/admin-create-poll" element={<CreatePoll />} />
          <Route path="/admin-reports" element={<AdminReports />} />
          <Route path="/admin-create-report" element={<CreateReport />} />
          <Route path="/admin-report-view/:reportId" element={<AdminReportView />} />
          <Route path="/admin-manage-access" element={<AdminManageAccess />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
