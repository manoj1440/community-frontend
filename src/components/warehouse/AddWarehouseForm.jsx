// AddWarehouseForm.js
import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import api from '../../utils/api';

const AddWarehouseForm = ({ onCancel, isAddModalVisible, fetchWarehouses }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/warehouse', values);
            onCancel(false);
            fetchWarehouses();
        } catch (error) {
            console.error('Error adding warehouse:', error);
        }
    };

    return (
        <Modal
            title="Add Warehouse"
            visible={isAddModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter an address' }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Warehouse
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddWarehouseForm;
