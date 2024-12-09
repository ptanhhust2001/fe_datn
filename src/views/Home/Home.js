// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import PostList from '../Component/PostList';  // Giả sử bạn có component này để hiển thị danh sách bài viết
import HeaderComponent from './HeaderComponent'; // Import HeaderComponent từ thư mục Component
import './Home.css';

const { Header, Content } = Layout;

const Home = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPosts, setTotalPosts] = useState(0); // Tổng số bài viết
    const [pageSize] = useState(10); // Số lượng bài viết mỗi trang
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    // Lấy thông tin người dùng và danh sách lớp học
    useEffect(() => {
        if (!token) {
            navigate('/login'); // Nếu không có token, chuyển hướng tới trang login
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/users/my-info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data.result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user info:", error);
                setLoading(false);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/class', {
                    headers: { accept: '*/*' }
                });
                setClasses(response.data.value);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        fetchUserInfo();
        fetchClasses();
    }, [token, navigate]);

    // Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa token khỏi localStorage
        navigate('/login'); // Chuyển hướng đến trang login
    };

    // Xem thông tin cá nhân
    const handleViewProfile = () => {
        navigate('/profile');
    };

    // Xử lý khi nhấp vào lớp học
    const handleClassClick = (classId) => {
        navigate(`/class/${classId}`);
    };

    // Hiển thị Loading nếu đang tải thông tin
    if (loading) {
        return (
            <div className="loading">
                <Spin tip="Đang tải thông tin..." />
            </div>
        );
    }

    return (
        <Layout>
            {/* Phần header sẽ luôn hiển thị với HeaderComponent */}
            <Header className="header">
                <HeaderComponent
                    userInfo={userInfo}
                    onLogout={handleLogout}
                    onProfileClick={handleViewProfile}
                    classes={classes}
                    onClassClick={handleClassClick}
                />
            </Header>

            {/* Nội dung chính của trang */}
            <Content style={{ padding: '20px' }}>
                <div className="post-list-container">
                    {/* Component PostList hỗ trợ phân trang */}
                    <PostList
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setTotalPosts={setTotalPosts}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Home;
