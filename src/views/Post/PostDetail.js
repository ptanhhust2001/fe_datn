import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderComponent from '../Home/HeaderComponent'; // Import HeaderComponent
import './PostDetail.css';  // Style cho trang chi tiết bài viết

const PostDetail = () => {
    const { id } = useParams(); // Lấy id bài viết từ URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userInfo = { // Tạm thời sử dụng dữ liệu giả
        avatarUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    };

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

                if (response.status === 200 && response.data.value) {
                    setPost(response.data.value);
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
            {/* Phần Header */}
            <HeaderComponent
                userInfo={userInfo}
                onLogout={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }}
                onProfileClick={() => navigate('/profile')}
                classes={[{ id: 1, name: 'Lớp 10', subjects: [{ id: 1, name: 'Toán' }] }]} // Dữ liệu giả cho lớp
                onClassClick={(classId) => console.log(`Chọn lớp ${classId}`)}
            />

            <div className="post-detail-container">
                {/* Hiển thị ảnh banner nếu có */}
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

                {/* Chúng ta sử dụng 'dangerouslySetInnerHTML' để hiển thị nội dung HTML */}
                <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>

                <div className="post-meta">
                    <p><strong>Môn học:</strong> {post.subjectName}</p>
                    <p><strong>Lớp học:</strong> {post.classEntityName}</p>
                </div>

                <button className="back-btn" onClick={() => navigate('/home')}>Quay lại danh sách bài viết</button>
            </div>
        </div>
    );
};

export default PostDetail;
