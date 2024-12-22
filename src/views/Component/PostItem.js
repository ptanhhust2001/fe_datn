import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostItem.css';

const PostItem = ({ post }) => {
    const { id, title, description, imageFilePath, classEntityName, subjectName, createAt } = post;
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/post/${id}`);
    };

    return (
        <article id={`post-${id}`} className="post">
            <div className="entry-image" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
                <img
                    src={imageFilePath || '/placeholder.png'} // Sử dụng ảnh mặc định nếu không có hình
                    alt={title}
                />
            </div>

            <div className="entry-content">
                <h2 className="blog-single-title" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
                    {title}
                </h2>

                <p>
                    {description}
                    <a href={`/post/${id}`} className="read-more"> Xem tiếp »</a>
                </p>

                <div className="entry-meta">
                    <span className="blog-label">
                        <i className="fa fa-folder-open-o"></i>
                        {subjectName && <a href={`/category/${subjectName}`}>{subjectName}</a>}
                        {classEntityName && (
                            <span>
                                {' '} - <a href={`/category/${classEntityName}`}>{classEntityName}</a>
                            </span>
                        )}
                    </span>
                    <span className="published">
                        <i className="fa fa-clock-o"></i>
                        {new Date(createAt).toLocaleDateString('vi-VN')}
                    </span>
                </div>
            </div>
        </article>
    );
};

export default PostItem;
