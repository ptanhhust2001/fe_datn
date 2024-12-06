// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Menu, Dropdown, Button, Avatar, Spin } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PostList from '../Component/PostList';
import './Home.css';

const { Header, Content } = Layout;

const Home = () => {
    const [userInfo, setUserInfo] = useState(null); // User information
    const [loading, setLoading] = useState(true); // Loading state
    const [classes, setClasses] = useState([]); // Class data
    const [currentPage, setCurrentPage] = useState(1); // Current page for posts
    const [totalPosts, setTotalPosts] = useState(0); // Total number of posts
    const [pageSize] = useState(10); // Number of posts per page
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Get token from localStorage

    // Fetch user data
    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if no token
            return;
        }

        // Fetch user info
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/users/my-info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data.result); // Update user info
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user info:", error);
                setLoading(false);
            }
        };

        // Fetch classes data
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/class', {
                    headers: { accept: '*/*' }
                });
                setClasses(response.data.value); // Update classes list
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };

        fetchUserInfo();
        fetchClasses();
    }, [token, navigate]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    // Handle viewing profile
    const handleViewProfile = () => {
        navigate('/profile'); // Redirect to profile page
    };

    // Menu for user dropdown (Profile and Logout)
    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />} onClick={handleViewProfile}>
                Thông tin cá nhân
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    // Menu for class dropdown
    const classMenu = (
        <Menu>
            {classes.map((classItem) => (
                <Menu.Item key={classItem.id} onClick={() => navigate(`/class/${classItem.id}`)}>
                    {classItem.name}
                </Menu.Item>
            ))}
        </Menu>
    );

    // Show loading spinner if data is loading
    if (loading) {
        return <div className="loading"><Spin tip="Đang tải thông tin..." /></div>;
    }

    return (
        <Layout>
            <Header className="header">
                <div className="logo">Trang chủ</div>

                {/* Dropdown menu for classes */}
                <Dropdown overlay={classMenu} trigger={['click']} placement="bottomLeft">
                    <Button type="text" style={{ marginLeft: '20px' }}>
                        Lớp học
                    </Button>
                </Dropdown>

                {/* Avatar dropdown menu for user */}
                <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                    <Button type="text">
                        <Avatar
                            src={userInfo.avatarUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                            icon={<UserOutlined />}
                            size="large"
                        />
                    </Button>
                </Dropdown>
            </Header>

            <Content style={{ padding: '20px' }}>
                <div className="post-list-container">
                    {/* Using PostList component for displaying posts */}
                    <PostList
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setTotalPosts={setTotalPosts} // Passing setTotalPosts for updating totalPosts
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Home;
