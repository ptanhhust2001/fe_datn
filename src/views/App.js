import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Thay Switch bằng Routes
import Login from './login/login';
import Home from './Home/Home';
import PostDetail from './Post/PostDetail';
import UserDetail from './User/UserDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>  {/* Thay Switch bằng Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/post/:id" element={<PostDetail />} /> {/* Đường dẫn cho chi tiết bài viết */}
          <Route path="/user/:id" element={<UserDetail />} /> {/* Trang chi tiết người dùng */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
