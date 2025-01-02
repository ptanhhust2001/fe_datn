// components/PostList.js
import React from 'react';
import { List, Row, Col, Typography, Divider } from 'antd';
import { FolderOpenOutlined, ClockCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Title, Text } = Typography;

const PostList = ({ posts, loading, onPostClick }) => {
    return (
        <List
            itemLayout="vertical"
            dataSource={posts}
            loading={loading}
            renderItem={(post) => (
                <List.Item
                    key={post.id}
                    className="post-item"
                    onClick={() => onPostClick(post.id)}
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
    );
};

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    onPostClick: PropTypes.func.isRequired,
};

export default PostList;
