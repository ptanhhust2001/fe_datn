import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Button, Avatar, Modal, Row, Col, Card } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined, EditOutlined, TeamOutlined, BarsOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './HeaderComponent.css';

const HeaderComponent = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPostModalVisible, setIsPostModalVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUserInfo(null);
                return;
            }

            const response = await axios.get('http://localhost:8080/books/users/my-info', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserInfo(response.data.result);
        } catch (error) {
            console.error("Error fetching user info:", error);
            setUserInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserInfo(null);
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    useEffect(() => {
        fetchUserInfo();
    }, [location]);

    const showPostModal = () => {
        setIsPostModalVisible(true);
    };

    const handlePostModalCancel = () => {
        setIsPostModalVisible(false);
    };

    const showExamModal = () => {
        setIsModalVisible(true);
    };

    const handleExamModalCancel = () => {
        setIsModalVisible(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="header">
            {/* Logo */}
            <div className="logo">
                <Link to="/home">
                    <img
                        src="http://localhost:8080/books/file/logo/tai_lieu_bach_khoa.png"
                        alt="Logo"
                        className="logo-image"
                    />
                </Link>
            </div>

            {/* Nút tạo bài viết */}
            {userInfo && (
                <div className="create-post-button">
                    <Button
                        className="btn-create-post"
                        icon={<PlusOutlined />}
                        onClick={showPostModal}
                    >
                        Tạo Bài Viết
                    </Button>
                </div>
            )}

            {/* Nút thi thử */}
            <div className="exam-button">
                <Link to="/exams">
                    <Button className="btn-exam">
                        Thi Thử
                    </Button>
                </Link>
            </div>

            {/* Nút tạo bài thi */}
            <div className="create-exam-button">
                <Button
                    className="btn-create-exam"
                    icon={<PlusOutlined />}
                    onClick={showExamModal}
                >
                    Tạo Bài Thi
                </Button>
            </div>

            {/* Nút đăng nhập hoặc avatar */}
            <div className="login-button">
                {userInfo ? (
                    <Dropdown
                        overlay={
                            <Menu>
                                {userInfo.roles.some(role => role.name === 'ADMIN') && (
                                    <>
                    
                                        <Menu.Item
                                            key="manage-users"
                                            icon={<TeamOutlined />}
                                            onClick={() => navigate('/admin')}
                                        >
                                            Quản lý người dùng
                                        </Menu.Item>

                                    </>
                                )}
                                <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
                                    Thông tin cá nhân
                                </Menu.Item>
                                <Menu.Item
                                            key="manage-posts"
                                            icon={<EditOutlined />}
                                            onClick={() => navigate('/manage-posts')}
                                        >
                                            Quản lý bài viết
                                    </Menu.Item>
                                    <Menu.Item
                                        key="my-exams"
                                        icon={<BarsOutlined />}
                                        onClick={() => navigate('/exam-management')}

                                    >
                                        Bài thi của tôi
                                    </Menu.Item>
                                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                                    Đăng xuất
                                </Menu.Item>
                            </Menu>
                        }
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button type="text">
                            <Avatar
                                src={userInfo?.avatarUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                icon={<UserOutlined />}
                                size="large"
                            />
                        </Button>
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        style={{ background: 'linear-gradient(to right, #4facfe, #937eff)', color: '#fff' }}
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>

            {/* Modal Tạo bài thi */}
            <Modal
                title="Tạo đề thi mới"
                open={isModalVisible}
                footer={null}
                onCancel={handleExamModalCancel}
                centered
            >
                <Row gutter={[16, 16]} justify="center">
                    <Col span={16}>
                        <Card
                            hoverable
                            className="exam-card"
                            onClick={() => {
                                setIsModalVisible(false);
                                navigate('/create-exam-ai');
                            }}
                        >
                            <div className="exam-card-content">
                                <img src="http://localhost:8080/books/file/logo/c_ai.png" alt="Trợ lý AI" />
                                <h3>Trợ lý AI</h3>
                                <p>Tạo đề thi nhanh hơn với trợ lý AI</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card
                            hoverable
                            className="exam-card"
                            onClick={() => {
                                setIsModalVisible(false); // Tắt popup
                                navigate('/create-exam-by-text'); // Chuyển đến trang tạo bài thi bằng văn bản
                            }}
                        >
                            <div className="exam-card-content">
                                <img src="http://localhost:8080/books/file/logo/c_text.png" alt="Văn bản" />
                                <h3>Văn bản</h3>
                                <p>Tạo đề thi nhanh bằng cách soạn thảo văn bản</p>
                            </div>
                        </Card>

                    </Col>
                </Row>
            </Modal>

            {/* Modal Tạo bài viết */}
            <Modal
                title="Tạo bài viết mới"
                open={isPostModalVisible}
                footer={null}
                onCancel={handlePostModalCancel}
                centered
            >
                <Row gutter={[16, 16]} justify="center">
                    {userInfo?.roles.some(role => ['ADMIN', 'MANAGE'].includes(role.name)) && (
                        <Col span={16}>
                            <Card
                                hoverable
                                className="post-card"
                                onClick={() => {
                                    setIsPostModalVisible(false);
                                    navigate('/create-post');
                                }}
                            >
                                <div className="post-card-content">
                                    <h3>Bài viết hệ thống</h3>
                                    <p>Chỉ dành cho quản trị viên</p>
                                </div>
                            </Card>
                        </Col>
                    )}
                    <Col span={16}>
                        <Card
                            hoverable
                            className="post-card"
                            onClick={() => {
                                setIsPostModalVisible(false);
                                navigate('/create-post-forum');
                            }}
                        >
                            <div className="post-card-content">
                                <h3>Bài viết diễn đàn</h3>
                                <p>Dành cho tất cả người dùng</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default HeaderComponent;
