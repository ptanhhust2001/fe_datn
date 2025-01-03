import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, FileTextOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './SidebarMenu.css';

const { Sider } = Layout;

const SideBarMenu = () => {
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState('home');

    const handleMenuClick = (key, path) => {
        setSelectedKey(key);
        navigate(path);
    };

    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => handleMenuClick('home', '/home'),
        },
        {
            key: 'exam',
            icon: <FileTextOutlined />,
            label: 'Đề thi',
            onClick: () => handleMenuClick('exam', '/exams'),
        },
        {
            key: 'forum',
            icon: <CommentOutlined />,
            label: 'Diễn đàn',
            onClick: () => handleMenuClick('forum', '/forum'),
        },
    ];

    return (
        <Sider
            width={200}
            style={{ background: '#fff', height: '100vh', borderRight: '1px solid #f0f0f0' }}
        >
            <Menu
                mode="vertical"
                selectedKeys={[selectedKey]}
                style={{ height: '100%' }}
            >
                {menuItems.map(item => (
                    <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
};

export default SideBarMenu;
