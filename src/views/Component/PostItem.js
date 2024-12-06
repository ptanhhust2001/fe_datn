import React from "react";

const PostItem = ({ post }) => {
    // Ensure categories is always an array
    const categories = post.categories || [];

    return (
        <article id={`post-${post.id}`} className="post">
            <h2 className="blog-single-title">
                <a href={post.link} title={post.title}>
                    {post.title}
                </a>
            </h2>
            <div className="entry-image">
                <a href={post.link} title={post.title}>
                    <img
                        width="150"
                        height="60"
                        src={post.imageFilePath}
                        alt={post.title}
                        className="attachment-medium size-medium wp-post-image"
                    />
                </a>
            </div>
            <div className="entry-content">
                <div className="page-content">
                    <p>
                        {post.description}...
                        <a className="read-more" href={post.link}>
                            Xem tiếp <i className="iconsmind-Arrow-Right2"></i>
                        </a>
                    </p>
                </div>
            </div>
            <div className="entry-meta">
                <span className="blog-label pull-left">
                    <span className="fa fa-folder-open-o"></span>
                    {categories.map((category, index) => (
                        <span key={index}>
                            <a href={category.link} rel="category tag">
                                {category.name}
                            </a>
                            {index < categories.length - 1 && ", "}
                        </span>
                    ))}
                </span>
                <span className="published pull-right">
                    <span className="fa fa-clock-o"></span>
                    <a href={post.link} title={post.title}>
                        {post.createdAt}
                    </a>
                </span>
            </div>
        </article>
    );
};

export default PostItem;
