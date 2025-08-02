import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Statistic,
  Avatar,
  List,
  Badge
} from 'antd';
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  PieChart,
  FileText,
  Settings,
  Smartphone,
  Star,
  Award,
  Target,
  Globe
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';

const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const features = [
    {
      icon: <DollarSign size={28} />,
      title: 'Smart Expense Tracking',
      description: 'Easily track your income and expenses with intuitive categorization and real-time updates.',
      color: '#10B981'
    },
    {
      icon: <BarChart3 size={28} />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your spending patterns with beautiful charts and reports.',
      color: '#3B82F6'
    },
    {
      icon: <Shield size={28} />,
      title: 'Secure & Private',
      description: 'Your financial data is protected with industry-standard security measures.',
      color: '#F59E0B'
    },
    {
      icon: <Zap size={28} />,
      title: 'Lightning Fast',
      description: 'Built with modern technology for a smooth and responsive user experience.',
      color: '#8B5CF6'
    },
    {
      icon: <PieChart size={28} />,
      title: 'Visual Reports',
      description: 'Generate comprehensive reports and visualize your financial health at a glance.',
      color: '#EF4444'
    },
    {
      icon: <Smartphone size={28} />,
      title: 'Responsive Design',
      description: 'Access BudgetBoss from any device with our mobile-friendly interface.',
      color: '#06B6D4'
    }
  ];

  const stats = [
    { title: 'Active Users', value: '10K+', suffix: '', icon: <Users size={24} />, color: '#10B981' },
    { title: 'Transactions Tracked', value: '1M+', suffix: '', icon: <TrendingUp size={24} />, color: '#3B82F6' },
    { title: 'Money Saved', value: '$500K+', suffix: '', icon: <DollarSign size={24} />, color: '#F59E0B' },
    { title: 'Uptime', value: '99.9%', suffix: '', icon: <Target size={24} />, color: '#8B5CF6' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelancer',
      content: 'BudgetBoss has completely transformed how I manage my finances. The analytics are incredible!',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Small Business Owner',
      content: 'Finally, a simple yet powerful tool to track my business expenses. Highly recommended!',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Student',
      content: 'Perfect for budgeting as a student. The interface is so intuitive and easy to use.',
      avatar: '👩‍🎓',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
    ));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #0a0a23 0%, #1a0a2e 25%, #2a1a3e 50%, #1a2e3e 75%, #0a2e4e 100%)'
        : 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #feca57 100%)'
    }}>
      <Navbar />

      {/* Hero Section */}
      <section id="hero" style={{
        padding: '170px 20px 100px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme === 'dark'
            ? 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.2) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(255, 202, 87, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(69, 183, 209, 0.15) 0%, transparent 50%)',
          zIndex: 1
        }} />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ fontSize: '5rem', marginBottom: '30px', display: 'inline-block' }}
          >
            💼
          </motion.div>

          <Title level={1} style={{
            marginBottom: '30px',
            color: '#ffffff',
            fontSize: '4rem',
            fontWeight: 'bold',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            Smart Expense Management
          </Title>

          <Paragraph style={{
            fontSize: '1.4rem',
            color: theme === 'dark' ? '#e2e8f0' : '#ffffff',
            marginBottom: '50px',
            maxWidth: '700px',
            margin: '0 auto 50px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Take control of your finances with our powerful expense tracking platform.
            Track, analyze, and optimize your spending with beautiful insights and reports.
          </Paragraph>

          <Space size="large">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/register')}
                style={{
                  height: '60px',
                  padding: '0 40px',
                  fontSize: '1.2rem',
                  borderRadius: '30px',
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  border: 'none',
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)'
                }}
              >
                Get Started Free
                <ArrowRight size={20} style={{ marginLeft: '10px' }} />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="large"
                onClick={() => navigate('/login')}
                style={{
                  height: '60px',
                  padding: '0 40px',
                  fontSize: '1.2rem',
                  borderRadius: '30px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Sign In
              </Button>
            </motion.div>
          </Space>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" style={{
        padding: '80px 20px',
        background: theme === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <Card style={{
                    textAlign: 'center',
                    border: 'none',
                    borderRadius: '20px',
                    background: theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{
                      color: stat.color,
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {stat.icon}
                    </div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{
                        color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                        fontSize: '2.5rem',
                        fontWeight: 'bold'
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '100px 20px',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <Title level={2} style={{
              marginBottom: '20px',
              color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
              fontSize: '3rem'
            }}>
              Why Choose BudgetBoss?
            </Title>
            <Paragraph style={{
              fontSize: '1.2rem',
              color: theme === 'dark' ? '#cbd5e1' : '#64748b',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Built with modern technology and user experience in mind
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card
                    style={{
                      height: '100%',
                      border: 'none',
                      borderRadius: '20px',
                      background: theme === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '20px',
                      color: '#1890ff'
                    }}>
                      {feature.icon}
                      <Title level={4} style={{
                        margin: '0 0 0 15px',
                        color: theme === 'dark' ? '#ffffff' : '#1a1a1a'
                      }}>
                        {feature.title}
                      </Title>
                    </div>
                    <Paragraph style={{
                      color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                      margin: 0,
                      fontSize: '1rem',
                      lineHeight: '1.6'
                    }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{
        padding: '100px 20px',
        background: theme === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <Title level={2} style={{
              marginBottom: '20px',
              color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
              fontSize: '3rem'
            }}>
              What Our Users Say
            </Title>
            <Paragraph style={{
              fontSize: '1.2rem',
              color: theme === 'dark' ? '#cbd5e1' : '#64748b'
            }}>
              Join thousands of satisfied users who have transformed their financial management
            </Paragraph>
          </motion.div>

          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card style={{
                    height: '100%',
                    border: 'none',
                    borderRadius: '20px',
                    background: theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <Avatar size={80} style={{ fontSize: '2.5rem' }}>
                        {testimonial.avatar}
                      </Avatar>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                      ))}
                    </div>
                    <Paragraph style={{
                      color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      fontStyle: 'italic',
                      marginBottom: '20px',
                      lineHeight: '1.6'
                    }}>
                      "{testimonial.content}"
                    </Paragraph>
                    <div style={{ textAlign: 'center' }}>
                      <Text strong style={{
                        color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
                        fontSize: '1.1rem'
                      }}>
                        {testimonial.name}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '1rem' }}>
                        {testimonial.role}
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 30%, #45b7d1 60%, #feca57 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          zIndex: 1
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <Title level={2} style={{
            marginBottom: '30px',
            color: '#ffffff',
            fontSize: '3.5rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            Ready to Take Control of Your Finances?
          </Title>
          <Paragraph style={{
            fontSize: '1.3rem',
            color: '#ffffff',
            marginBottom: '50px',
            opacity: 0.95,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Join thousands of users who have already transformed their financial management
          </Paragraph>

          <Space size="large">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/register')}
                style={{
                  height: '60px',
                  padding: '0 40px',
                  fontSize: '1.2rem',
                  borderRadius: '30px',
                  background: '#ffffff',
                  color: '#667eea',
                  border: 'none',
                  boxShadow: '0 8px 25px rgba(255, 255, 255, 0.3)'
                }}
              >
                Start Free Trial
                <ArrowRight size={20} style={{ marginLeft: '10px' }} />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="large"
                onClick={() => navigate('/login')}
                style={{
                  height: '60px',
                  padding: '0 40px',
                  fontSize: '1.2rem',
                  borderRadius: '30px',
                  background: 'transparent',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Sign In
              </Button>
            </motion.div>
          </Space>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="footer" style={{
        padding: '60px 20px',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ fontSize: '3rem', marginBottom: '30px', display: 'inline-block' }}
          >
            💼
          </motion.div>
          <Title level={3} style={{
            marginBottom: '15px',
            color: theme === 'dark' ? '#ffffff' : '#1a1a1a'
          }}>
            Expense Management System
          </Title>
          <Paragraph style={{
            color: theme === 'dark' ? '#cbd5e1' : '#64748b',
            marginBottom: '30px',
            fontSize: '1.1rem'
          }}>
            © 2024 Expense Management System. All rights reserved.
          </Paragraph>
          <Space size="large">
            <Text type="secondary" style={{ cursor: 'pointer' }}>Privacy Policy</Text>
            <Text type="secondary" style={{ cursor: 'pointer' }}>Terms of Service</Text>
            <Text type="secondary" style={{ cursor: 'pointer' }}>Contact Us</Text>
          </Space>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 