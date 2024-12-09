import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Spin, Table, Pagination, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from '../Home/HeaderComponent';
import './ExamList.css'; // Import CSS file
const { Content } = Layout;

const ExamList = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);  // Danh sách đề thi
    const [totalExams, setTotalExams] = useState(0);  // Tổng số đề thi
    const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
    const [pageSize] = useState(10);  // Số lượng đề thi mỗi trang
    const [isModalVisible, setIsModalVisible] = useState(false);  // Điều khiển modal
    const [examToTake, setExamToTake] = useState(null);  // Đề thi người dùng chọn
    const navigate = useNavigate();
    const token = localStorage.getItem('token');  // Lấy token từ localStorage

    // Lấy thông tin người dùng và danh sách đề thi
    useEffect(() => {
        if (!token) {
            navigate('/login'); // Nếu không có token, chuyển hướng tới trang login
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/users/my-info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data.result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user info:", error);
                setLoading(false);
            }
        };

        const fetchExams = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/books/exams?page=${currentPage - 1}&size=${pageSize}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExams(response.data.value);
                setTotalExams(response.data.total);
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        };

        fetchUserInfo();
        fetchExams();
    }, [token, currentPage, pageSize, navigate]);

    // Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token');  // Xóa token khỏi localStorage
        navigate('/login');  // Chuyển hướng đến trang login
    };

    // Xem thông tin cá nhân
    const handleViewProfile = () => {
        navigate('/profile');
    };

    // Hiển thị modal xác nhận khi nhấp vào đề thi
    const handleExamClick = (examId) => {
        // Lưu lại đề thi người dùng chọn
        const selectedExam = exams.find(exam => exam.id === examId);
        setExamToTake(selectedExam);
        setIsModalVisible(true); // Hiển thị modal xác nhận
    };

    // Xử lý khi người dùng nhấn "Xác nhận" trong modal
    const handleConfirmExam = () => {
        if (examToTake) {
            navigate(`/exams/${examToTake.id}`);  // Chuyển hướng tới trang thi của đề thi
        }
        setIsModalVisible(false);  // Đóng modal
    };

    // Xử lý khi người dùng nhấn "Hủy" trong modal
    const handleCancel = () => {
        setIsModalVisible(false);  // Đóng modal
    };

    // Hiển thị Loading nếu đang tải thông tin
    if (loading) {
        return (
            <div className="loading">
                <Spin tip="Đang tải thông tin..." />
            </div>
        );
    }

    return (
        <Layout>
            {/* Phần header sẽ luôn hiển thị với HeaderComponent */}
            <Layout.Header className="header">
                <HeaderComponent
                    userInfo={userInfo}
                    onLogout={handleLogout}
                    onProfileClick={handleViewProfile}
                    classes={[]}  // Bạn có thể truyền lớp học nếu cần
                    onClassClick={() => { }} // Xử lý nếu có cần click lớp học
                />
            </Layout.Header>

            {/* Nội dung chính của trang */}
            <Content style={{ padding: '20px' }}>
                <div className="exam-list-container">
                    <h1>Danh sách đề thi</h1>
                    <Table
                        dataSource={exams}
                        rowKey="id"
                        pagination={false}
                        onRow={(record) => ({
                            onClick: () => handleExamClick(record.id),  // Xử lý click vào dòng
                        })}
                    >
                        <Table.Column title="ID" dataIndex="id" key="id" />
                        <Table.Column title="Tên đề thi" dataIndex="name" key="name" />
                        <Table.Column title="Lớp" dataIndex="classEntityId" key="classEntityId" />
                        <Table.Column title="Môn học" dataIndex="subjectId" key="subjectId" />
                        <Table.Column title="Người tạo" dataIndex="createBy" key="createBy" />
                        <Table.Column
                            title="Ngày tạo"
                            dataIndex="createAt"
                            key="createAt"
                            render={(text) => new Date(text).toLocaleString()}  // Format ngày giờ
                        />
                    </Table>

                    {/* Pagination */}
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalExams}
                        onChange={page => setCurrentPage(page)}
                        style={{ marginTop: '20px' }}
                    />
                </div>

                {/* Modal xác nhận thi */}
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
