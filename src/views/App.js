// src/App.js
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import Login from './login/login';
import Home from './Home/Home';
import PostDetail from './Post/PostDetail';
import CreatePost from './Post/CreatePost';
import Profile from './User/Profile';
import EditProfile from './User/EditProfile';
import Admin from './User/Admin';
import Upload from './Post/Upload';
import ExamList from './Exam/ExamList';
import Exam from './Exam/Exam';
import ManagePosts from './Manage/Post/ManagePosts';
import UnauthorizedPage from './Unauthorized/UnauthorizedPage';
import EditPost from './Post/EditPost';
import HeaderComponent from './Home/HeaderComponent';
import CustomFooter from './Home/CustomFooter';
import CreateExamAI from './Exam/CreateExamAI';
import ExamManagement from './Manage/Exam/ExamManagement';
import CreateExamByText from './Exam/CreateExamByText';

function App() {
  const [routeKey, setRouteKey] = useState(Date.now());
  return (
    <Router>
      <HeaderComponent key={routeKey} />
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="/exams/:examId" element={<Exam />} />
          <Route path="/manage-posts" element={<ManagePosts />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/create-exam-ai" element={<CreateExamAI />} />
          <Route path="/exam-management" element={<ExamManagement />} />
          <Route path="/create-exam-by-text" element={<CreateExamByText />} />
        </Routes>
      </div>
      <CustomFooter />
    </Router>
  );
}

export default App;
