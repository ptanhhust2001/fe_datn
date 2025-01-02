import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    FileTextOutlined,
    CommentOutlined,
    SettingOutlined,
    BookOutlined,
    CrownOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './SidebarMenu.css';

const { Sider } = Layout;

const SideBarMenu = () => {
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState('exam');

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

    const managementItems = [
        {
            key: 'class',
            icon: <BookOutlined />,
            label: 'Lớp học tập',
            onClick: () => handleMenuClick('class', '/classes'),
        },
        {
            key: 'exam-management',
            icon: <HomeOutlined />,
            label: 'Quản lý bài thi',
            onClick: () => handleMenuClick('exam-management', '/exam-management'),
        },
        {
            key: 'service',
            icon: <CrownOutlined />,
            label: 'Gói dịch vụ',
            onClick: () => handleMenuClick('service', '/services'),
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

                <Menu.SubMenu key="management" icon={<AppstoreOutlined />} title="Quản lý">
                    {managementItems.map(item => (
                        <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
                            {item.label}
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>

                <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => handleMenuClick('settings', '/settings')}>
                    Cài đặt
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default SideBarMenu;
