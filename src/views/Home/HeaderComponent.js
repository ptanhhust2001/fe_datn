import React from 'react';
import { Menu, Dropdown, Button, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './HeaderComponent.css';
import { PlusOutlined } from '@ant-design/icons';

const HeaderComponent = ({ userInfo, onLogout, onProfileClick, classes, onClassClick }) => {
    // Kiểm tra classes trước khi sử dụng .map()
    const classList = Array.isArray(classes) ? classes : [];

    return (
        <div className="header">
            {/* Logo với hình ảnh, chuyển hướng về trang Home khi click */}
            <div className="logo">
                <Link to="/home">
                    <img src="http://localhost:8080/books/file/logo/logoweb.jpg" alt="Logo" className="logo-image" />
                </Link>
            </div>

            {/* Dropdown danh sách các lớp học */}
            <div className="class-list">
                {classList.map((classItem) => (
                    <Dropdown
                        key={classItem.id}
                        overlay={
                            <Menu>
                                {/* Hiển thị các môn học trong lớp */}
                                {classItem.subjects.map(subject => (
                                    <Menu.Item key={subject.id} onClick={() => onClassClick(classItem.id)}>
                                        {subject.name}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                        trigger={['click']}
                        placement="bottomLeft"
                    >
                        <Button className="class-item">{classItem.name}</Button>
                    </Dropdown>
                ))}
            </div>

            {/* Nút Tạo Bài Viết */}
            <div className="create-post-button">
                <Link to="/create-post">
                    <Button className="btn-create-post" icon={<PlusOutlined />}>
                        Tạo Bài Viết
                    </Button>
                </Link>
            </div>


            {/* Nút Thi Thử */}
            <div className="exam-button">
                <Link to="/exams"> {/* Thay đổi đường dẫn đến trang danh sách đề thi */}
                    <Button className="btn-exam">
                        Thi Thử
                    </Button>
                </Link>
            </div>

            {/* Avatar và Menu người dùng */}
            <Dropdown
                overlay={
                    <Menu>
                        {/* Thông tin cá nhân */}
                        <Menu.Item key="profile" icon={<UserOutlined />} onClick={onProfileClick}>
                            Thông tin cá nhân
                        </Menu.Item>
                        {/* Đăng xuất */}
                        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
                            Đăng xuất
                        </Menu.Item>
                    </Menu>
                }
                trigger={['click']}
                placement="bottomRight"
            >
                <Button type="text">
                    {/* Hiển thị avatar người dùng */}
                    <Avatar
                        src={userInfo?.avatarUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                        icon={<UserOutlined />}
                        size="large"
                    />
                </Button>
            </Dropdown>



        </div>
    );
};

export default HeaderComponent;
