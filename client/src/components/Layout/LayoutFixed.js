import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Layout as AntLayout,
    Menu,
    Button,
    theme,
    Avatar,
    Dropdown,
    Typography,
    Space,
    Modal
} from 'antd';
import {
    DashboardOutlined,
    TransactionOutlined,
    BarChartOutlined,
    UserOutlined,
    FileTextOutlined,
    HomeOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';

const { Sider, Header, Content } = AntLayout;
const { Title } = Typography;

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme: currentTheme, toggleTheme } = useTheme();

    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => {
        Modal.confirm({
            title: 'Confirm Logout',
            content: 'Are you sure you want to logout?',
            okText: 'Yes, Logout',
            cancelText: 'Cancel',
            onOk() {
                localStorage.removeItem('user');
                navigate('/');
            },
        });
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/transactions',
            icon: <TransactionOutlined />,
            label: 'Transactions',
        },
        {
            key: '/analytics',
            icon: <BarChartOutlined />,
            label: 'Analytics',
        },
        {
            key: '/reports',
            icon: <FileTextOutlined />,
            label: 'Reports',
        },
        {
            key: '/profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: currentTheme === 'dark' ? '#001529' : '#fff',
                    borderRight: currentTheme === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
                }}
            >
                <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderBottom: currentTheme === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
                }}>
                    <div className="sidebar-briefcase-logo" style={{
                        fontSize: '2rem',
                        marginBottom: '8px',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(2px 2px 4px rgba(79, 70, 229, 0.3))',
                        transition: 'all 0.3s ease'
                    }}>💼</div>
                    {!collapsed && (
                        <Title level={4} style={{
                            margin: 0,
                            color: currentTheme === 'dark' ? '#fff' : '#000',
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: currentTheme === 'dark' ? '#fff' : 'transparent',
                            backgroundClip: 'text',
                            fontWeight: 'bold'
                        }}>
                            BudgetBoss
                        </Title>
                    )}
                </div>

                <Menu
                    theme={currentTheme}
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{
                        borderRight: 'none',
                        marginTop: '16px',
                    }}
                />
            </Sider>

            <AntLayout>
                <Header style={{
                    padding: '0 16px',
                    background: currentTheme === 'dark' ? '#001529' : '#fff',
                    borderBottom: currentTheme === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
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

                    <Space>
                        <Button
                            type="text"
                            onClick={toggleTheme}
                            style={{ fontSize: '16px' }}
                        >
                            {currentTheme === 'dark' ? '☀️' : '🌙'}
                        </Button>

                        <Button
                            type="text"
                            icon={<HomeOutlined />}
                            onClick={handleBackToHome}
                            style={{ fontSize: '16px' }}
                            title="Back to Home"
                        />

                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            style={{ fontSize: '16px' }}
                            title="Logout"
                        />

                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            arrow
                        >
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} />
                                {!collapsed && (
                                    <span style={{ color: currentTheme === 'dark' ? '#fff' : '#000' }}>
                                        {user.name || 'User'}
                                    </span>
                                )}
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>

                <Content style={{
                    margin: '16px',
                    padding: '24px',
                    background: currentTheme === 'dark' ? '#141414' : '#fff',
                    borderRadius: '8px',
                    minHeight: 'calc(100vh - 112px)',
                }}>
                    {children}
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default Layout;
