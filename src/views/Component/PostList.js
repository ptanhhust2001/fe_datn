import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Alert, Pagination } from 'antd';
import PostItem from './PostItem';
import './PostList.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8080/books/posts', {
                    params: {
                        page: currentPage - 1,
                        size: pageSize,
                    },
                });

                const data = response.data;
                setPosts(data.value);
                setTotalPosts(data.totalElements);
            } catch (err) {
                setError('Có lỗi xảy ra khi tải bài viết');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage, pageSize]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="post-list-container">
            {loading && <Spin tip="Đang tải bài viết..." />}
            {error && !loading && <Alert message="Lỗi" description={error} type="error" />}

            <div className="post-items">
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalPosts}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
        </div>
    );
};

export default PostList;
