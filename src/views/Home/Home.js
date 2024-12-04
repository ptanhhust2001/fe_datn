import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Đảm bảo có file CSS tùy chỉnh giao diện

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Nếu không có token, chuyển hướng về trang login
            return;
        }

        // Lấy thông tin người dùng từ API
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/users/my-info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data.result);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng:", err);
            }
        };

        fetchUserInfo();

        // Lấy danh sách bài viết
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/posts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(response.data.value);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải danh sách bài đăng!');
                setLoading(false);
            }
        };

        fetchPosts();
    }, [token, navigate]);

    const handleViewDetails = (id) => {
        navigate(`/post/${id}`); // Điều hướng đến trang chi tiết bài viết
    };

    const toggleMenu = () => setShowMenu(!showMenu); // Hiển thị / ẩn menu người dùng

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="home-container">
            {/* Thanh bar phía trên */}
            <div className="navbar">
                <div className="navbar-left">
                    <h1>Trang chủ</h1>
                </div>
                <div className="navbar-right">
                    <div className="user-info" onClick={toggleMenu}>
                        <img
                            src="https://via.placeholder.com/40" // Thay hình người dùng ở đây
                            alt="User"
                            className="user-avatar"
                        />
                        {showMenu && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate(`/user/${userInfo?.id}`)}>Chi tiết người dùng</button>
                                <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Danh sách bài viết */}
            <div className="posts-list">
                {posts.map((post) => (
                    <div className="post-item" key={post.id}>
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-description">{post.description}</p>
                        <p className="post-author">Tác giả: {post.author}</p>
                        <p className="post-date">
                            Ngày tạo: {new Date(post.createAt).toLocaleString()} | Cập nhật: {new Date(post.updateAt).toLocaleString()}
                        </p>
                        <button className="view-details-btn" onClick={() => handleViewDetails(post.id)}>Xem chi tiết</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
