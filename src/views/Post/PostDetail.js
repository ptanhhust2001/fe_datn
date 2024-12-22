import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { List, Input, Button, message } from 'antd';
import './PostDetail.css';

const { TextArea } = Input;

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
                    <p><strong>Lớp học:</strong> {post.classEntityName}</p>
                </div>

                {/* Hiển thị danh sách tài liệu */}
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
                                    <p><strong>{comment.createBy}</strong> ({new Date(comment.createAt).toLocaleString()}):</p>
                                    <p>{comment.content}</p>
                                </div>
                            </List.Item>
                        )}
                    />

                    <div className="add-comment">
                        <TextArea
                            rows={4}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Nhập bình luận của bạn..."
                        />
                        <Button type="primary" onClick={handleAddComment} style={{ marginTop: '10px' }}>
                            Thêm bình luận
                        </Button>
                    </div>
                </div>

                <button className="back-btn" onClick={() => navigate('/home')}>Quay lại danh sách bài viết</button>
            </div>
        </div>
    );
};

export default PostDetail;
