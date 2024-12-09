import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Select, message, Upload } from 'antd';
import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import style Quill
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreatePost.css'; // CSS tùy chỉnh
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreatePost = () => {
    const [subjects, setSubjects] = useState([]); // Danh sách môn học
    const [classes, setClasses] = useState([]); // Danh sách lớp học
    const [content, setContent] = useState(''); // Nội dung bài viết
    const [imageUrl, setImageUrl] = useState(''); // Đường dẫn ảnh đã tải lên
    const [bannerImage, setBannerImage] = useState(''); // Đường dẫn ảnh banner
    const [loading, setLoading] = useState(false);
    const [bannerUploaded, setBannerUploaded] = useState(false); // Trạng thái ảnh banner đã được tải lên
    const [canSubmit, setCanSubmit] = useState(false); // Trạng thái để cho phép submit
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    const quillRef = useRef(null); // Khai báo ref để tham chiếu đến Quill editor

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Nếu không có token, chuyển hướng về trang login
            return;
        }

        // Lấy danh sách môn học
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/subjects', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubjects(response.data.value); // Cập nhật môn học
            } catch (error) {
                console.error('Lỗi khi lấy danh sách môn học:', error);
            }
        };

        // Lấy danh sách lớp học
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/class', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClasses(response.data.value); // Cập nhật lớp học
            } catch (error) {
                console.error('Lỗi khi lấy danh sách lớp học:', error);
            }
        };

        fetchSubjects();
        fetchClasses();
    }, [token, navigate]);

    // Hàm để tải ảnh lên (bao gồm banner và ảnh nội dung)
    const handleImageUpload = async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/books/images', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const imagePath = response.data.value;
                if (type === 'content') {
                    setImageUrl(imagePath); // Lưu đường dẫn ảnh cho nội dung
                    return imagePath;
                } else if (type === 'banner') {
                    setBannerImage(imagePath); // Lưu đường dẫn ảnh banner
                    setBannerUploaded(true); // Đánh dấu ảnh banner đã tải lên
                    setCanSubmit(true); // Sau khi ảnh banner được xác nhận, cho phép submit
                    return imagePath;
                }
            } else {
                message.error('Lỗi khi tải ảnh lên.');
            }
        } catch (error) {
            message.error('Lỗi khi tải ảnh lên: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Cấu hình Quill với tính năng chèn ảnh
    const handleEditorChange = (value) => {
        setContent(value);
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'align': [] }],
            ['image'], // Thêm nút chèn ảnh
            ['clean']
        ],
    };

    const imageHandler = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const imageUrl = await handleImageUpload(file, 'content'); // Tải ảnh lên nội dung
                if (imageUrl) {
                    const editor = quillRef.current.getEditor(); // Lấy editor từ ref
                    const range = editor.getSelection();
                    editor.insertEmbed(range.index, 'image', imageUrl); // Chèn ảnh vào vị trí con trỏ
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

    const handleSubmit = async (values) => {
        setLoading(true);

        const postData = {
            title: values.title,
            content: content, // Gửi nội dung từ Quill
            description: values.description,
            subjectId: values.subjectId,
            classEntityId: values.classEntityId,
            imageFilePath: imageUrl, // Đính kèm đường dẫn ảnh đã tải lên
            bannerImage: bannerImage // Đính kèm ảnh banner
        };

        try {
            const postResponse = await axios.post('http://localhost:8080/books/posts', postData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (postResponse.data.status === 0) {
                message.success('Tạo bài viết thành công!');
                navigate('/home'); // Điều hướng về trang chủ sau khi tạo bài viết thành công
            } else {
                message.error('Tạo bài viết thất bại!');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu tạo bài viết:', error);
            message.error('Tạo bài viết thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-container">
            <h2>Tạo bài viết mới</h2>
            <Form
                name="create-post-form"
                onFinish={handleSubmit}
                layout="vertical"
                className="create-post-form"
            >
                <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]} >
                    <Input placeholder="Tiêu đề bài viết" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả bài viết!' }]} >
                    <Input placeholder="Mô tả bài viết" />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Nội dung"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]} >
                    <ReactQuill
                        ref={quillRef} // Sử dụng ref để truy cập vào Quill editor
                        value={content}
                        onChange={handleEditorChange} // Cập nhật nội dung Quill
                        modules={modules} // Sử dụng cấu hình module đã tạo
                        placeholder="Nhập nội dung bài viết"
                    />
                </Form.Item>

                <Form.Item
                    name="subjectId"
                    label="Môn học"
                    rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]} >
                    <Select placeholder="Chọn môn học">
                        {subjects.map((subject) => (
                            <Option key={subject.id} value={subject.id}>
                                {subject.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="classEntityId"
                    label="Lớp học"
                    rules={[{ required: true, message: 'Vui lòng chọn lớp học!' }]} >
                    <Select placeholder="Chọn lớp học">
                        {classes.map((cls) => (
                            <Option key={cls.id} value={cls.id}>
                                {cls.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Tải ảnh banner"
                    name="bannerImage"
                    extra="Chọn ảnh để làm banner cho bài viết."
                >
                    <Upload
                        showUploadList={false}
                        beforeUpload={(file) => {
                            handleImageUpload(file, 'banner');
                            return false;
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Tải ảnh banner</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    {bannerUploaded ? (
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={!canSubmit}
                        >
                            Tạo bài viết
                        </Button>
                    ) : (
                        <Button
                            type="default"
                            onClick={() => message.warning('Vui lòng xác nhận ảnh banner trước!')}
                        >
                            Xác nhận ảnh banner
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreatePost;
