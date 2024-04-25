import React from 'react';
import { Button, Layout, message } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const { Header } = Layout;

const AppHeader = ({ setCollapsed, collapsed, colorBgContainer }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await api.request('post', '/api/logout');

            if (response.status) {
                localStorage.clear();
                navigate('/login');
            } else {
                message.error('Logout failed. Please try again.');
            }
        } catch (error) {
            message.error('An error occurred. Please try again.');
        }
    };

    let userData = { user: { name: "", email: "", contact: "", location: "", role: "" } };
    try {
        userData = JSON.parse(localStorage.getItem('user')) || { user: { name: "", email: "", contact: "", location: "", role: "" } };
    } catch (error) {

    }

    const { name, role } = userData.user;

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <span style={{
                    textTransform: 'capitalize',
                    color: '#c20b48',
                    fontWeight: 'bold'
                }}>
                    | {role}
                </span>
            </div>
            <div style={{ marginRight: '20px' }}>
                <span style={{ marginRight: '20px', textTransform: 'capitalize' }}>
                    Welcome, {name}
                </span>
                <Button onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </Header>
    );
};

export default AppHeader;
