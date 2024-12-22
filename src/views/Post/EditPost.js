import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message, Upload, Spin } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditPost.css';
import { UploadOutlined } from '@ant-design/icons';

const EditPost = () => {
    const [post, setPost] = useState(null); // Bài viết cần chỉnh sửa
    const [content, setContent] = useState(''); // Nội dung bài viết
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID bài viết từ URL
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const quillRef = useRef(null); // Khai báo ref để tham chiếu tới ReactQuill editor

    // Hàm lấy dữ liệu bài viết hiện tại
    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/books/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data.value;
            setPost(data); // Lưu bài viết vào state
            setContent(data.content); // Gán nội dung vào state content
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết bài viết:', error);
            message.error('Không thể tải chi tiết bài viết.');
        } finally {
            setLoading(false); // Tắt trạng thái tải
        }
    };

    // Hàm xử lý khi nội dung thay đổi
    const handleEditorChange = (value) => {
        setContent(value);
    };

    // Hàm tải ảnh lên server
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/books/images', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const imagePath = response.data.value;
                return imagePath; // Trả về đường dẫn ảnh
            } else {
                message.error('Lỗi khi tải ảnh lên.');
            }
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên:', error);
            message.error('Lỗi khi tải ảnh lên.');
        }
    };

    // Hàm xử lý chèn ảnh vào ReactQuill
    const imageHandler = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const imageUrl = await handleImageUpload(file); // Tải ảnh lên server
                if (imageUrl) {
                    const editor = quillRef.current.getEditor(); // Lấy editor từ ref
                    const range = editor.getSelection(); // Lấy vị trí con trỏ
                    editor.insertEmbed(range.index, 'image', imageUrl); // Chèn ảnh vào editor
                }
            }
        };
    };

    // Cập nhật phần tử chèn ảnh
    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            const toolbar = editor.getModule('toolbar');
            toolbar.addHandler('image', imageHandler); // Gắn handler cho nút 'image'
        }
    }, []);

    // Gửi dữ liệu cập nhật bài viết
    const handleSubmit = async (values) => {
        setLoading(true);
        const postData = {
            title: values.title,
            description: values.description,
            content: content, // Nội dung đã được chỉnh sửa
        };

        try {
            const response = await axios.put(`http://localhost:8080/books/posts?id=${id}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status === 200) {
                message.success('Chỉnh sửa bài viết thành công!');
                navigate('/manage-posts'); // Quay lại trang quản lý bài viết
            } else {
                message.error('Chỉnh sửa bài viết thất bại.');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu chỉnh sửa bài viết:', error);
            message.error('Chỉnh sửa bài viết thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Lấy dữ liệu bài viết khi component render
    useEffect(() => {
        if (!token) {
            navigate('/login'); // Nếu không có token, điều hướng về login
            return;
        }
        fetchPostDetails(); // Lấy chi tiết bài viết
    }, [id, token, navigate]);

    return (
        <div className="edit-post-container">
            <h2>Chỉnh sửa bài viết</h2>
            {loading ? (
                <Spin tip="Đang tải bài viết..." />
            ) : (
                <Form
                    name="edit-post-form"
                    onFinish={handleSubmit}
                    initialValues={{
                        title: post.title,
                        description: post.description,
                    }}
                    layout="vertical"
                    className="edit-post-form"
                >
                    {/* Tiêu đề */}
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
                    >
                        <Input placeholder="Tiêu đề bài viết" />
                    </Form.Item>

                    {/* Mô tả */}
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả bài viết!' }]}
                    >
                        <Input placeholder="Mô tả bài viết" />
                    </Form.Item>

                    {/* Nội dung */}
                    <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
                    >
                        <ReactQuill
                            ref={quillRef} // Gắn ref vào ReactQuill
                            value={content}
                            onChange={handleEditorChange}
                            placeholder="Nhập nội dung bài viết"
                            modules={{
                                toolbar: [
                                    [{ header: '1' }, { header: '2' }, { font: [] }],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    ['bold', 'italic', 'underline'],
                                    ['link', 'image'], // Thêm nút chèn ảnh
                                    ['clean'],
                                ],
                            }}
                        />
                    </Form.Item>

                    {/* Nút lưu */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu chỉnh sửa
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default EditPost;
