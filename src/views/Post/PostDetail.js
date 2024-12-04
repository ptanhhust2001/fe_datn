import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';  // Style cho trang chi tiết bài viết

const PostDetail = () => {
    const { id } = useParams(); // Lấy id bài viết từ URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');  // Nếu không có token, chuyển hướng về trang login
            return;
        }

        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/books/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPost(response.data.value);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải chi tiết bài viết');
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id, token, navigate]);

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
        <div className="post-detail-container">
            <h2>{post.title}</h2>
            <p className="post-author">Tác giả: {post.author}</p>
            <p className="post-date">
                Ngày tạo: {new Date(post.createAt).toLocaleString()} | Cập nhật: {new Date(post.updateAt).toLocaleString()}
            </p>
            <div className="post-content">
                <p>{post.content}</p>
            </div>
            <button className="back-btn" onClick={() => navigate('/home')}>Quay lại danh sách bài viết</button>
        </div>
    );
};

export default PostDetail;
