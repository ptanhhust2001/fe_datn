import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Upload, message, Row, Col, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './CreateExamByText.css';

const { Option } = Select;

const CreateExamByText = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClassesAndSubjects = async () => {
            try {
                const classesResponse = await axios.get('http://localhost:8080/books/class', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClasses(classesResponse.data.value);

                const subjectsResponse = await axios.get('http://localhost:8080/books/subjects', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSubjects(subjectsResponse.data.value);
            } catch (error) {
                message.error('Lỗi khi tải danh sách lớp hoặc môn học.');
            }
        };

        fetchClassesAndSubjects();
    }, [token]);

    const handleFileChange = ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (file.status === 'removed') {
            setFile(null);
        } else {
            setFile(file.originFileObj);
        }
    };

    const handleSubmit = async (values) => {
        if (!file) {
            message.error('Vui lòng tải lên file đề thi!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('classId', values.classId);
        formData.append('subjectId', values.subjectId);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/books/exams/questions', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                message.success('Tạo bài thi thành công!');
                form.resetFields();
                setFile(null);
            } else {
                message.error(response.data?.message || 'Tạo bài thi thất bại!');
            }
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo bài thi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-exam-by-text">
            <Row gutter={16}>
                <Col span={16}>
                    <Card>
                        <h2>Tạo bài thi bằng văn bản</h2>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="create-exam-form"
                        >
                            <Form.Item
                                name="classId"
                                label="Lớp học"
                                rules={[{ required: true, message: 'Vui lòng chọn lớp học!' }]}
                            >
                                <Select placeholder="Chọn lớp học">
                                    {classes.map((cls) => (
                                        <Option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="subjectId"
                                label="Môn học"
                                rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
                            >
                                <Select placeholder="Chọn môn học">
                                    {subjects.map((subject) => (
                                        <Option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="file"
                                label="Tải lên file đề thi"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                        return e;
                                    }
                                    return e && e.fileList;
                                }}
                                rules={[{ required: true, message: 'Vui lòng tải lên file!' }]}
                            >
                                <Upload
                                    beforeUpload={() => false}
                                    onChange={handleFileChange}
                                    maxCount={1}
                                    fileList={file ? [{ name: file.name, status: 'done' }] : []}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn file</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Tạo bài thi
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <h4 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Hướng dẫn tạo bài thi:</h4>
                        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                            <li>
                                <b>Chọn lớp học</b> và <b>môn học</b> tương ứng từ danh sách.
                            </li>
                            <li>
                                Tải lên file đề thi của bạn (hỗ trợ định dạng <b>Word</b>).
                            </li>
                            <li>
                                Quy tắc soạn câu hỏi:
                                <ul style={{ marginLeft: '20px', paddingLeft: '20px', listStyleType: 'circle' }}>
                                    <li>Để tạo phần thi mới tên đề thi ở dòng đầu</li>
                                    <li>Mỗi câu hỏi cách nhau ít nhất một dòng trống.</li>
                                    <li>
                                        Đáp án đúng là đáp án có dấu <code>*</code> đứng trước.
                                    </li>
                                    <li>
                                        Nếu câu hỏi sai cấu trúc trên, hệ thống sẽ báo lỗi và câu hỏi không được hiển thị.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Ví dụ về cấu trúc câu hỏi:
                                <div style={{ backgroundColor: '#f9f9f9', padding: '10px', margin: '10px 0', borderRadius: '8px' }}>
                                    <code>
                                        Phần 1<br />
                                        <br />
                                        When we went back to the bookstore, the bookseller _ the book we wanted.<br />
                                        A. sold<br />
                                        *B. had sold<br />
                                        C. sells<br />
                                        D. has sold<br />
                                        <br />
                                        By the end of last summer, the farmers _ all the crop.<br />
                                        A. harvested<br />
                                        *B. had harvested<br />
                                        C. harvest<br />
                                        D. are harvested
                                    </code>
                                </div>
                            </li>
                            <li>
                                Nhấn nút <b>Tạo bài thi</b> để hoàn tất.
                            </li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateExamByText;
