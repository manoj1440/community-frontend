import React, { useEffect, useState } from 'react';

import { Layout, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { Footer } from 'antd/es/layout/layout';
import AppHeader from './AppHeader';
const { Content } = Layout;
const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer } } = theme.useToken();

    const location = useLocation();
    const navigate = useNavigate();
    const isLoginPage = location.pathname === '/login';

    useEffect(() => {
        let userData = null;
        try {
            userData = JSON.parse(localStorage.getItem('user'));
        } catch (error) {

        }

        if (userData && isLoginPage) {
            navigate('/dashboard');
        }

        if (!userData && !isLoginPage) {
            navigate('/login');
            localStorage.clear();
        }
    }, [isLoginPage, navigate, location]);

    if (isLoginPage) {
        return <Outlet />;
    }
    return (
        <Layout
            hasSider
            style={{ height: '98vh' }}>


            <AppSidebar setCollapsed={setCollapsed} collapsed={collapsed} />
            <Layout>
                <AppHeader
                    colorBgContainer={colorBgContainer}
                    setCollapsed={setCollapsed}
                    collapsed={collapsed}
                />

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                        padding: '0px 0px 10px 0px'
                    }}
                >
                    InfyuLabs ©2023
                </Footer>
            </Layout>
        </Layout>
    );
};
export default AppLayout;