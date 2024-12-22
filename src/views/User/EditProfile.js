import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card, Avatar, Form, Input, Button, Spin, DatePicker, message, Upload } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState('');
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
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userInfo = response.data.result;
                setUserInfo(userInfo);
                setAvatarUrl(userInfo.avatarUrl || '');
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="profile-container">
                <Spin tip="Đang tải thông tin..." />
            </div>
        );
    }

    if (!userInfo) {
        return <div className="profile-container">Không có thông tin người dùng</div>;
    }

    const handleSave = async (values) => {
        try {
            const payload = {
                ...values,
                dob: values.dob.format('YYYY-MM-DD'),
                avatarUrl: avatarUrl,
            };
            await axios.put(`http://localhost:8080/books/users/${userInfo.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Cập nhật thành công!');
            navigate('/profile'); // Quay lại trang profile
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            message.error('Có lỗi xảy ra khi cập nhật thông tin.');
        }
    };

    const handleCancel = () => {
        navigate('/profile'); // Quay lại trang profile khi nhấn nút Hủy
    };

    const handleAvatarChange = async ({ file }) => {
        if (file.status === 'removed') {
            setAvatarUrl('');
            return;
        }

        const formData = new FormData();
        formData.append('file', file.originFileObj);

        try {
            const response = await axios.post('http://localhost:8080/books/upload-avatar', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
            setAvatarUrl(response.data.url);
            message.success('Tải ảnh đại diện thành công!');
        } catch (error) {
            console.error('Lỗi khi tải ảnh đại diện:', error);
            message.error('Lỗi khi tải ảnh đại diện.');
        }
    };

    return (
        <div className="profile-container">
            <div className="card-container">
                <Card title="Chỉnh sửa thông tin cá nhân" bordered={false}>
                    <div className="avatar-section" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Avatar
                            src={avatarUrl || <UserOutlined />}
                            size={100}
                            style={{ marginBottom: '10px' }}
                        />
                        <Upload
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleAvatarChange}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
                        </Upload>
                    </div>

                    <Form
                        layout="vertical"
                        initialValues={{
                            firstName: userInfo.firstName,
                            lastName: userInfo.lastName,
                            dob: moment(userInfo.dob),
                        }}
                        onFinish={handleSave}
                    >
                        <Form.Item label="Họ" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
                            <Input placeholder="Nhập họ" />
                        </Form.Item>

                        <Form.Item label="Tên" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                            <Input placeholder="Nhập tên" />
                        </Form.Item>

                        <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block style={{ marginBottom: '10px' }}>
                                Lưu thay đổi
                            </Button>
                            <Button type="default" onClick={handleCancel} block>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default EditProfile;
