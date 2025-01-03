import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, Spin } from "antd";
import axios from "axios";
import "./CreateExamAI.css";

const { Option } = Select;

const CreateExamAI = () => {
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const token = localStorage.getItem("token");
                const subjectResponse = await axios.get("http://localhost:8080/books/subjects", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const classResponse = await axios.get("http://localhost:8080/books/class", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSubjects(subjectResponse.data.value);
                setClasses(classResponse.data.value);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchFilters();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        const requestData = {
            content: values.content,
            name: values.name,
            classEntityId: values.classEntityId,
            subjectId: values.subjectId,
        };

        try {
            const response = await axios.post("http://localhost:8080/books/exams/generate", requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                message.success("Tạo đề thi thành công!");
                form.resetFields();
            } else {
                message.error("Tạo đề thi thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error generating exam:", error);
            message.error("Có lỗi xảy ra khi tạo đề thi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-exam-ai-container">
            <h2>Tạo Đề Thi Bằng AI</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="create-exam-ai-form"
            >
                <Form.Item
                    name="name"
                    label="Tên đề thi"
                    rules={[{ required: true, message: "Vui lòng nhập tên đề thi!" }]}
                >
                    <Input placeholder="Nhập tên đề thi" />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Mô tả đề thi"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung đề thi!" }]}
                >
                    <Input.TextArea rows={4} placeholder="Nhập mô tả đề thi" />
                </Form.Item>

                <Form.Item
                    name="classEntityId"
                    label="Chọn lớp/khoa/viện"
                    rules={[{ required: true, message: "Vui lòng chọn lớp/khoa/viện!" }]}
                >
                    <Select placeholder="Chọn lớp/khoa/viện">
                        {classes.map((cls) => (
                            <Option key={cls.id} value={cls.id}>
                                {cls.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="subjectId"
                    label="Chọn môn học"
                    rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
                >
                    <Select placeholder="Chọn môn học">
                        {subjects.map((subject) => (
                            <Option key={subject.id} value={subject.id}>
                                {subject.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="create-exam-ai-btn"
                    >
                        Tạo Đề Thi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateExamAI;
