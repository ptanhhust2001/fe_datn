import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { List, Input, Button, message, Avatar, Row, Col, Tabs } from 'antd';
import { SmileOutlined, PictureOutlined, QuestionCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './PostDetail.css';

const { TextArea } = Input;
const { TabPane } = Tabs;

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/books/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.status === 200) {
                    setPost(response.data.value);
                    setComments(response.data.value.comments || []);
                } else {
                    setError('Bài viết không tồn tại');
                }
            } catch (err) {
                setError('Không thể tải chi tiết bài viết');
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id, token, navigate]);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            message.error('Nội dung bình luận không được để trống!');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/books/comments',
                { content: newComment, postId: post.id },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                message.success('Thêm bình luận thành công!');
                setComments([...comments, response.data.value]);
                setNewComment('');
            } else {
                message.error('Không thể thêm bình luận.');
            }
        } catch (err) {
            console.error(err);
            message.error('Có lỗi xảy ra khi thêm bình luận.');
        }
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!post) {
        return <div className="error">Bài viết không tồn tại</div>;
    }

    return (
        <div className="post-detail-page">
            <div className="post-detail-container">
                <Button
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/home')}
                    style={{ marginBottom: '20px' }}
                >
                    Quay lại Trang chủ
                </Button>
                {post.imageFilePath && (
                    <div className="post-banner">
                        <img src={post.imageFilePath} alt={post.title} className="banner-image" />
                    </div>
                )}

                <h2>{post.title}</h2>
                <p className="post-author">Tác giả: {post.author}</p>
                <p className="post-date">
                    Ngày tạo: {new Date(post.createAt).toLocaleString()} | Cập nhật: {new Date(post.updateAt).toLocaleString()}
                </p>

                <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>

                <div className="post-meta">
                    <p><strong>Môn học:</strong> {post.subjectName}</p>
                    <p><strong>lớp/khoa/viện:</strong> {post.classEntityName}</p>
                </div>

                {post.materials && post.materials.length > 0 && (
                    <div className="materials-section">
                        <h3>Tài liệu</h3>
                        <List
                            bordered
                            dataSource={post.materials}
                            renderItem={(material) => (
                                <List.Item>
                                    <a href={material.urlFile} target="_blank" rel="noopener noreferrer">
                                        {material.name}
                                    </a>
                                </List.Item>
                            )}
                        />
                    </div>
                )}

                <div className="comments-section">
                    <h3>Bình luận</h3>
                    <List
                        dataSource={comments}
                        renderItem={(comment) => (
                            <List.Item key={comment.id}>
                                <div>
                                    <p>
                                        <strong>{comment.createBy}</strong> ({new Date(comment.createAt).toLocaleString()}):
                                    </p>
                                    <p>{comment.content}</p>
                                </div>
                            </List.Item>
                        )}
                    />

                    <div className="add-comment" style={{ marginTop: '20px', border: '1px solid #d9d9d9', borderRadius: '5px', padding: '10px' }}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Viết" key="1">
                                <TextArea
                                    rows={4}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Viết bình luận..."
                                    style={{ marginBottom: '10px' }}
                                />
                            </TabPane>
                            <TabPane tab="Xem trước" key="2">
                                <div style={{ border: '1px solid #f0f0f0', padding: '10px', borderRadius: '5px' }}>
                                    {newComment || 'Nội dung xem trước bình luận của bạn...'}
                                </div>
                            </TabPane>
                        </Tabs>
                        <Row justify="space-between" align="middle" style={{ marginTop: '10px' }}>
                            <Col>
                                <Button type="text" style={{ color: '#888' }} onClick={() => setNewComment('')}>
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Trả lời
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
