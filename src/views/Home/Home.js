import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button, Row, Col, Card } from 'antd';
import './Home.css'; // Đảm bảo có file CSS tùy chỉnh giao diện

const { Header, Content } = Layout;

const Home = () => {
    const [classes, setClasses] = useState([]); // Danh sách lớp học
    const [subjects, setSubjects] = useState([]); // Danh sách môn học
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Nếu không có token, chuyển hướng về trang login
            return;
        }

        // Lấy danh sách các lớp học
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/class', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClasses(response.data.value);
                setLoadingClasses(false);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách lớp học", error);
                setLoadingClasses(false);
            }
        };

        fetchClasses();

        // Lấy thông tin người dùng
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books/users/my-info', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data.result);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng:", err);
            }
        };

        fetchUserInfo();
    }, [token, navigate]);

    // Lấy danh sách môn học khi lớp học được chọn
    const fetchSubjects = async (classId) => {
        setLoadingSubjects(true);
        try {
            const response = await axios.get(`http://localhost:8080/books/class/${classId}/subjects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(response.data.value); // Cập nhật môn học
            setLoadingSubjects(false);
        } catch (err) {
            console.error('Lỗi khi lấy môn học:', err);
            setLoadingSubjects(false);
        }
    };

    const handleClassSelect = (classId) => {
        setSelectedClass(classId); // Lưu lớp học đã chọn
        fetchSubjects(classId); // Gửi yêu cầu lấy môn học của lớp đã chọn
    };

    if (loadingClasses) {
        return <div className="loading">Đang tải lớp học...</div>;
    }

    return (
        <Layout>
            <Header className="header">
                <div className="logo">Trang chủ</div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    {/* Hiển thị danh sách lớp học trong navbar */}
                    {classes.map((classItem) => (
                        <Menu.Item key={classItem.id} onClick={() => handleClassSelect(classItem.id)}>
                            {classItem.name}
                        </Menu.Item>
                    ))}
                </Menu>
            </Header>

            <Content style={{ padding: '20px' }}>
                <div className="home-container">
                    {/* Hiển thị môn học nếu đã chọn lớp */}
                    {selectedClass && (
                        <div className="subjects-container">
                            <h2>Môn học của lớp {selectedClass}</h2>
                            <Row gutter={[16, 16]}>
                                {loadingSubjects ? (
                                    <div>Đang tải môn học...</div>
                                ) : (
                                    subjects.map((subject) => (
                                        <Col span={8} key={subject.id}>
                                            <Card
                                                hoverable
                                                title={subject.name}
                                                style={{ marginBottom: '16px' }}
                                            >
                                                <Button
                                                    type="primary"
                                                    onClick={() => navigate(`/subject/${subject.id}`)}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </Card>
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </div>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default Home;
