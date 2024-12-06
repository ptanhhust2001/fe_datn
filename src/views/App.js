import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Thay Switch bằng Routes
import Login from './login/login';
import Home from './Home/Home';
import PostDetail from './Post/PostDetail';
import CreatePost from './Post/CreatePost';
import Profile from './User/Profile';
import EditProfile from './User/EditProfile';
import Admin from './User/Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>  {/* Thay Switch bằng Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/post/:id" element={<PostDetail />} /> {/* Đường dẫn cho chi tiết bài viết */}
          <Route path="/create-post" element={<CreatePost />} /> {/* Trang chi tiết người dùng */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
