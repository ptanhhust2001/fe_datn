import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>403 - Không có quyền truy cập</h1>
            <p>Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên nếu cần hỗ trợ.</p>
            <Button type="primary" onClick={() => navigate('/')}>
                Quay về trang chủ
            </Button>
        </div>
    );
};

export default UnauthorizedPage;
