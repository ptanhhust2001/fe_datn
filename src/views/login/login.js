import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    // Xử lý đăng nhập
    const onLoginFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/books/auth/token', {
                username: values.username,
                password: values.password,
            });

            // if (response.data.code !== 0) {
            //     message.error(response.data.message || 'Đăng nhập thất bại.');
            //     return;
            // }

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
        }
    };

    // Xử lý đăng ký
    const onRegisterFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/books/users', {
                username: values.username,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                dob: values.dob, // Gửi ngày sinh trực tiếp
            });

            // Thông báo thành công và chuyển hướng về trang đăng nhập
            if (response.data.code === 0) {
                message.success('Đăng ký thành công, vui lòng đăng nhập!');
                setIsRegistering(false); // Đóng modal đăng ký
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
        <div className="login-container">
            <h2>Đăng Nhập</h2>
            <Form
                name="login-form"
                onFinish={onLoginFinish}
                layout="vertical"
                initialValues={{ remember: true }}
                className="login-form"
            >
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
                        Chưa có tài khoản? Đăng ký ngay
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
                        <Input placeholder="Ngày sinh (YYYY-MM-DD)" />
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
    );
};

export default Login;
