import React from 'react';
import "./PostItem.css"
const PostItem = ({ post }) => {
    const { id, title, description, imageFilePath, classEntityName, subjectName, createAt } = post;

    return (
        <article id={`post-${id}`} className="post">
            <h2 className="blog-single-title">
                <a href={`http://localhost:8080/books/posts/${id}`} title={title}>
                    {title}
                </a>
            </h2>

            {/* Phần hình ảnh bài viết */}
            <div className="entry-image">
                <a href={`http://localhost:8080/books/posts/${id}`} title={title}>
                    {/* Sử dụng imageFilePath từ dữ liệu bài viết */}
                    <img
                        src={imageFilePath} // Sử dụng imageFilePath ở đây
                        alt={title}
                        className="post-image"
                        width="150" // Bạn có thể điều chỉnh kích thước hình ảnh
                        height="60" // Tùy chỉnh theo nhu cầu
                    />
                </a>
            </div>

            {/* Phần nội dung bài viết */}
            <div className="entry-content">
                <div className="page-content">
                    <p>{description}</p>
                    {/* Nút "Xem tiếp" sẽ chuyển sang trang chi tiết bài viết */}
                    <a className="read-more" href={`http://localhost:8080/books/posts/${id}`} title={title}>
                        Xem tiếp <i className="iconsmind-Arrow-Right2"></i>
                    </a>
                </div>
            </div>

            {/* Thông tin bài viết */}
            <div className="entry-meta">
                <span className="blog-label pull-left">
                    <span className="fa fa-folder-open-o"></span>
                    {subjectName && <a href={`/category/${subjectName}`} rel="category tag">{subjectName}</a>}
                    {classEntityName && <span> - <a href={`/category/${classEntityName}`} rel="category tag">{classEntityName}</a></span>}
                </span>
                <span className="published pull-right">
                    <span className="fa fa-clock-o"></span>
                    <a href={`http://localhost:8080/books/posts/${id}`} title={title}>
                        {new Date(createAt).toLocaleDateString()}
                    </a>
                </span>
            </div>
        </article>
    );
};

export default PostItem;
