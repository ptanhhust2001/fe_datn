import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Space, message, Popconfirm, Spin } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ManagePosts = () => {
    const [userId, setUserId] = useState(null); // Lưu trữ userId
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const navigate = useNavigate();

    // Gọi API lấy thông tin người dùng
    const fetchUserInfo = async () => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (!token) {
            message.error('Không có token, vui lòng đăng nhập');
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
            return;
        }

        try {
            const response = await axios.get('http://localhost:8080/books/users/my-info', {
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${token}` // Gửi token qua header
                }
            });

            const data = response.data.result;

            // Kiểm tra vai trò của người dùng
            const userRoles = data.roles.map((role) => role.name);
            if (!userRoles.includes('ADMIN') && !userRoles.includes('MANAGER')) {
                message.error('Bạn không có quyền truy cập');
                navigate('/unauthorized'); // Chuyển hướng đến trang không có quyền truy cập
                return;
            }

            setUserId(data.id); // Lưu userId từ kết quả trả về
        } catch (error) {
            console.error('Error fetching user info:', error);
            message.error('Lỗi khi lấy thông tin người dùng');
            navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu có lỗi
        }
    };


    // Gọi API lấy danh sách bài viết
    const fetchPosts = async () => {
        if (!userId) return; // Chờ userId được tải về

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/books/posts', {
                params: {
                    advanceSearch: `user.id＝${userId}`, // Tìm kiếm bài viết của user hiện tại
                    page: 0,
                    size: 2147483647
                },
                headers: {
                    accept: '*/*'
                }
            });

            const data = response.data.value;
            setPosts(data);
            setFilteredPosts(data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    // Xóa bài viết
    const deletePost = async (postId) => {
        try {
            await axios.delete(`http://localhost:8080/books/posts`, {
                params: { ids: postId }
            });
            message.success('Xóa bài viết thành công');
            fetchPosts(); // Tải lại danh sách bài viết sau khi xóa
        } catch (error) {
            message.error('Lỗi khi xóa bài viết');
        }
    };

    // Tìm kiếm bài viết
    const handleSearch = (value) => {
        setSearchValue(value);
        if (value) {
            const filtered = posts.filter((post) =>
                post.title.toLowerCase().includes(value.toLowerCase()) ||
                post.description.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPosts(filtered);
        } else {
            setFilteredPosts(posts);
        }
    };

    // Lấy thông tin người dùng và danh sách bài viết
    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [userId]); // Gọi fetchPosts sau khi userId được cập nhật

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <a
                    onClick={() => navigate(`/post/${record.id}`)}
                    style={{ cursor: 'pointer', color: '#1890ff' }}
                >
                    {text}
                </a>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author'
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        onClick={() => navigate(`/edit-post/${record.id}`)}
                    >
                        Chỉnh sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa bài viết này không?"
                        onConfirm={() => deletePost(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }

    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Quản lý bài viết</h1>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm bài viết"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </Space>

            {loading ? (
                <Spin tip="Đang tải bài viết..." />
            ) : (
                <Table
                    dataSource={filteredPosts}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
};

export default ManagePosts;
