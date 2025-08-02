import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Divider,
  message,
  Space,
  Typography,
  Row,
  Col,
  Select,
  notification
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  BgColorsOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import Spinner from '../components/Spinner';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoBackup: true,
    currency: 'INR',
    language: 'English',
    timezone: 'Asia/Kolkata'
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      profileForm.setFieldsValue({
        name: userData.name,
        email: userData.email
      });
    }
  }, [profileForm]);

  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);

      // Validate current password (in real app, this would be an API call)
      if (values.currentPassword !== user?.password) {
        message.error('Current password is incorrect');
        setLoading(false);
        return;
      }

      if (values.newPassword !== values.confirmPassword) {
        message.error('New passwords do not match');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user in localStorage (in real app, this would update the database)
      const updatedUser = { ...user, password: values.newPassword };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      message.success('Password changed successfully');
      passwordForm.resetFields();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to change password');
    }
  };

  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user in localStorage
      const updatedUser = { ...user, ...values };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      message.success('Profile updated successfully');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to update profile');
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    notification.success({
      message: 'Setting Updated',
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been updated.`,
      placement: 'topRight',
    });
  };

  const handleResetSettings = () => {
    setSettings({
      emailNotifications: true,
      pushNotifications: false,
      autoBackup: true,
      currency: 'INR',
      language: 'English',
      timezone: 'Asia/Kolkata'
    });
    message.success('Settings reset to default');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {loading && <Spinner />}

      <Title level={2} style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <SettingOutlined />
        Settings
      </Title>

      <Row gutter={[24, 24]}>

        {/* Profile Settings */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                Profile Settings
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileUpdate}
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
                <Input prefix={<UserOutlined />} placeholder="Enter your email" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  block
                >
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Password Settings */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LockOutlined />
                Password Settings
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter current password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter new password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm new password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LockOutlined />}
                  loading={loading}
                  block
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        

        {/* Reset Settings */}
        <Col xs={24}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleResetSettings}
                danger
              >
                Reset All Settings to Default
              </Button>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                This will reset all your settings to their default values
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings; 