import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/IMG_8887.png';
import {
    UserOutlined,
    GroupOutlined,
    AreaChartOutlined,
    WalletOutlined,
    UserSwitchOutlined,
    PicRightOutlined,
    PoundOutlined,
    ShopOutlined
} from '@ant-design/icons';
import { permissionmap } from '../../utils/config';

const { Sider } = Layout;

const AppSidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    let userData = { user: { name: "", email: "", contact: "", location: "", role: "" } };
    try {
        userData = JSON.parse(localStorage.getItem('user')) || { user: { name: "", email: "", contact: "", location: "", role: "" } };
    } catch (error) {

    }
    const { role } = userData.user;

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };
    const menuItems = [
        {
            key: '/dashboard',
            icon: <AreaChartOutlined style={{ fontSize: '1rem' }} />,
            label: 'Dashboard',
        },
        {
            key: '/stock-in',
            icon: <AreaChartOutlined style={{ fontSize: '1rem' }} />,
            label: 'Stock In',
        },
        {
            key: '/cash-in',
            icon: <AreaChartOutlined style={{ fontSize: '1rem' }} />,
            label: 'Cash In',
        },
        {
            key: '/cash-out',
            icon: <AreaChartOutlined style={{ fontSize: '1rem' }} />,
            label: 'Cash Out',
        },
        {
            key: '/consignment',
            icon: <AreaChartOutlined style={{ fontSize: '1rem' }} />,
            label: 'Consignment In',
        },
        {
            key: '/stock-out',
            icon: <AreaChartOutlined style={{ fontSize: '1rem' }} />,
            label: 'Stock Out',
        },
        {
            key: '/warehouse',
            icon: <WalletOutlined style={{ fontSize: '1rem' }} />,
            label: 'Warehouse',
        },
        {
            key: '/commodity',
            icon: <GroupOutlined style={{ fontSize: '1rem' }} />,
            label: 'Commodity',
        },
        {
            key: '/price',
            icon: <PoundOutlined style={{ fontSize: '1rem' }} />,
            label: 'Price',
        },
        {
            key: '/customers',
            icon: <UserSwitchOutlined style={{ fontSize: '1rem' }} />,
            label: 'Customer',
        },
        {
            key: '/farmers',
            icon: <ShopOutlined style={{ fontSize: '1rem' }} />,
            label: 'Farmer',
        },
        {
            key: '/transporters',
            icon: <PicRightOutlined style={{ fontSize: '1rem' }} />,
            label: 'Transporter',
        },
        {
            key: '/users',
            icon: <UserOutlined style={{ fontSize: '1rem' }} />,
            label: 'Users',
        }
    ];

    return (
        <Sider
            style={{ padding: '10px', background: 'white', borderRight: '1px solid #e2e2e2' }}
            width={300}
            breakpoint="lg"
            onCollapse={(collapsed, type) => {
                setCollapsed(collapsed);
            }}
            collapsed={collapsed}>
            <div onClick={() => navigate('/dashboard')} className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <Menu
                onClick={handleMenuClick}
                style={{ fontSize: '1rem' }}
                defaultSelectedKeys={[location.pathname]}
            >
                {menuItems.map((item) => (role && (permissionmap[role].includes(item.key) || role === 'ADMIN') &&
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.label}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
};

export default AppSidebar;
