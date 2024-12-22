import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './ExamManagement.css';

const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const userResponse = await axios.get('http://localhost:8080/books/users/my-info', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userId = userResponse.data.result.id;

            const response = await axios.get(`http://localhost:8080/books/exams`, {
                params: {
                    advanceSearch: `user.id=${userId}`,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 200) {
                setExams(response.data.value || []);
            } else {
                message.error('Không thể tải danh sách bài thi.');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải danh sách bài thi.');
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = (examId) => {
        setSelectedExamId(examId);
        setIsModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/books/exams`, {
                params: { ids: selectedExamId },
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Xóa bài thi thành công.');
            setIsModalVisible(false);
            fetchExams();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa bài thi.');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: 'Tên bài thi',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Lớp học',
            dataIndex: 'classEntityName',
            key: 'classEntityName',
            align: 'center',
        },
        {
            title: 'Môn học',
            dataIndex: 'subjectName',
            key: 'subjectName',
            align: 'center',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createAt',
            key: 'createAt',
            align: 'center',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Hành động',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(record.id)}
                >
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <div className="exam-management">
            <h2>Bài thi của tôi</h2>
            <Table
                dataSource={exams}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
            />

            <Modal
                title="Xác nhận xóa"
                open={isModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsModalVisible(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa bài thi này không?</p>
            </Modal>
        </div>
    );
};

export default ExamManagement;
