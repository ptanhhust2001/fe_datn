import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card, Avatar, Spin, Descriptions, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'; // Import icon mũi tên
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Nếu không có token, chuyển hướng về trang login
            return;
        }

        // Lấy thông tin người dùng
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/users/my-info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data.result); // Cập nhật thông tin người dùng
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [token, navigate]);

    if (loading) {
        return <div className="loading"><Spin tip="Đang tải thông tin..." /></div>;
    }

    // Xử lý quay lại trang Home
    const handleBackToHome = () => {
        navigate('/home'); // Quay lại trang Home
    };

    // Xử lý chuyển hướng đến trang chỉnh sửa
    const handleEditProfile = () => {
        navigate('/edit-profile'); // Chuyển hướng đến trang chỉnh sửa thông tin
    };

    return (
        <Layout>
            <Content style={{ padding: '20px' }}>
                <div className="profile-container">
                    {/* Nút quay lại trang chủ */}
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBackToHome}
                        style={{ marginBottom: '20px' }}
                    >
                        Quay lại trang chủ
                    </Button>

                    <Card title="Thông tin cá nhân" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Avatar
                                src={userInfo.avatarUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                size={100}
                            />
                        </div>
                        <Descriptions bordered column={1} style={{ marginTop: '20px' }}>
                            <Descriptions.Item label="Tên người dùng">{userInfo.username}</Descriptions.Item>
                            <Descriptions.Item label="Họ và tên">{userInfo.firstName} {userInfo.lastName}</Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">{userInfo.dob}</Descriptions.Item>
                            <Descriptions.Item label="Quyền hạn">
                                {userInfo.roles.map(role => (
                                    <div key={role.name}>
                                        <strong>{role.name}</strong>: {role.description}
                                        <ul>
                                            {role.permissions.map(permission => (
                                                <li key={permission.name}>{permission.name}: {permission.description}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Nút sửa thông tin */}
                    <Button
                        type="primary"
                        style={{ marginTop: '20px' }}
                        onClick={handleEditProfile}
                    >
                        Sửa thông tin
                    </Button>
                </div>
            </Content>
        </Layout>
    );
};

export default Profile;
