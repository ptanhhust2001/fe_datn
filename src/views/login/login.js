import React, { useState } from 'react';
import { Form, Input, Button, message, Modal, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const onLoginFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/books/auth/token', {
                username: values.username,
                password: values.password,
            });

            if (response.data.result.authenticated) {
                const token = response.data.result.token;
                localStorage.setItem('token', token);
                navigate('/home');
            } else {
                message.error('Đăng nhập thất bại. Tên người dùng hoặc mật khẩu không chính xác.');
            }
        } catch (error) {
            message.error('Lỗi mạng hoặc hệ thống. Vui lòng thử lại sau.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onRegisterFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/books/users', {
                username: values.username,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                dob: values.dob.format('YYYY-MM-DD'),
            });

            if (response.data.code === 1000) {
                message.success('Đăng ký thành công, vui lòng đăng nhập!');
                setIsRegistering(false);
            } else {
                message.error(response.data.message || 'Đăng ký thất bại, vui lòng thử lại.');
            }
        } catch (error) {
            message.error('Đăng ký thất bại, vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Bên trái với hình ảnh minh họa */}
            <div className="login-illustration">
                <img
                    src="http://localhost:8080/books/file/logo/loginPage.png" // Thay thế bằng liên kết ảnh minh họa
                    alt="Illustration"
                    className="illustration-image"
                />
            </div>

            {/* Bên phải: Form đăng nhập */}
            <div className="login-container">
                <h2 className="login-title">Đăng nhập</h2>

                <Form
                    name="login-form"
                    onFinish={onLoginFinish}
                    layout="vertical"
                    initialValues={{ remember: true }}
                    className="login-form"
                >
                    <Form.Item
                        name="username"
                        label="Tài khoản đăng nhập"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                    >
                        <Input placeholder="Nhập tài khoản hoặc email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu của bạn" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-btn"
                            loading={loading}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Button type="link" onClick={() => setIsRegistering(true)}>
                            Đăng ký tài khoản
                        </Button>
                    </div>
                </Form>

                {/* Modal đăng ký */}
                <Modal
                    title="Đăng ký tài khoản"
                    visible={isRegistering}
                    onCancel={() => setIsRegistering(false)}
                    footer={null}
                    centered
                >
                    <Form
                        name="register-form"
                        onFinish={onRegisterFinish}
                        layout="vertical"
                        initialValues={{ remember: true }}
                        className="register-form"
                    >
                        <Form.Item
                            name="firstName"
                            label="Họ"
                            rules={[{ required: true, message: 'Vui lòng nhập họ của bạn!' }]}
                        >
                            <Input placeholder="Họ" />
                        </Form.Item>

                        <Form.Item
                            name="lastName"
                            label="Tên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            label="Tên người dùng"
                            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                        >
                            <Input placeholder="Tên người dùng" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="dob"
                            label="Ngày sinh"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                        >
                            <DatePicker
                                placeholder="Ngày sinh"
                                style={{ width: '100%' }}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="register-btn"
                                loading={loading}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Login;
