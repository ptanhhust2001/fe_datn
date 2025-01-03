import React, { useState, useEffect } from 'react';
import { List, Typography, Row, Col, Layout, Pagination, Input, Button, Card, Divider } from 'antd';
import { SearchOutlined, FolderOpenOutlined, ArrowRightOutlined, CommentOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
    const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
    const navigate = useNavigate();

    const fetchPosts = async (page, keyword = '') => {
        setLoading(true);
        try {
            if (keyword != '') {
                keyword = 'advanceSearch=title～' + keyword
            }
            const response = await axios.get(
                `http://localhost:8080/books/posts/community?page=${page - 1}&size=${pageSize}&${keyword}`
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
        fetchPosts(currentPage, searchKeyword);
    }, [currentPage, searchKeyword]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
        fetchPosts(1, searchKeyword);
    };

    return (
        <Layout style={{ width: '100%', height: '100%' }}>
            <SideBarMenu />
            <Content style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Thanh tìm kiếm */}
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Input
                                placeholder="Nhập từ khóa tìm kiếm"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                suffix={<SearchOutlined />}
                                style={{ width: '20%' }}
                                onPressEnter={handleSearch}
                            />
                            <Button type="primary" onClick={handleSearch} style={{ marginTop: '10px' }}>
                                Tìm kiếm
                            </Button>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={20}>
                    {/* Danh sách bài viết */}
                    <Col xs={24} lg={18}>
                        <Card bordered={false} className="main-content">
                            <List
                                itemLayout="vertical"
                                dataSource={posts}
                                loading={loading}
                                renderItem={(post) => (
                                    <List.Item
                                        key={post.id}
                                        className="post-item"
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '15px',
                                            marginBottom: '20px',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate(`/post/${post.id}`)}
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
                                                <div style={{ fontSize: '12px', color: '#888' }}>
                                                    <CommentOutlined style={{ marginRight: 5 }} />
                                                    {post.comments?.length || 0} bình luận
                                                    <EyeOutlined style={{ marginLeft: 15, marginRight: 5 }} />
                                                    {post.views} lượt xem
                                                    {/* <ClockCircleOutlined style={{ marginLeft: 15, marginRight: 5 }} />
                                                    {Math.floor(Math.random() * 10 + 1)} phút đọc */}
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
                        </Card>
                    </Col>

                    {/* Sidebar */}
                    <Col xs={24} lg={6}>
                        <Card bordered={false} className="sidebar">
                            <div className="sidebar-section">
                                <Title level={5}>Danh mục tài liệu</Title>
                                <List
                                    dataSource={[
                                        { name: 'Đề cương và bài giảng các môn toán đại cương (FAMI)', url: 'https://fami.hust.edu.vn/de-cuong-mon-hoc/' },
                                        { name: 'Tổng hợp các đề thi và bài giảng các môn học', url: 'https://cuuduongthancong.com/npm' },
                                        { name: 'Tổng hợp chi tiết tài liệu ôn tập của các môn đại cương (tailieuhust)', url: 'https://tailieuhust.com/' },

                                    ]}
                                    renderItem={(item) => (
                                        <List.Item className="document-category-item">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FolderOpenOutlined className="icon" />
                                                {item.name}
                                                <ArrowRightOutlined className="arrow" />
                                            </a>
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <Divider />

                            <div className="sidebar-section">
                                <Title level={5}>Các khóa học Online</Title>
                                <List
                                    dataSource={[
                                        { name: 'Các khóa học của DHBK Hà Nội', url: 'https://lms.hust.edu.vn/' },
                                        { name: 'Các khóa học Online về lập trình, giao tiếp, ... Không nên bỏ qua. (Udemy)', url: 'https://www.udemy.com/' },
                                        { name: 'Tổng hợp các khóa học chứng chỉ của google, meta, ... (Coursera)', url: 'https://www.coursera.org/' },
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item className="document-category-item">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.name}
                                                <ArrowRightOutlined className="arrow" />
                                            </a>
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <Divider />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Forum;
