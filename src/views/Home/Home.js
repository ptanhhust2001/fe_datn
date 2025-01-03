import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Layout,
    Spin,
    Row,
    Col,
    Typography,
    List,
    Card,
    Divider,
    Pagination,
    Select,
    Input,
    Button,
} from 'antd';
import { ArrowRightOutlined, ClockCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import SideBarMenu from './SideBarMenu';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);
    const [classes, setClasses] = useState([]); // Danh sách lớp học
    const [subjects, setSubjects] = useState([]); // Danh sách môn học
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

    return (
        <Layout style={{ width: '100%', height: '100%' }}>
            <SideBarMenu />
            <Content style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <Row gutter={20}>
                    {/* Filters */}
                    <Col span={24}>
                        <Card bordered={false} className="filter-card">
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Select
                                        placeholder="Chọn lớp/khoa/viện"
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
                                <Col span={6}>
                                    <Select
                                        placeholder="Chọn môn học"
                                        onChange={(value) => handleFilterChange('subjectId', value)}
                                        style={{ width: '100%' }}
                                        allowClear
                                        disabled={!filters.classId} // Vô hiệu hóa nếu chưa chọn lớp
                                    >
                                        {subjects.map((subject) => (
                                            <Option key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={6}>
                                    <Select
                                        placeholder="Loại bài viết"
                                        onChange={(value) => handleFilterChange('type', value)}
                                        style={{ width: '100%' }}
                                        allowClear
                                    >
                                        <Option value="EXAM_QUESTION">Đề thi</Option>
                                        <Option value="DOCUMENT">Bài viết</Option>
                                    </Select>
                                </Col>
                                <Col span={4}>
                                    <Input
                                        placeholder="Nhập từ khóa"
                                        onChange={(e) => handleFilterChange('name', e.target.value)}
                                        value={filters.name}
                                    />
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" onClick={() => fetchPosts(1)}>
                                        Tìm kiếm
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Post List */}
                <Row gutter={20} style={{ marginTop: '20px' }}>
                    <Col xs={24} lg={18}>
                        <Card bordered={false} className="main-content">
                            <Spin spinning={loading} tip="Đang tải bài viết...">
                                <List
                                    itemLayout="vertical"
                                    dataSource={posts}
                                    renderItem={(post) => (
                                        <List.Item
                                            key={post.id}
                                            className="post-item"
                                            onClick={() => handlePostClick(post.id)}
                                        >
                                            <Row gutter={16}>
                                                <Col span={6}>
                                                    <img
                                                        src={
                                                            post.imageFilePath ||
                                                            'http://localhost:8080/books/file/logo/tai_lieu_bach_khoa.png'
                                                        }
                                                        alt={post.title}
                                                        className="post-thumbnail"
                                                    />
                                                </Col>
                                                <Col span={18}>
                                                    <Title level={5} className="post-title">
                                                        {post.title}
                                                    </Title>
                                                    <Text className="post-description">
                                                        {post.description}
                                                    </Text>
                                                    <div className="post-meta">
                                                        <Text type="secondary">
                                                            <FolderOpenOutlined />{' '}
                                                            {post.subjectName || 'Chưa phân loại'} {'-'}{' '}
                                                            {post.classEntityName || 'Chưa phân loại'}
                                                        </Text>
                                                        <Divider type="vertical" />
                                                        <Text type="secondary">
                                                            <ClockCircleOutlined />{' '}
                                                            {new Date(post.createAt).toLocaleDateString()}
                                                        </Text>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </List.Item>
                                    )}
                                />
                            </Spin>
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

export default Home;
