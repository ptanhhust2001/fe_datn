import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Spin, Table, Pagination, Modal, Button, Select, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import './ExamList.css'; // Import CSS file

const { Content } = Layout;
const { Option } = Select;

const ExamList = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);
    const [totalExams, setTotalExams] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [examToTake, setExamToTake] = useState(null);
    const [searchParams, setSearchParams] = useState({ classId: '', subjectId: '', name: '' });
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/class');
                if (response.data.status === 200) {
                    setClasses(response.data.value);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/users/my-info', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserInfo(response.data.result);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user info:', error);
                setLoading(false);
            }
        };

        const fetchExams = async () => {
            try {
                const { classId, subjectId, name, type } = searchParams;
                const advanceSearch = [
                    classId && `classEntity.id＝${classId}`,
                    subjectId && `subject.id＝${subjectId}`,
                    name && `name～${name}`,
                    name && `type＝${type}`,
                ]
                    .filter(Boolean)
                    .join('＆');

                const response = await axios.get(
                    `http://localhost:8080/books/exams?page=${currentPage - 1}&size=${pageSize}&advanceSearch=${advanceSearch}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setExams(response.data.value);
                setTotalExams(response.data.total);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchUserInfo();
        fetchExams();
    }, [token, currentPage, pageSize, searchParams, navigate]);

    const handleSearch = (values) => {
        setSearchParams(values);
        setCurrentPage(1);
    };

    const handleClassChange = (value) => {
        setSearchParams((prev) => ({ ...prev, classId: value, subjectId: '' }));
        const selectedClass = classes.find((cls) => cls.id === value);
        setSubjects(selectedClass ? selectedClass.subjects : []);
    };

    const handleExamClick = (examId) => {
        const selectedExam = exams.find((exam) => exam.id === examId);
        setExamToTake(selectedExam);
        setIsModalVisible(true);
    };

    const handleConfirmExam = () => {
        if (examToTake) {
            navigate(`/exams/${examToTake.id}`);
        }
        setIsModalVisible(false);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (loading) {
        return (
            <div className="loading">
                <Spin tip="Đang tải thông tin..." />
            </div>
        );
    }

    return (
        <Layout>
            <Content style={{ padding: '20px' }}>
                <div className="exam-list-container">
                    <h1>Danh sách đề thi</h1>

                    <Form
                        layout="inline"
                        onFinish={handleSearch}
                        initialValues={{ classId: '', subjectId: '', name: '' }}
                        style={{ marginBottom: '20px' }}
                    >
                        <Form.Item name="classId" label="Lớp">
                            <Select
                                style={{ width: 120 }}
                                placeholder="Chọn lớp"
                                onChange={handleClassChange}
                                allowClear
                            >
                                {classes.map((cls) => (
                                    <Option key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="subjectId" label="Môn học">
                            <Select
                                style={{ width: 150 }}
                                placeholder="Chọn môn"
                                disabled={!subjects.length}
                                allowClear
                            >
                                {subjects.map((sub) => (
                                    <Option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="name" label="Từ khóa">
                            <Input placeholder="Nhập tên đề thi" allowClear />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </Form>

                    <Table
                        dataSource={exams}
                        rowKey="id"
                        pagination={false}
                        onRow={(record) => ({
                            onClick: () => handleExamClick(record.id),
                        })}
                    >
                        <Table.Column title="ID" dataIndex="id" key="id" />
                        <Table.Column title="Tên đề thi" dataIndex="name" key="name" />
                        <Table.Column title="Lớp" dataIndex="classEntityName" key="classEntityName" />
                        <Table.Column title="Môn học" dataIndex="subjectName" key="subjectName" />
                        <Table.Column title="Người tạo" dataIndex="createBy" key="createBy" />
                        <Table.Column
                            title="Ngày tạo"
                            dataIndex="createAt"
                            key="createAt"
                            render={(text) => new Date(text).toLocaleString()}
                        />
                        <Table.Column
                            title="Hành động"
                            key="action"
                            render={(text, record) => (
                                <Button onClick={() => handleExamClick(record.id)}>Vào ôn thi</Button>
                            )}
                        />
                    </Table>

                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalExams}
                        onChange={(page) => setCurrentPage(page)}
                        style={{ marginTop: '20px', textAlign: 'center' }}
                    />
                </div>

                <Modal
                    title="Xác nhận tham gia thi"
                    visible={isModalVisible}
                    onOk={handleConfirmExam}
                    onCancel={handleCancel}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <p>Bạn có chắc chắn muốn tham gia thi đề "{examToTake?.name}" không?</p>
                </Modal>
            </Content>
        </Layout>
    );
};

export default ExamList;
