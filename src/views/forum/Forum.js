import React, { useState, useEffect } from 'react';
import { List, Typography, Row, Col, Tag, Layout, Pagination, Avatar } from 'antd';
import {
    EyeOutlined,
    CommentOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBarMenu from '../Home/SideBarMenu';
import './Forum.css';

const { Title, Text } = Typography;
const { Content } = Layout;

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPosts, setTotalPosts] = useState(0); // Tổng số bài viết
    const [pageSize] = useState(10); // Số bài viết mỗi trang
    const navigate = useNavigate();

    const fetchPosts = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/books/posts/community?page=${page - 1}&size=${pageSize}`
            );
            if (response.status === 200) {
                setPosts(response.data.value);
                setTotalPosts(response.data.totalElements); // Lấy tổng số bài viết
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Layout>
            <SideBarMenu />
            {/* Nội dung chính */}
            <Content style={{ padding: '20px', background: '#f9f9f9' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Danh sách bài viết */}
                    <List
                        itemLayout="vertical"
                        dataSource={posts}
                        loading={loading}
                        renderItem={(post) => (
                            <List.Item
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '20px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    cursor: 'pointer',
                                }}
                                onClick={() => navigate(`/post/${post.id}`)} // Chuyển hướng khi nhấn
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={8} md={6}>
                                        <img
                                            src={post.imageFilePath || 'https://via.placeholder.com/200'}
                                            alt="Post banner"
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </Col>
                                    <Col xs={24} sm={16} md={18}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 5 }}>
                                            {new Date(post.createAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </Text>
                                        <Title level={4} style={{ marginBottom: 10 }}>
                                            {post.title}
                                        </Title>
                                        <Text style={{ display: 'block', marginBottom: 15 }}>
                                            {post.description}
                                        </Text>
                                        <div style={{ marginBottom: 10 }}>
                                            {post.tags?.map((tag, index) => (
                                                <Tag key={index} color="blue">
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888' }}>
                                            <Avatar
                                                src={post.authorAvatar || 'https://via.placeholder.com/40'}
                                                size="small"
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text strong>{post.author}</Text>
                                            <CommentOutlined style={{ marginLeft: 15, marginRight: 5 }} />
                                            {post.comments?.length || 0} bình luận
                                            <EyeOutlined style={{ marginLeft: 15, marginRight: 5 }} />
                                            {post.views} lượt xem
                                            <ClockCircleOutlined style={{ marginLeft: 15, marginRight: 5 }} />
                                            {Math.floor(Math.random() * 10 + 1)} phút đọc
                                        </div>
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                    {/* Phân trang */}
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalPosts}
                        onChange={handlePageChange}
                        style={{ marginTop: '20px', textAlign: 'center' }}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Forum;
