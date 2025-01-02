import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Upload, List } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import './CreatePostForum.css';

const CreatePostForum = () => {
    const [content, setContent] = useState('');
    const [bannerImage, setBannerImage] = useState('');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
    }, [token, navigate]);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/books/images', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setBannerImage(response.data.value);
            } else {
                message.error('Lỗi khi tải ảnh lên.');
            }
        } catch (error) {
            message.error('Lỗi khi tải ảnh lên: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMaterialUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/books/images', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const newMaterial = {
                    name: file.name,
                    urlFile: response.data.value,
                };

                setMaterials((prev) => [...prev, newMaterial]);
                message.success(`Tải tệp ${file.name} thành công!`);
            } else {
                message.error('Tải tệp thất bại!');
            }
        } catch (error) {
            console.error('Lỗi khi tải tệp:', error);
            message.error('Có lỗi xảy ra khi tải tệp!');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMaterial = (index) => {
        setMaterials((prev) => prev.filter((_, i) => i !== index));
        message.success('Tài liệu đã được xóa.');
    };

    const handleEditorChange = (value) => {
        setContent(value);
    };

    const handleSubmit = async (values) => {
        setLoading(true);

        const postData = {
            title: values.title,
            content: content,
            description: values.description,
            imageFilePath: bannerImage,
            materials: materials,
        };

        try {
            const postResponse = await axios.post('http://localhost:8080/books/posts/community', postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (postResponse.data.status === 200) {
                message.success('Tạo bài viết thành công!');
                navigate('/home');
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
            <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/home')}
                style={{ marginBottom: '20px' }}
            >
                Quay lại Trang chủ
            </Button>
            <h2>Tạo bài viết trên diễn đàn</h2>
            <Form
                name="create-post-form"
                onFinish={handleSubmit}
                layout="vertical"
                className="create-post-form"
            >
                <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
                >
                    <Input placeholder="Tiêu đề bài viết" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả bài viết!' }]}
                >
                    <Input placeholder="Mô tả bài viết" />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Nội dung"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
                >
                    <ReactQuill
                        value={content}
                        onChange={handleEditorChange}
                        modules={{
                            toolbar: [
                                [{ header: '1' }, { header: '2' }, { font: [] }],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['bold', 'italic', 'underline'],
                                ['link'],
                                [{ align: [] }],
                                ['image'],
                                ['clean'],
                            ],
                        }}
                        placeholder="Nhập nội dung bài viết"
                    />
                </Form.Item>

                <Form.Item
                    label="Tải ảnh banner"
                    name="bannerImage"
                    extra="Chọn ảnh để làm banner cho bài viết."
                >
                    <Upload
                        showUploadList={false}
                        beforeUpload={(file) => {
                            handleImageUpload(file);
                            return false;
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Tải ảnh banner</Button>
                    </Upload>
                    {bannerImage && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={bannerImage}
                                alt="Ảnh banner"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    border: '1px solid #ddd',
                                    padding: '5px',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                    )}
                </Form.Item>

                <Form.Item
                    label="Tải tài liệu đính kèm"
                    extra="Chọn các tệp để đính kèm vào bài viết."
                >
                    <Upload
                        multiple
                        beforeUpload={(file) => {
                            handleMaterialUpload(file);
                            return false;
                        }}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Tải tài liệu</Button>
                    </Upload>
                    {materials.length > 0 && (
                        <List
                            bordered
                            dataSource={materials}
                            renderItem={(material, index) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveMaterial(index)}
                                        >
                                            Xóa
                                        </Button>,
                                    ]}
                                >
                                    <a href={material.urlFile} target="_blank" rel="noopener noreferrer">
                                        {material.name}
                                    </a>
                                </List.Item>
                            )}
                            style={{ marginTop: '10px' }}
                        />
                    )}
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Tạo bài viết
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreatePostForum;
