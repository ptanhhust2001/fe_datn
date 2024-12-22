import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Table, Button, Modal, Form, Input, Spin, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data.result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token, navigate]);

    const openModal = (user = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue({
                firstName: user.firstName,
                lastName: user.lastName,
                dob: user.dob,
            });
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/books/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Xóa người dùng thành công!');
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error('Có lỗi xảy ra khi xóa người dùng.');
        }
    };

    const handleSave = async (values) => {
        try {
            if (editingUser) {
                // Sửa người dùng (chỉ sửa firstName, lastName, dob)
                await axios.put(`http://localhost:8080/books/users/${editingUser.id}`, values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success('Cập nhật người dùng thành công!');
                setUsers(users.map(user => (user.id === editingUser.id ? { ...user, ...values } : user)));
            } else {
                const response = await axios.post('http://localhost:8080/books/users', values, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                message.success('Thêm người dùng thành công!');
                setUsers([...users, response.data.result]);
            }
            closeModal();
        } catch (error) {
            console.error("Error saving user:", error);
            message.error('Có lỗi xảy ra khi lưu người dùng.');
        }
    };

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text, record) => `${record.firstName} ${record.lastName}`
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="link" onClick={() => openModal(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    if (loading) {
        return <div className="loading"><Spin tip="Đang tải danh sách người dùng..." /></div>;
    }

    return (
        <Layout>
            <Content style={{ padding: '20px' }}>
                <div className="admin-container">
                    <h1>Quản lý người dùng</h1>
                    <Button type="primary" style={{ marginBottom: '20px' }} onClick={() => openModal()}>
                        Thêm người dùng
                    </Button>
                    <Table
                        columns={columns}
                        dataSource={users}
                        rowKey="id"
                        pagination={false}
                    />
                </div>

                {/* Modal Thêm/Sửa người dùng */}
                <Modal
                    title={editingUser ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
                    visible={isModalOpen}
                    onCancel={closeModal}
                    footer={null}
                >
                    <Form form={form} onFinish={handleSave}>
                        {/* Chỉ cho phép sửa các trường firstName, lastName, dob */}
                        <Form.Item
                            label="Họ"
                            name="firstName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tên"
                            name="lastName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Ngày sinh"
                            name="dob"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default Admin;
