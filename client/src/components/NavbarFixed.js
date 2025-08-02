import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Button,
    Space,
    Typography,
    Menu,
    Dropdown
} from 'antd';
import {
    MenuOutlined,
    HomeOutlined,
    UserOutlined,
    FileTextOutlined,
    PhoneOutlined,
    LoginOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

const { Title } = Typography;

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
            if (userData.photo) {
                setPhotoPreview(userData.photo);
            }
        }
    }, []);

    const menuItems = [
        { key: 'home', label: 'Home', icon: <HomeOutlined /> },
        { key: 'features', label: 'Features', icon: <FileTextOutlined /> },
        { key: 'about', label: 'About', icon: <UserOutlined /> },
        { key: 'contact', label: 'Contact', icon: <PhoneOutlined /> }
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    const handleNavClick = (key) => {
        switch (key) {
            case 'home':
                scrollToSection('hero');
                break;
            case 'features':
                scrollToSection('features');
                break;
            case 'about':
                scrollToSection('about');
                break;
            case 'contact':
                scrollToSection('contact');
                break;
            default:
                break;
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Profile',
            onClick: () => navigate('/profile')
        },
        {
            key: 'dashboard',
            label: 'Dashboard',
            onClick: () => navigate('/dashboard')
        },
        {
            key: 'logout',
            label: 'Logout',
            onClick: () => {
                localStorage.removeItem('user');
                setUser(null);
                navigate('/');
            }
        }
    ];

    const containerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled
            ? (theme === 'dark'
                ? 'rgba(26, 26, 26, 0.95)'
                : 'rgba(255, 255, 255, 0.95)')
            : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled
            ? (theme === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)')
            : 'none',
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none'
    };

    return (
        <motion.div
            style={containerStyle}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '70px'
            }}>
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => document.getElementById('hero').scrollIntoView({ behavior: 'smooth' })}
                >
                    <div className="briefcase-logo" style={{
                        fontSize: '2.5rem',
                        marginRight: '12px',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        position: 'relative',
                        filter: 'drop-shadow(2px 2px 4px rgba(79, 70, 229, 0.3))',
                        transition: 'all 0.3s ease'
                    }}>
                        💼
                    </div>
                    <Title level={4} style={{
                        margin: 0,
                        color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: theme === 'dark' ? '#ffffff' : 'transparent',
                        backgroundClip: 'text'
                    }}>
                        BudgetBoss
                    </Title>
                </motion.div>

                {/* Desktop Menu */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Space size="large">
                        {menuItems.map((item) => (
                            <motion.div
                                key={item.key}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                            >
                                <Button
                                    type="text"
                                    icon={item.icon}
                                    onClick={() => handleNavClick(item.key)}
                                    style={{
                                        color: theme === 'dark' ? '#ffffff' : '#333333',
                                        border: 'none',
                                        background: 'transparent',
                                        fontWeight: '500',
                                        height: '40px',
                                        padding: '0 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="nav-menu-item"
                                >
                                    {item.label}
                                </Button>
                            </motion.div>
                        ))}
                    </Space>

                    <div style={{ marginLeft: '24px' }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Dropdown
                                    menu={{ items: userMenuItems }}
                                    trigger={['click']}
                                    placement="bottomRight"
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {photoPreview ? (
                                            <img
                                                src={photoPreview}
                                                alt="Profile"
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <UserOutlined style={{
                                                fontSize: '18px',
                                                color: theme === 'dark' ? '#ffffff' : '#333333'
                                            }} />
                                        )}
                                        <span style={{
                                            color: theme === 'dark' ? '#ffffff' : '#333333',
                                            fontWeight: '500'
                                        }}>
                                            {user.name}
                                        </span>
                                    </div>
                                </Dropdown>
                            </div>
                        ) : (
                            <Space>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        icon={<LoginOutlined />}
                                        onClick={() => navigate('/login')}
                                        style={{
                                            borderColor: '#4F46E5',
                                            color: '#4F46E5',
                                            background: 'transparent',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Login
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        type="primary"
                                        icon={<UserAddOutlined />}
                                        onClick={() => navigate('/register')}
                                        style={{
                                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                            border: 'none',
                                            fontWeight: '500',
                                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </motion.div>
                            </Space>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div style={{ display: 'none' }} className="mobile-menu-container">
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            color: theme === 'dark' ? '#ffffff' : '#333333',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '18px'
                        }}
                    />
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                        background: theme === 'dark' ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)',
                        borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                        padding: '16px 24px',
                        display: 'none'
                    }}
                    className="mobile-menu"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.key}
                                type="text"
                                icon={item.icon}
                                onClick={() => handleNavClick(item.key)}
                                style={{
                                    color: theme === 'dark' ? '#ffffff' : '#333333',
                                    border: 'none',
                                    background: 'transparent',
                                    justifyContent: 'flex-start',
                                    fontWeight: '500',
                                    height: '40px',
                                    padding: '0 16px'
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}

                        {!user && (
                            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Button
                                    icon={<LoginOutlined />}
                                    onClick={() => {
                                        navigate('/login');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    style={{
                                        borderColor: '#4F46E5',
                                        color: '#4F46E5',
                                        background: 'transparent',
                                        fontWeight: '500'
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<UserAddOutlined />}
                                    onClick={() => {
                                        navigate('/register');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                        border: 'none',
                                        fontWeight: '500'
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Navbar;
