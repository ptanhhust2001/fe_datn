// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';  // Outlet để hiển thị các trang con
import HeaderComponent from './Home/HeaderComponent';  // Import HeaderComponent

const Layout = ({ userInfo, onLogout, onProfileClick, classes, onClassClick }) => {
    return (
        <div className="layout">
            {/* Header sẽ luôn hiển thị trên tất cả các trang */}
            <HeaderComponent
                userInfo={userInfo}
                onLogout={onLogout}
                onProfileClick={onProfileClick}
                classes={classes}
                onClassClick={onClassClick}
            />

            {/* Outlet để hiển thị trang con */}
            <div className="content">
                <Outlet />  {/* Các trang con sẽ được render ở đây */}
            </div>
        </div>
    );
};

export default Layout;
