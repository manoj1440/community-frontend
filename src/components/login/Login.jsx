
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/api";
import { Button, Card, Form, Input, message } from "antd";
import Title from "antd/es/typography/Title";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import './Login.css';
import logo from '../../assets/logo.png';
import loginbg from '../../assets/loginbg.png';


const Login = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLogin = (values) => {
        if (!values.email || !values.password) {
            message.error("Please fill in both email and password.");
            return;
        }
        api.request('post', '/api/login', values)
            .then((response) => {
                if (!response.status) {
                    message.error(response.message);
                }
                if (response.status) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    navigate("/dashboard");
                    form.resetFields();
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="login-page">

            <div className="login-card">
                <div className="login-left">
                    <div>Welcome back !</div>
                    <img
                        style={{
                            height: '22rem',
                            width: '21rem'
                        }}
                        className="login"
                        alt="Login"
                        src={loginbg}
                    />
                </div>
                <div className="login-right">
                    <Card >
                        <div className="logo">
                            <img src={logo} alt="Logo" />
                        </div>
                        {/* <Title level={3}>Login Now !</Title> */}

                        <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={handleLogin}>
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' }
                                ]}
                            >
                                <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input size="large"
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
