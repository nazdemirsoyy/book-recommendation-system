import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { loginSuccess } from '../../store/authSlice';
import { authService } from '../../backend/authService';

interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // Call auth service to validate credentials
      const user = await authService.login(values.username, values.password);
      
      // Dispatch login success action with remember me preference
      dispatch(loginSuccess({
        user,
        rememberMe: values.remember || false
      }));

      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields');
  };

  return (
    <Form
      form={form}
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: 'Please input your username!' },
          { min: 3, message: 'Username must be at least 3 characters' }
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 4, message: 'Password must be at least 4 characters' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
          size="large"
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          style={{ width: '100%' }}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </Form.Item>

      <div style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
        <small>
          Demo: Use any username (min 3 chars) and password (min 4 chars)
        </small>
      </div>
    </Form>
  );
};

export default Login;