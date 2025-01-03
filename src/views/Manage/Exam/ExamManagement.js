import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, message, Modal } from 'antd';
import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import SideBarMenu from '../../Home/SideBarMenu';
import { useNavigate } from 'react-router-dom';
import './ExamManagement.css';

const { Content } = Layout;

const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null); // Thông tin bài thi được chọn
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Modal xóa
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false); // Modal xác nhận vào thi
    const navigate = useNavigate();

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
        setSelectedExam(examId);
        setIsDeleteModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/books/exams`, {
                params: { ids: selectedExam },
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Xóa bài thi thành công.');
            setIsDeleteModalVisible(false);
            fetchExams();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa bài thi.');
        }
    };

    const showConfirmExamModal = (exam) => {
        setSelectedExam(exam); // Lưu thông tin bài thi được chọn
        setIsConfirmModalVisible(true);
    };

    const handleStartExam = () => {
        // Điều hướng đến trang thi
        if (selectedExam) {
            navigate(`/exams/${selectedExam.id}`);
        }
        setIsConfirmModalVisible(false);
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
            title: 'lớp/khoa/viện',
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => showConfirmExamModal(record)}
                    >
                        Vào thi
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(record.id)}
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideBarMenu />
            <Content style={{ padding: '20px' }}>
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

                    {/* Modal xóa */}
                    <Modal
                        title="Xác nhận xóa"
                        open={isDeleteModalVisible}
                        onOk={handleDelete}
                        onCancel={() => setIsDeleteModalVisible(false)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <p>Bạn có chắc chắn muốn xóa bài thi này không?</p>
                    </Modal>

                    {/* Modal xác nhận vào thi */}
                    <Modal
                        title="Xác nhận tham gia thi"
                        open={isConfirmModalVisible}
                        onOk={handleStartExam}
                        onCancel={() => setIsConfirmModalVisible(false)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <p>Bạn có chắc chắn muốn tham gia thi đề "{selectedExam?.name}" không?</p>
                    </Modal>
                </div>
            </Content>
        </Layout>
    );
};

export default ExamManagement;
