// src/components/PostList.js
import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import { Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";

// Hàm giả lập fetching các bài viết từ API
const fetchPosts = async (page, size) => {
    try {
        const response = await fetch(`http://localhost:8080/books/posts?page=${page - 1}&size=${size}`);
        const data = await response.json();
        return {
            posts: data.value,
            totalPages: data.totalPages, // Số trang tổng cộng
            totalPosts: data.totalElements, // Tổng số bài viết
        };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { posts: [], totalPages: 0, totalPosts: 0 };
    }
};

const PostList = ({ currentPage, setCurrentPage, pageSize, setTotalPosts }) => {
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getPosts = async () => {
            setLoading(true);
            setError(null);  // Reset error state
            const { posts, totalPages, totalPosts } = await fetchPosts(currentPage, pageSize); // Fetch posts cho trang hiện tại
            if (posts.length === 0) {
                setError("Không có bài viết nào");
            }
            setPosts(posts);
            setTotalPages(totalPages);
            setTotalPosts(totalPosts); // Cập nhật totalPosts từ API để sử dụng sau
            setLoading(false);
        };

        getPosts();
    }, [currentPage, pageSize, setTotalPosts]);

    // Hàm xử lý khi người dùng nhấn vào bài viết
    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`); // Chuyển hướng đến trang chi tiết bài viết với ID bài viết
    };

    return (
        <div className="post-list">
            {loading && (
                <div className="loading">
                    <Spin tip="Đang tải bài viết..." />
                </div>
            )}

            {error && !loading && (
                <Alert
                    message="Lỗi"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: "20px" }}
                />
            )}

            {posts.length === 0 && !loading && !error && (
                <p>Không có bài viết nào.</p>
            )}

            <div className="post-items">
                {posts.map((post) => (
                    <div key={post.id} onClick={() => handlePostClick(post.id)}>
                        <PostItem post={post} />
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostList;
