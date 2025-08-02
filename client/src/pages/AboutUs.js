import React from 'react';
import { Typography, Card, Row, Col, Space, Avatar, Button } from 'antd';
import { motion } from 'framer-motion';
import {
    UserOutlined,
    CodeOutlined,
    DatabaseOutlined,
    ApiOutlined,
    GithubOutlined,
    LinkedinOutlined,
    MailOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Paragraph, Text } = Typography;

const AboutUs = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const technologies = [
        { name: 'React.js', icon: <CodeOutlined />, color: '#61DAFB' },
        { name: 'Node.js', icon: <ApiOutlined />, color: '#339933' },
        { name: 'MongoDB', icon: <DatabaseOutlined />, color: '#47A248' },
        { name: 'Express.js', icon: <CodeOutlined />, color: '#000000' },
        { name: 'Ant Design', icon: <CodeOutlined />, color: '#1890FF' },
        { name: 'Framer Motion', icon: <CodeOutlined />, color: '#FF0055' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: theme === 'dark'
                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            padding: '80px 20px 40px',
            color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
        }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ maxWidth: '1200px', margin: '0 auto' }}
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        💼
                    </div>
                    <Title level={1} style={{
                        color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        About BudgetBoss
                    </Title>
                    <Paragraph style={{
                        fontSize: '1.3rem',
                        color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: '1.8'
                    }}>
                        BudgetBoss is a modern and powerful expense management system designed to organize your financial life.
                    </Paragraph>
                </motion.div>

                {/* About Project Section */}
                <motion.div variants={itemVariants} style={{ marginBottom: '60px' }}>
                    <Card
                        style={{
                            background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Title level={2} style={{
                            color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                            textAlign: 'center',
                            marginBottom: '30px'
                        }}>
                            🚀 About the Project
                        </Title>

                        <Row gutter={[32, 32]}>
                            <Col xs={24} md={12}>
                                <div style={{ padding: '20px' }}>
                                    <Title level={3} style={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}>
                                        💡 Features
                                    </Title>
                                    <ul style={{ fontSize: '1.1rem', lineHeight: '2', color: theme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                                        <li>📊 Real-time expense tracking</li>
                                        <li>💰 Income and expense management</li>
                                        <li>📈 Interactive charts and analytics</li>
                                        <li>📱 Responsive design</li>
                                        <li>🔐 Secure user authentication</li>
                                        <li>📄 Detailed reports generation</li>
                                        <li>🌙 Dark/Light theme support</li>
                                        <li>⚡ Fast and efficient performance</li>
                                    </ul>
                                </div>
                            </Col>

                            <Col xs={24} md={12}>
                                <div style={{ padding: '20px' }}>
                                    <Title level={3} style={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}>
                                        🎯 Purpose
                                    </Title>
                                    <Paragraph style={{
                                        fontSize: '1.1rem',
                                        lineHeight: '2',
                                        color: theme === 'dark' ? '#cbd5e1' : '#64748b'
                                    }}>
                                        BudgetBoss's main goal is to help people better understand their financial habits.
                                        This application has been built using modern web technologies and provides a user-friendly interface.
                                    </Paragraph>
                                    <Paragraph style={{
                                        fontSize: '1.1rem',
                                        lineHeight: '2',
                                        color: theme === 'dark' ? '#cbd5e1' : '#64748b'
                                    }}>
                                        With this app, you can track your daily expenses, set budgets, and view detailed analytics.
                                    </Paragraph>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </motion.div>

                {/* Developer Section */}
                <motion.div variants={itemVariants} style={{ marginBottom: '60px' }}>
                    <Card
                        style={{
                            background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center'
                        }}
                    >
                        <Title level={2} style={{
                            color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                            marginBottom: '40px'
                        }}>
                            👨‍💻 Developer Information
                        </Title>

                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <Avatar
                                size={120}
                                icon={<UserOutlined />}
                                style={{
                                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                    marginBottom: '20px',
                                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)'
                                }}
                            />

                            <Title level={3} style={{
                                color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                                marginBottom: '10px'
                            }}>
                                Tarun Varshney
                            </Title>

                            <Text style={{
                                fontSize: '1.2rem',
                                color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                                display: 'block',
                                marginBottom: '20px'
                            }}>
                                Full Stack Developer
                            </Text>

                            <Paragraph style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                                color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                                marginBottom: '30px'
                            }}>
                                BudgetBoss has been developed by Tarun Varshney, a passionate full-stack developer
                                who has expertise in modern web technologies. This project has been built using the MERN stack
                                (MongoDB, Express.js, React.js, Node.js).
                            </Paragraph>

                            <Space size="large" wrap>
                                <Button
                                    type="primary"
                                    icon={<GithubOutlined />}
                                    size="large"
                                    style={{
                                        background: 'linear-gradient(135deg, #333, #666)',
                                        border: 'none',
                                        borderRadius: '8px'
                                    }}
                                    onClick={() => window.open('https://github.com/tarun6546', '_blank')}
                                >
                                    GitHub
                                </Button>

                                <Button
                                    type="primary"
                                    icon={<LinkedinOutlined />}
                                    size="large"
                                    style={{
                                        background: 'linear-gradient(135deg, #0077B5, #00A0DC)',
                                        border: 'none',
                                        borderRadius: '8px'
                                    }}
                                    onClick={() => window.open('https://www.linkedin.com/in/tarun-varshney-051380191/', '_blank')}
                                >
                                    LinkedIn
                                </Button>

                                <Button
                                    type="primary"
                                    icon={<MailOutlined />}
                                    size="large"
                                    style={{
                                        background: 'linear-gradient(135deg, #EA4335, #FBBC05)',
                                        border: 'none',
                                        borderRadius: '8px'
                                    }}
                                    onClick={() => window.open('mailto:tarunvarshney2112@gmail.com', '_blank')}
                                >
                                    Email
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </motion.div>

                {/* Technologies Section */}
                <motion.div variants={itemVariants} style={{ marginBottom: '60px' }}>
                    <Card
                        style={{
                            background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Title level={2} style={{
                            color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                            textAlign: 'center',
                            marginBottom: '40px'
                        }}>
                            🛠️ Technologies Used
                        </Title>

                        <Row gutter={[24, 24]} justify="center">
                            {technologies.map((tech, index) => (
                                <Col key={index} xs={12} sm={8} md={6} lg={4}>
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Card
                                            style={{
                                                textAlign: 'center',
                                                background: theme === 'dark' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(248, 250, 252, 0.8)',
                                                border: `1px solid ${tech.color}20`,
                                                borderRadius: '12px',
                                                height: '120px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                            bodyStyle={{ padding: '16px' }}
                                        >
                                            <div style={{
                                                fontSize: '2rem',
                                                color: tech.color,
                                                marginBottom: '8px'
                                            }}>
                                                {tech.icon}
                                            </div>
                                            <Text style={{
                                                color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                                                fontWeight: '500',
                                                fontSize: '0.9rem'
                                            }}>
                                                {tech.name}
                                            </Text>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </motion.div>

                {/* Back to Home Button */}
                <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={() => navigate('/')}
                        style={{
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 32px',
                            height: 'auto',
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)'
                        }}
                    >
                        Back to Home
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AboutUs;
