import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import type { FormProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { loginSuccess } from '../store/authSlice';
import { authService } from '../backend/authService';

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    setLoading(true);
    
    try {
      // Call auth service to validate credentials
      if (values.username && values.password) {
        const user = await authService.login(values.username, values.password);
        
        // Dispatch login success action with remember me preference
        dispatch(loginSuccess({
          user,
          rememberMe: values.remember || false
        }));

        message.success('Login successful!');
        console.log("User logged in: ",user.username);
        navigate('/dashboard');
      }
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields');
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 , margin: '30vh auto',  width: '100%',  transform: 'translateY(-50%)' }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >

    <h1 style={{textAlign:'center'}}>Login</h1>

      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[
          { required: true, message: 'Please input your username!' },
          { min: 3, message: 'Username must be at least 3 characters' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 4, message: 'Password must be at least 4 characters' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {loading ? 'Logging in...' : 'Submit'}
        </Button>
      </Form.Item>

    </Form>
  );
};

export default LoginForm;