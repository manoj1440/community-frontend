import React from 'react';
import { Modal, Form, Input, Select, Button, InputNumber } from 'antd';
import api from '../../utils/api';

const AddUserForm = ({ onCancel, isAddModal, fetchUsers, warehouses }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', `/api/user`, values);
            onCancel(false);
            fetchUsers();
        } catch (error) {
            console.error('Error adding User:', error);
        }
    };

    return (
        <Modal
            title="Add User"
            open={isAddModal}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter an email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item label="Contact" name="contact">
                <InputNumber style={{
                        width: '100%'
                    }} />
                </Form.Item>
                <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role' }]}>
                    <Select>
                        <Select.Option value="ADMIN">Admin</Select.Option>
                        <Select.Option value="STOCK_IN">Stock In</Select.Option>
                        <Select.Option value="STOCK_OUT">Stock Out</Select.Option>
                        <Select.Option value="STOCK_IN_OUT">Stock In-Out</Select.Option>
                        <Select.Option value="CASH_IN">Cash In</Select.Option>
                        <Select.Option value="CASH_OUT">Cash Out</Select.Option>

                    </Select>
                </Form.Item>

                <Form.Item label="Warehouse" name="warehouseId" rules={[{ required: true, message: 'Please select a Warehouse' }]}>
                    <Select>
                        {warehouses?.map((item, index) => {
                            return (
                                <>
                                    <Select.Option value={item._id}>{item.name}</Select.Option>
                                </>
                            )
                        })}

                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add User
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddUserForm;
