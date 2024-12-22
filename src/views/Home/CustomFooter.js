import React from 'react';
import { Layout, Row, Col, Input, Typography, Calendar } from 'antd';
import './CustomFooter.css';

const { Footer } = Layout;
const { Title, Text } = Typography;

const CustomFooter = () => {
    return (
        <Footer className="custom-footer">
            <div className="footer-content">
                <Row gutter={32}>
                    {/* Lịch */}
                    <Col xs={24} sm={8} className="footer-calendar">
                        <Title level={5}>Tháng Mười Hai 2024</Title>
                        <Calendar fullscreen={false} />
                    </Col>

                    {/* Liên Kết */}
                    <Col xs={24} sm={6} className="footer-links">
                        <Title level={5}>Liên Kết</Title>
                        <ul>
                            <li><a href="#">Liên hệ</a></li>

                        </ul>
                    </Col>


                    {/* Thông tin Website */}
                    <Col xs={24} sm={4} className="footer-about">
                        <Title level={5}>Tailieubachkhoa.vn</Title>
                        <Text>
                            Website cung cấp tài liệu, đề thi WORD, PDF miễn phí với người dùng. Ngoài ra các em có thể tham gia Thi Thử Online...
                        </Text>
                        <Text strong>
                            Tailieubachkhoa.vn – HỌC DỄ THÀNH TÀI!!
                        </Text>
                    </Col>
                </Row>
                <div className="footer-bottom">
                    <Text>Tailieubachkhoa.vn</Text>
                </div>
            </div>
        </Footer>
    );
};

export default CustomFooter;
