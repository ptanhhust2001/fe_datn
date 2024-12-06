import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import './CreatePost.css'; // CSS tùy chỉnh

const { Option } = Select;

const CreatePost = () => {
    const [subjects, setSubjects] = useState([]); // Danh sách môn học
    const [classes, setClasses] = useState([]); // Danh sách lớp học
    const [file, setFile] = useState(null); // Tệp tin tải lên
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

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

    // Xử lý file tải lên
    const handleFileChange = ({ file }) => {
        if (file.status === 'done') {
            setFile(file.originFileObj);
        }
    };

    // Gửi bài viết lên server
    const handleSubmit = async (values) => {
        setLoading(true);
        const postData = {
            title: values.title,
            content: values.content,
            description: values.description,
            subjectId: values.subjectId,
            classEntityId: values.classEntityId,
        };

        try {
            // Bước 1: Gửi yêu cầu tạo bài viết (POST /posts)
            const postResponse = await axios.post('http://localhost:8080/books/posts', postData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (postResponse.data.status === 0) {
                message.success('Tạo bài viết thành công!');

                const postId = postResponse.data.value.id;

                // Bước 2: Gửi yêu cầu tải ảnh cho bài viết (POST /posts/image/{id})
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);

                    await axios.post(`http://localhost:8080/books/posts/image/${postId}`, formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    message.success('Tải ảnh lên thành công!');
                }

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
                    <Input.TextArea placeholder="Nội dung bài viết" rows={4} />
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
                        {classes.map((classItem) => (
                            <Option key={classItem.id} value={classItem.id}>
                                {classItem.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Tải lên tệp tin">
                    <Upload
                        beforeUpload={() => false} // Ngừng upload ngay lập tức, xử lý trong onChange
                        onChange={handleFileChange}
                        showUploadList={false} >
                        <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="create-post-btn"
                        loading={loading}
                    >
                        Tạo bài viết
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreatePost;
