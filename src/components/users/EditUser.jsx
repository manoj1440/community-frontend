import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Modal } from 'antd';
import api from '../../utils/api';

const EditUser = ({ user, onCancel, editModalVisible, fetchUsers, warehouses }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();

        const userWithWarehouseId = {
            ...user,
            warehouseId: user.warehouseId?._id || user.warehouseId,
        };

        form.setFieldsValue(userWithWarehouseId);
    }, [user, form]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/user/${user._id}`, values);
            console.log('User edited:', response);
            onCancel();
            fetchUsers();
        } catch (error) {
            console.error('Error editing user:', error);
        }
    };

    return (
        <Modal
            title="Edit User"
            open={editModalVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter an email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Contact" name="contact" rules={[{ required: true, message: 'Please enter a contact number' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select a role' }]}>
                    <Select>
                        <Select.Option value="ADMIN">Admin</Select.Option>
                        <Select.Option value="STOCK_IN">Stock In</Select.Option>
                        <Select.Option value="STOCK_OUT">Stock Out</Select.Option>
                        <Select.Option value="STOCK_IN_OUT">Stock In-Out</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Warehouse" name="warehouseId" rules={[{ required: true, message: 'Please select a Warehouse' }]}>
                    <Select>
                        {warehouses?.map((item) => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>

        </Modal >
    );
};

export default EditUser;
