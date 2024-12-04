import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UserDetail.css';

const UserDetail = () => {
    const { id } = useParams(); // Lấy id người dùng từ URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');  // Nếu không có token, chuyển hướng về trang login
            return;
        }

        const fetchUserDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/books/users/my-info`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.result);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải thông tin người dùng');
                setLoading(false);
            }
        };

        fetchUserDetail();
    }, [token, navigate]);

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="user-detail-container">
            <h2>Chi tiết người dùng</h2>
            <p><strong>Họ tên:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Ngày sinh:</strong> {new Date(user.dob).toLocaleDateString()}</p>
            <h3>Vai trò:</h3>
            {user.roles.map((role, index) => (
                <div key={index}>
                    <p><strong>{role.name}</strong>: {role.description}</p>
                    <h4>Quyền hạn:</h4>
                    {role.permissions.map((perm, permIndex) => (
                        <p key={permIndex}><strong>{perm.name}</strong>: {perm.description}</p>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default UserDetail;
