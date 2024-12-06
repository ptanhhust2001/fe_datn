import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card, Avatar, Form, Input, Button, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const EditProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

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

    if (!userInfo) {
        return <div className="loading">Không có thông tin người dùng</div>; // Hiển thị thông báo nếu không có thông tin người dùng
    }

    // Xử lý gửi form cập nhật thông tin người dùng
    const handleSave = async (values) => {
        try {
            const response = await axios.put(`http://localhost:8080/books/users/${userInfo.id}`, values, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Cập nhật thành công!');

            // Chuyển hướng về trang profile sau khi cập nhật thành công
            navigate('/profile');

        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            message.error('Có lỗi xảy ra khi cập nhật thông tin.');
        }
    };

    return (
        <Layout>
            <Content style={{ padding: '20px' }}>
                <div className="profile-container">
                    <Card title="Chỉnh sửa thông tin cá nhân" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Form
                            initialValues={{
                                firstName: userInfo.firstName,
                                lastName: userInfo.lastName,
                                dob: userInfo.dob,
                                avatarUrl: userInfo.avatarUrl,
                                // Thêm các trường khác nếu cần
                            }}
                            onFinish={handleSave}
                        >
                            <Form.Item label="Họ" name="firstName">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Tên" name="lastName">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Ngày sinh" name="dob">
                                <Input />
                            </Form.Item>

                            <Form.Item label="URL Ảnh đại diện" name="avatarUrl">
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
};

export default EditProfile;
