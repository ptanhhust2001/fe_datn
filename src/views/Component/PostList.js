import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Alert, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import PostItem from './PostItem';

const PostList = ({ currentPage, setCurrentPage, pageSize, setTotalPosts }) => {
    const [posts, setPosts] = useState([]); // Danh sách bài viết
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(null); // Lỗi khi tải bài viết
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8080/books/posts', {
                    params: {
                        page: currentPage - 1, // API sử dụng pagination, bắt đầu từ page 0
                        size: pageSize,
                    },
                });

                const data = response.data;
                setPosts(data.value); // Lưu danh sách bài viết
                setTotalPosts(data.totalElements); // Cập nhật tổng số bài viết
                setLoading(false);
            } catch (err) {
                setError('Có lỗi xảy ra khi tải bài viết');
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage, pageSize, setTotalPosts]);

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`); // Chuyển hướng đến trang chi tiết bài viết
    };

    return (
        <div>
            {loading && <Spin tip="Đang tải bài viết..." />}
            {error && !loading && <Alert message="Lỗi" description={error} type="error" />}

            <div className="post-items">
                {posts.map((post) => (
                    <div key={post.id} onClick={() => handlePostClick(post.id)}>
                        <PostItem post={post} />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {!loading && posts.length > 0 && (
                <Pagination
                    current={currentPage}  // Trang hiện tại
                    total={setTotalPosts}   // Tổng số bài viết
                    pageSize={pageSize}     // Số bài viết mỗi trang
                    onChange={(page) => setCurrentPage(page)}  // Cập nhật trang khi người dùng thay đổi
                    showSizeChanger={false}
                    style={{ textAlign: 'center', marginTop: '20px' }}
                />
            )}
        </div>
    );
};

export default PostList;
