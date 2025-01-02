import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Spin, Row, Col, Typography, List, Card, Divider, Pagination, Select, Input, Button, Menu } from 'antd';
import { HomeOutlined, FileTextOutlined, CommentOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PostList from '../Post/PostList';
import './Home.css';
import { ArrowRightOutlined, ClockCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
import SideBarMenu from './SideBarMenu';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filters, setFilters] = useState({ classId: null, subjectId: null, name: '', type: null });
    const navigate = useNavigate();

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/books/class');
            if (response.data.status === 200) {
                setClasses(response.data.value);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchPosts = async (page) => {
        setLoading(true);
        try {
            const { classId, subjectId, name, type } = filters;
            const advanceSearch = [
                classId && `classEntity.id＝${classId}`,
                subjectId && `subject.id＝${subjectId}`,
                name && `title～${name}`,
                type && `type＝${type}`,
            ]
                .filter(Boolean)
                .join('＆');

            const params = {
                page: page - 1,
                size: pageSize,
                ...(advanceSearch && { advanceSearch }),
            };

            const response = await axios.get('http://localhost:8080/books/posts/internal', { params });

            setPosts(response.data.value || []);
            setTotalPosts(response.data.totalElements || 0);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchPosts(currentPage);
    }, [currentPage, filters]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        if (key === 'classId') {
            const selectedClass = classes.find((c) => c.id === value);
            setSubjects(selectedClass ? selectedClass.subjects : []);
            setFilters((prev) => ({ ...prev, subjectId: null }));
        }
        setCurrentPage(1);
    };

    const menuItems = [
        { key: 'home', icon: <HomeOutlined />, label: 'Home', onClick: () => navigate('/') },
        { key: 'exam', icon: <FileTextOutlined />, label: 'Đề thi', onClick: () => navigate('/exams') },
        { key: 'forum', icon: <CommentOutlined />, label: 'Diễn đàn', onClick: () => navigate('/forum') },
    ];

    return (
        <Layout style={{ width: '100%', height: '100%' }}>
            
            <Row>
                {/* Sidebar bên trái */}
                <SideBarMenu />
                <Col xs={20}>
                    <Content style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <Row gutter={20}>
                            <Col span={24}>
                                <Card bordered={false} className="filter-card">
                                    <Row gutter={16}>
                                        <Col span={6}>
                                            <Select
                                                placeholder="Chọn lớp"
                                                onChange={(value) => handleFilterChange('classId', value)}
                                                style={{ width: '100%' }}
                                                allowClear
                                            >
                                                {classes.map((cls) => (
                                                    <Option key={cls.id} value={cls.id}>
                                                        {cls.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Col>
                                        {/* Các bộ lọc khác */}
                                    </Row>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={20} style={{ marginTop: '20px' }}>
                            <Col xs={24} lg={18}>
                                <Card bordered={false} className="main-content">
                                    <PostList posts={posts} loading={loading} onPostClick={handlePostClick} />
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={totalPosts}
                                        onChange={handlePageChange}
                                        style={{ marginTop: '20px', textAlign: 'center' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} lg={6}>
                        <Card bordered={false} className="sidebar">
                            <div className="sidebar-section">
                            <Title level={5}>Danh mục tài liệu</Title>
                                <List
                                    dataSource={[
                                        { name: 'Tài liệu HUST', url: 'https://tailieuhust.com/' },
                                        { name: 'Đề cương và bài giảng các môn toán đại cương', url: 'https://fami.hust.edu.vn/de-cuong-mon-hoc/' },
                                        { name: 'Tổng hợp các đề thi và bài giảng các môn học', url: 'https://cuuduongthancong.com/npm' },
                                    ]}
                                    renderItem={(item) => (
                                        <List.Item className="document-category-item">
                                            <a
                                                href={item.url} // Chuyển hướng đến URL chỉ định
                                                target="_blank" // Mở trong tab mới
                                                rel="noopener noreferrer" // Bảo mật
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
                                                href={item.url} // Chuyển hướng đến URL chỉ định
                                                target="_blank" // Mở trong tab mới
                                                rel="noopener noreferrer" // Bảo mật
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
                </Col>
            </Row>
        </Layout>
    );
};

export default Home;
