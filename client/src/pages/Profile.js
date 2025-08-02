import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  message,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Divider
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  MailOutlined,
  CalendarOutlined,
  TrophyOutlined,
  DollarOutlined
} from '@ant-design/icons';
import Spinner from '../components/Spinner';
import axios from 'axios';
import Modal from 'antd/es/modal/Modal';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm] = Form.useForm();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    accountBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      form.setFieldsValue({
        name: userData.name,
        email: userData.email
      });
      setPhotoPreview(userData.photo || null);
      fetchStats(userData._id);
    }
  }, [form]);

  const fetchStats = async (userid) => {
    try {
      setLoading(true);
      const res = await axios.post('/get-transactions', {
        userid,
        frequency: '30',
        type: 'all'
      });
      const transactions = res.data || [];
      const totalTransactions = transactions.length;
      const monthlyIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const monthlyExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      const accountBalance = monthlyIncome - monthlyExpenses;
      setStats({ totalTransactions, accountBalance, monthlyIncome, monthlyExpenses });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to fetch statistics');
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      let photoData = user.photo;

      if (photoFile) {
        // Convert image to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          photoData = reader.result;
          await updateUserInDatabase({ ...values, photo: photoData });
        };
        reader.readAsDataURL(photoFile);
      } else {
        await updateUserInDatabase({ ...values, photo: photoData });
      }
    } catch (error) {
      setLoading(false);
      message.error('Failed to update profile');
    }
  };

  const updateUserInDatabase = async (updateData) => {
    try {
      // Update in database
      const response = await axios.post('/update-user', {
        userId: user._id,
        name: updateData.name,
        email: updateData.email,
        photo: updateData.photo
      });

      if (response.data.success) {
        // Update local storage and state
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setPhotoPreview(updatedUser.photo);
        setIsEditing(false);
        setPhotoFile(null);
        message.success('Profile updated successfully');
      } else {
        message.error('Failed to update profile in database');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Update profile error:', error);
      message.error('Failed to update profile in database');
    }
  };

  const handleCancelEdit = () => {
    form.setFieldsValue({
      name: user?.name,
      email: user?.email
    });
    setIsEditing(false);
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {loading && <Spinner />}
      <Title level={2} style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserOutlined />
        Profile
      </Title>
      <Row gutter={[24, 24]}>
        {/* Profile Header */}
        <Col xs={24}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', padding: '32px 24px', boxShadow: '0 4px 24px rgba(102,126,234,0.08)' }}>
              <Avatar
                size={80}
                src={photoPreview}
                icon={!photoPreview && <UserOutlined />}
                style={{ backgroundColor: '#fff', objectFit: 'cover', border: '2px solid #764ba2', boxShadow: '0 2px 8px rgba(102,126,234,0.12)' }}
              />
              <div style={{ flex: 1 }}>
                <Title level={3} style={{ margin: 0, color: '#fff', fontWeight: 'bold', letterSpacing: '1px' }}>{user.name}</Title>
                <Text type="secondary" style={{ fontSize: '16px', color: '#ffe066', fontWeight: '500' }}>
                  <MailOutlined style={{ marginRight: '8px' }} />
                  {user.email}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '14px', color: '#e1e8ed' }}>
                  <CalendarOutlined style={{ marginRight: '8px' }} />
                  Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </Text>
                <div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Button type="primary" style={{ background: '#ffe066', color: '#764ba2', fontWeight: 'bold', border: 'none', boxShadow: '0 2px 8px rgba(255,224,102,0.12)' }} icon={<EditOutlined />} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  <Button type="default" style={{ background: '#fff', color: '#764ba2', fontWeight: 'bold', border: '1px solid #764ba2' }} icon={<TrophyOutlined />} onClick={() => navigate('/reports')}>
                    My Reports
                  </Button>
                  <Button type="default" style={{ background: '#fff', color: '#764ba2', fontWeight: 'bold', border: '1px solid #764ba2' }} icon={<DollarOutlined />} onClick={() => navigate('/transactions')}>
                    My Transactions
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        {/* Profile Form */}
        <Col xs={24} lg={12}>
          <Card title="Personal Information">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              disabled={!isEditing}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
              </Form.Item>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter your email" />
              </Form.Item>
              {isEditing && (
                <div>
                  <Form.Item label="Profile Photo" name="photo">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setPhotoFile(e.target.files[0]);
                            setPhotoPreview(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                      {photoPreview && (
                        <img
                          src={photoPreview}
                          alt="Profile Preview"
                          style={{ width: '80px', height: '80px', borderRadius: '50%', marginTop: '10px' }}
                        />
                      )}
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        htmlType="submit"
                        loading={loading}
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        icon={<CloseOutlined />}
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </div>
              )}
            </Form>
          </Card>
        </Col>
        {/* Profile Statistics */}
        <Col xs={24} lg={12}>
          <Card title="Account Statistics">
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <Statistic
                  title="Total Transactions"
                  value={stats.totalTransactions}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Account Balance"
                  value={stats.accountBalance}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="₹"
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Monthly Income"
                  value={stats.monthlyIncome}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="₹"
                />
              </Col>
              <Col xs={12}>
                <Statistic
                  title="Monthly Expenses"
                  value={stats.monthlyExpenses}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                  suffix="₹"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        {/* Account Information */}
        <Col xs={24}>
          <Card title="Account Information">
            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
                  <Text strong>Password</Text>
                  <br />
                  <Text type="secondary">Change your password</Text>
                  <br />
                  <Button type="link" style={{ marginTop: '10px' }} onClick={() => setShowPasswordModal(true)}>
                    Change Password
                  </Button>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚙️</div>
                  <Text strong>Settings</Text>
                  <br />
                  <Text type="secondary">Manage your preferences</Text>
                  <br />
                  <Button type="link" style={{ marginTop: '10px' }} onClick={() => navigate('/settings')}>
                    Go to Settings
                  </Button>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
                  <Text strong>Reports</Text>
                  <br />
                  <Text type="secondary">View your financial reports</Text>
                  <br />
                  <Button type="link" style={{ marginTop: '10px' }} onClick={() => navigate('/reports')}>
                    View Reports
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        visible={showPasswordModal}
        onCancel={() => setShowPasswordModal(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              setLoading(true);
              // Example API call (replace with your endpoint)
              // await axios.post('/api/users/change-password', { ...values, userid: user._id });
              // For now, just update localStorage
              if (values.currentPassword !== user.password) {
                message.error('Current password is incorrect');
                setLoading(false);
                return;
              }
              if (values.newPassword !== values.confirmPassword) {
                message.error('New passwords do not match');
                setLoading(false);
                return;
              }
              const updatedUser = { ...user, password: values.newPassword };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setUser(updatedUser);
              message.success('Password changed successfully');
              passwordForm.resetFields();
              setShowPasswordModal(false);
              setLoading(false);
            } catch (error) {
              setLoading(false);
              message.error('Failed to change password');
            }
          }}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: 'Please enter new password' }, { min: 6, message: 'Password must be at least 6 characters' }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your password' }]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
