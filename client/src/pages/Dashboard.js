import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Typography,
  Button,
  message,
  Spin,
  Alert,
  Modal,
  Form,
  Input,
  Select,
  Progress
} from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Wallet,
  Plus,
  BarChart3,
  FileText,
  AlertTriangle,
  Bell
} from 'lucide-react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    totalTransactions: 0,
    incomePercentage: 0,
    expensePercentage: 0,
    savingsRate: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetForm] = Form.useForm();
  const navigate = useNavigate();

  const categories = [
    'salary', 'tip', 'project', 'food', 'movie', 'bills',
    'medical', 'fees', 'shopping', 'travel', 'other'
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));

      // Fetch dashboard data from backend
      const res = await axios.post('/get-dashboard-data', {
        userid: user._id
      });

      const { statistics, budgetAlerts: alerts, transactions: allTransactions } = res.data;

      // Process category data for charts
      const categoryBreakdown = {};
      allTransactions.forEach(t => {
        if (!categoryBreakdown[t.category]) {
          categoryBreakdown[t.category] = { income: 0, expense: 0 };
        }
        categoryBreakdown[t.category][t.type] += t.amount;
      });

      const categoryChartData = Object.entries(categoryBreakdown).map(([category, data]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        income: data.income,
        expense: data.expense,
        total: data.income + data.expense
      })).sort((a, b) => b.total - a.total).slice(0, 6);

      // Monthly trend data (last 6 months)
      const monthlyTrendData = [];
      for (let i = 5; i >= 0; i--) {
        const month = moment().subtract(i, 'months');
        const monthTransactions = allTransactions.filter(t =>
          moment(t.createdAt).format('YYYY-MM') === month.format('YYYY-MM')
        );

        const monthIncome = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);

        const monthExpenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);

        monthlyTrendData.push({
          month: month.format('MMM'),
          income: monthIncome,
          expenses: monthExpenses,
          balance: monthIncome - monthExpenses
        });
      }

      setDashboardData(statistics);
      setTransactions(allTransactions);
      setCategoryData(categoryChartData);
      setMonthlyData(monthlyTrendData);
      setBudgetAlerts(alerts);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAddBudget = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('/add-budget', {
        ...values,
        userid: user._id
      });
      message.success('Budget added successfully');
      setShowBudgetModal(false);
      budgetForm.resetFields();
      fetchDashboardData(); // Refresh dashboard data
    } catch (error) {
      console.error('Error adding budget:', error);
      message.error('Failed to add budget');
    }
  };

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{
              margin: '4px 0',
              color: entry.color,
              fontSize: '14px'
            }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      borderRadius: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          margin: '20px 0',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Title level={2} style={{
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontSize: '2.5rem'
        }}>
          <span style={{
            fontSize: '3rem',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>💰</span>
          BudgetBoss Dashboard
        </Title>
      </motion.div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '20px' }}
        >
          {budgetAlerts.map((alert, index) => (
            <Alert
              key={index}
              message={alert.message}
              type={alert.type === 'over_budget' ? 'error' : 'warning'}
              showIcon
              icon={alert.type === 'over_budget' ? <AlertTriangle /> : <Bell />}
              style={{ marginBottom: '10px' }}
              action={
                <Button size="small" type="primary" onClick={() => navigate('/settings')}>
                  Manage Budget
                </Button>
              }
            />
          ))}
        </motion.div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>

        <motion.div
          className="dashboard"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
            <Col xs={24} sm={12} lg={6}>
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }} />
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>Total Balance</span>}
                    value={dashboardData.totalBalance}
                    prefix={<span style={{ color: '#FFD700' }}>₹</span>}
                    valueStyle={{
                      color: '#fff',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                    suffix={
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: dashboardData.savingsRate >= 0 ? '#4ADE80' : '#F87171',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        marginTop: '5px'
                      }}>
                        <ArrowUpRight size={12} /> {dashboardData.savingsRate}%
                      </div>
                    }
                  />
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block',
                    marginTop: '8px'
                  }}>
                    💾 Savings Rate
                  </span>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card style={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(17, 153, 142, 0.3)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }} />
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>Monthly Income</span>}
                    value={dashboardData.monthlyIncome}
                    prefix={<span style={{ color: '#FFD700' }}>₹</span>}
                    valueStyle={{
                      color: '#fff',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                    suffix={
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: '#4ADE80',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        marginTop: '5px'
                      }}>
                        <ArrowUpRight size={12} /> {dashboardData.incomePercentage}%
                      </div>
                    }
                  />
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block',
                    marginTop: '8px'
                  }}>
                    📈 of total cash flow
                  </span>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card style={{
                  background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(238, 9, 121, 0.3)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }} />
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>Monthly Expenses</span>}
                    value={dashboardData.monthlyExpenses}
                    prefix={<span style={{ color: '#FFD700' }}>₹</span>}
                    valueStyle={{
                      color: '#fff',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                    suffix={
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: '#FDE68A',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        marginTop: '5px'
                      }}>
                        <ArrowDownRight size={12} /> {dashboardData.expensePercentage}%
                      </div>
                    }
                  />
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block',
                    marginTop: '8px'
                  }}>
                    📊 of total cash flow
                  </span>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card style={{
                  background: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(71, 118, 230, 0.3)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }} />
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>Total Transactions</span>}
                    value={dashboardData.totalTransactions}
                    valueStyle={{
                      color: '#fff',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                    suffix={
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        color: '#E0E7FF',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        marginTop: '5px'
                      }}>
                        <Calendar size={12} /> This Month
                      </div>
                    }
                  />
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    display: 'block',
                    marginTop: '8px'
                  }}>
                    📅 {moment().format('MMMM YYYY')}
                  </span>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Advanced Financial Analytics */}
          <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
            <Col xs={24} lg={16}>
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.01 }}
              >
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <TrendingUp size={20} style={{ color: '#1890ff' }} />
                      Smart Financial Insights
                    </div>
                  }
                  extra={
                    <div style={{
                      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      AI Powered
                    </div>
                  }
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <Progress
                            type="circle"
                            percent={Math.min(((dashboardData.monthlyIncome - dashboardData.monthlyExpenses) / dashboardData.monthlyIncome) * 100, 100)}
                            size={100}
                            strokeColor={{
                              '0%': '#ff4d4f',
                              '30%': '#faad14',
                              '70%': '#52c41a',
                              '100%': '#1890ff',
                            }}
                            format={(percent) => (
                              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                {percent.toFixed(0)}%
                              </div>
                            )}
                          />
                        </motion.div>
                        <Text strong style={{ display: 'block', marginTop: '10px' }}>
                          Savings Efficiency
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={16}>
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        >
                          <div style={{
                            background: 'linear-gradient(90deg, #36D1DC 0%, #5B86E5 100%)',
                            borderRadius: '10px',
                            padding: '15px',
                            color: 'white'
                          }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                              ₹{dashboardData.totalBalance.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.9 }}>
                              Current Net Worth
                            </div>
                          </div>
                        </motion.div>

                        <Row gutter={[8, 8]}>
                          <Col span={12}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              style={{
                                background: '#f6ffed',
                                border: '1px solid #b7eb8f',
                                borderRadius: '8px',
                                padding: '12px',
                                textAlign: 'center'
                              }}
                            >
                              <ArrowUpRight size={16} style={{ color: '#52c41a' }} />
                              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                                +₹{dashboardData.monthlyIncome.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '11px', color: '#666' }}>Income</div>
                            </motion.div>
                          </Col>
                          <Col span={12}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              style={{
                                background: '#fff2f0',
                                border: '1px solid #ffccc7',
                                borderRadius: '8px',
                                padding: '12px',
                                textAlign: 'center'
                              }}
                            >
                              <ArrowDownRight size={16} style={{ color: '#ff4d4f' }} />
                              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                -₹{dashboardData.monthlyExpenses.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '11px', color: '#666' }}>Expenses</div>
                            </motion.div>
                          </Col>
                        </Row>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} lg={8}>
              <motion.div
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
              >
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Target size={18} style={{ color: '#722ed1' }} />
                      Financial Goals
                    </div>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong>Emergency Fund Goal</Text>
                        <Text style={{ float: 'right', color: '#1890ff' }}>
                          {Math.min((dashboardData.totalBalance / 100000) * 100, 100).toFixed(0)}%
                        </Text>
                      </div>
                      <Progress
                        percent={Math.min((dashboardData.totalBalance / 100000) * 100, 100)}
                        strokeColor="#1890ff"
                        showInfo={false}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Target: ₹1,00,000
                      </Text>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong>Monthly Savings</Text>
                        <Text style={{ float: 'right', color: '#52c41a' }}>
                          {Math.max(dashboardData.savingsRate, 0)}%
                        </Text>
                      </div>
                      <Progress
                        percent={Math.min(Math.max(dashboardData.savingsRate + 50, 0), 100)}
                        strokeColor="#52c41a"
                        showInfo={false}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Target: 20% of income
                      </Text>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        padding: '15px',
                        textAlign: 'center',
                        color: 'white'
                      }}
                    >
                      <Wallet size={24} style={{ marginBottom: '8px' }} />
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {dashboardData.totalTransactions}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>
                        Transactions This Month
                      </div>
                    </motion.div>
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* AI Financial Advisor with Smart Recommendations */}
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            style={{ marginBottom: '30px' }}
          >
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  🧠 AI Financial Advisor
                  <div style={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    GPT-4 POWERED
                  </div>
                </div>
              }
            >
              <Row gutter={[24, 24]}>
                {/* Income Optimization Section */}
                <Col xs={24} lg={12}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '15px',
                      padding: '20px',
                      color: 'white',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ fontSize: '24px' }}>💰</div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Income Optimization AI</div>
                          <div style={{ fontSize: '12px', opacity: 0.9 }}>Smart ways to increase your income</div>
                        </div>
                      </div>

                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {(() => {
                          const incomeAdvice = [];

                          // AI Logic for Income Suggestions
                          if (dashboardData.monthlyIncome < 30000) {
                            incomeAdvice.push({
                              icon: '🎯',
                              title: 'Skill Development',
                              content: 'Consider learning high-demand skills like digital marketing, coding, or data analysis to increase earning potential.',
                              priority: 'High'
                            });
                            incomeAdvice.push({
                              icon: '💼',
                              title: 'Side Hustle',
                              content: 'Start freelancing in your spare time - even 10 hours/week can add ₹8,000-15,000 monthly.',
                              priority: 'Medium'
                            });
                          } else if (dashboardData.monthlyIncome < 60000) {
                            incomeAdvice.push({
                              icon: '📈',
                              title: 'Career Growth',
                              content: 'Time for promotion! Update resume, network actively, and consider job switching for 20-30% salary hike.',
                              priority: 'High'
                            });
                            incomeAdvice.push({
                              icon: '💡',
                              title: 'Passive Income',
                              content: 'Invest in dividend stocks or start a blog/YouTube channel for additional income streams.',
                              priority: 'Medium'
                            });
                          } else {
                            incomeAdvice.push({
                              icon: '🏆',
                              title: 'Investment Focus',
                              content: 'Excellent income! Focus on smart investments - SIP in equity funds can generate ₹50L+ in 10 years.',
                              priority: 'High'
                            });
                            incomeAdvice.push({
                              icon: '🏢',
                              title: 'Business Opportunity',
                              content: 'Consider starting a side business or investing in real estate for wealth multiplication.',
                              priority: 'Medium'
                            });
                          }

                          return incomeAdvice.map((advice, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.2 }}
                              style={{
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                padding: '12px',
                                border: '1px solid rgba(255,255,255,0.2)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <div style={{ fontSize: '18px' }}>{advice.icon}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '5px'
                                  }}>
                                    <Text strong style={{ color: 'white', fontSize: '13px' }}>
                                      {advice.title}
                                    </Text>
                                    <div style={{
                                      background: advice.priority === 'High' ? '#ff4d4f' : '#faad14',
                                      padding: '2px 6px',
                                      borderRadius: '8px',
                                      fontSize: '9px',
                                      fontWeight: 'bold'
                                    }}>
                                      {advice.priority}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '11px', lineHeight: '1.4', opacity: 0.9 }}>
                                    {advice.content}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ));
                        })()}
                      </Space>
                    </div>
                  </motion.div>
                </Col>

                {/* Expense Saving Section */}
                <Col xs={24} lg={12}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
                      borderRadius: '15px',
                      padding: '20px',
                      color: 'white',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ fontSize: '24px' }}>💡</div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Expense Optimization AI</div>
                          <div style={{ fontSize: '12px', opacity: 0.9 }}>Smart ways to cut your expenses</div>
                        </div>
                      </div>

                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {(() => {
                          const expenseAdvice = [];
                          const expenseRatio = (dashboardData.monthlyExpenses / dashboardData.monthlyIncome) * 100;

                          // AI Logic for Expense Reduction
                          if (expenseRatio > 80) {
                            expenseAdvice.push({
                              icon: '🚨',
                              title: 'Emergency Action Needed',
                              content: `Your expenses are ${expenseRatio.toFixed(0)}% of income! Cut non-essential spending immediately.`,
                              savings: '₹' + Math.round(dashboardData.monthlyExpenses * 0.3).toLocaleString(),
                              priority: 'Critical'
                            });
                            expenseAdvice.push({
                              icon: '🏠',
                              title: 'Housing Optimization',
                              content: 'Consider moving to a cheaper area or getting roommates to split rent costs.',
                              savings: '₹' + Math.round(dashboardData.monthlyExpenses * 0.2).toLocaleString(),
                              priority: 'High'
                            });
                          } else if (expenseRatio > 60) {
                            expenseAdvice.push({
                              icon: '🍽️',
                              title: 'Food Budget Control',
                              content: 'Cook at home more often. Meal planning can save 40% on food expenses.',
                              savings: '₹' + Math.round(dashboardData.monthlyExpenses * 0.15).toLocaleString(),
                              priority: 'High'
                            });
                            expenseAdvice.push({
                              icon: '🚗',
                              title: 'Transport Savings',
                              content: 'Use public transport or bike-sharing. Consider carpooling for daily commute.',
                              savings: '₹' + Math.round(dashboardData.monthlyExpenses * 0.1).toLocaleString(),
                              priority: 'Medium'
                            });
                          } else {
                            expenseAdvice.push({
                              icon: '✨',
                              title: 'Fine-tuning Expenses',
                              content: 'Great expense control! Focus on subscription audits and bulk buying for groceries.',
                              savings: '₹' + Math.round(dashboardData.monthlyExpenses * 0.08).toLocaleString(),
                              priority: 'Low'
                            });
                            expenseAdvice.push({
                              icon: '💳',
                              title: 'Smart Shopping',
                              content: 'Use cashback apps and compare prices online before making purchases.',
                              savings: '₹' + Math.round(dashboardData.monthlyExpenses * 0.05).toLocaleString(),
                              priority: 'Low'
                            });
                          }

                          return expenseAdvice.map((advice, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + index * 0.2 }}
                              style={{
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                padding: '12px',
                                border: '1px solid rgba(255,255,255,0.2)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <div style={{ fontSize: '18px' }}>{advice.icon}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '5px'
                                  }}>
                                    <Text strong style={{ color: 'white', fontSize: '13px' }}>
                                      {advice.title}
                                    </Text>
                                    <div style={{
                                      background: advice.priority === 'Critical' ? '#ff4d4f' :
                                        advice.priority === 'High' ? '#faad14' : '#52c41a',
                                      padding: '2px 6px',
                                      borderRadius: '8px',
                                      fontSize: '9px',
                                      fontWeight: 'bold'
                                    }}>
                                      Save {advice.savings}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '11px', lineHeight: '1.4', opacity: 0.9 }}>
                                    {advice.content}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ));
                        })()}
                      </Space>
                    </div>
                  </motion.div>
                </Col>
              </Row>

              {/* AI Summary and Action Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                style={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba225 100%)',
                  border: '1px solid #667eea30',
                  borderRadius: '15px',
                  padding: '20px',
                  marginTop: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{
                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🤖
                  </div>
                  <div>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                      AI Financial Health Report
                    </Text>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Personalized analysis based on your spending patterns
                    </div>
                  </div>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <div style={{ textAlign: 'center', padding: '15px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                        {dashboardData.savingsRate > 15 ? '🏆 Excellent' :
                          dashboardData.savingsRate > 5 ? '👍 Good' : '⚠️ Needs Work'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Financial Health</div>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div style={{ textAlign: 'center', padding: '15px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                        ₹{Math.round((dashboardData.monthlyIncome * 0.2) - (dashboardData.monthlyIncome - dashboardData.monthlyExpenses)).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Potential Monthly Savings</div>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div style={{ textAlign: 'center', padding: '15px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                        {Math.round(12 - (dashboardData.totalBalance / (dashboardData.monthlyIncome * 6)))} months
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>To Emergency Fund Goal</div>
                    </div>
                  </Col>
                </Row>

                <div style={{
                  background: '#f0f2f5',
                  borderRadius: '10px',
                  padding: '15px',
                  marginTop: '15px',
                  border: '1px solid #d9d9d9'
                }}>
                  <Text strong style={{ color: '#1890ff' }}>💡 AI Recommendation: </Text>
                  <Text style={{ fontSize: '14px' }}>
                    {(() => {
                      const savingsGap = (dashboardData.monthlyIncome * 0.2) - (dashboardData.monthlyIncome - dashboardData.monthlyExpenses);
                      if (savingsGap > 0) {
                        return `Focus on reducing expenses by ₹${Math.round(savingsGap).toLocaleString()} monthly. Start with the highest-priority suggestions above to achieve ideal 20% savings rate.`;
                      } else {
                        return `Great job! You're saving more than recommended. Consider increasing income through the suggestions above to accelerate wealth building.`;
                      }
                    })()}
                  </Text>
                </div>
              </motion.div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
          >
            <Card title="⚡ Quick Actions">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<Plus size={20} />}
                      onClick={() => navigate('/transactions')}
                    >
                      Add Transaction
                    </Button>
                  </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="large"
                      block
                      icon={<BarChart3 size={20} />}
                      onClick={() => navigate('/analytics')}
                    >
                      View Analytics
                    </Button>
                  </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="large"
                      block
                      icon={<FileText size={20} />}
                      onClick={() => navigate('/reports')}
                    >
                      Generate Reports
                    </Button>
                  </motion.div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="large"
                      block
                      icon={<Target size={20} />}
                      onClick={() => setShowBudgetModal(true)}
                    >
                      Set Budget
                    </Button>
                  </motion.div>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </motion.div>

        {/* Budget Modal */}
        <Modal
          title="Set Budget"
          open={showBudgetModal}
          onCancel={() => setShowBudgetModal(false)}
          footer={null}
          width={500}
        >
          <Form
            form={budgetForm}
            layout="vertical"
            onFinish={handleAddBudget}
          >
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category">
                {categories.map(category => (
                  <Option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label="Budget Amount"
              rules={[{ required: true, message: 'Please enter budget amount' }, { type: 'number', min: 1, message: 'Amount must be positive' }]}
            >
              <Input
                type="number"
                placeholder="Enter budget amount"
                prefix="₹"
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="period"
              label="Budget Period"
              rules={[{ required: true, message: 'Please select budget period' }]}
            >
              <Select placeholder="Select period">
                <Option value="monthly">Monthly</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description (Optional)"
            >
              <Input placeholder="Enter description" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Add Budget
                </Button>
                <Button onClick={() => setShowBudgetModal(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
