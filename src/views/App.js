// src/App.js
import React from 'react';
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

function App() {
  return (
    <Router> {/* Bao bọc toàn bộ ứng dụng trong Router */}
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
