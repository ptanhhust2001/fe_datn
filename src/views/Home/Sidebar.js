// components/Sidebar.js
import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, FileTextOutlined, CommentOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate('/'),
        },
        {
            key: 'exam',
            icon: <FileTextOutlined />,
            label: 'Đề thi',
            onClick: () => navigate('/exam'),
        },
        {
            key: 'forum',
            icon: <CommentOutlined />,
            label: 'Diễn đàn',
            onClick: () => navigate('/forum'),
        },
        {
            key: 'discussion',
            icon: <MessageOutlined />,
            label: 'Thảo luận',
            onClick: () => navigate('/discussion'),
        },
    ];

    return (
        <Menu
            mode="vertical"
            defaultSelectedKeys={['home']}
            style={{ width: 200, height: '100vh', borderRight: 0 }}
            items={menuItems}
        />
    );
};

export default Sidebar;
