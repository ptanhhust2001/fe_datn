import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card, Avatar, Spin, Descriptions, Button } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const { Content } = Layout;

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
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
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="loading">
                <Spin tip="Đang tải thông tin..." />
            </div>
        );
    }

    const handleBackToHome = () => {
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <Layout>
            <Content className="profile-container">
                <Card className="profile-card">
                    <div className="profile-avatar">
                        <Avatar
                            src={userInfo?.avatarUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                            size={120}
                        />
                    </div>
                    <div className="profile-card-title">Thông tin cá nhân</div>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Tên người dùng">{userInfo.username}</Descriptions.Item>
                        <Descriptions.Item label="Họ và tên">{userInfo.firstName} {userInfo.lastName}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">{userInfo.dob}</Descriptions.Item>
                        <Descriptions.Item label="Quyền hạn">
                            {userInfo.roles.map(role => (
                                <div key={role.name}>
                                    <strong>{role.name}</strong>: {role.description}
                                </div>
                            ))}
                        </Descriptions.Item>
                    </Descriptions>
                    <div className="profile-actions">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            className="back-button"
                            onClick={handleBackToHome}
                        >
                            Quay lại
                        </Button>
                        <Button
                            icon={<EditOutlined />}
                            className="edit-button"
                            onClick={handleEditProfile}
                        >
                            Sửa thông tin
                        </Button>
                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default Profile;
