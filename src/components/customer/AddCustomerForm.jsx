import React from 'react';
import { Modal, Form, Input, Button, InputNumber } from 'antd';
import api from '../../utils/api';

const AddCustomerForm = ({ onCancel, isAddModalVisible, fetchCustomers }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/customer', values);
            onCancel(false);
            fetchCustomers();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    return (
        <Modal
            title="Add Customer"
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
                <Form.Item label="Contact Detail" name="contactDetail" rules={[{ required: true, message: 'Please enter contact detail' }]}>
                    <InputNumber style={{
                        width: '100%'
                    }} />
                </Form.Item>
                <Form.Item label="Transaction Ref" name="transactionRef" rules={[{ required: true, message: 'Please enter a transaction ref' }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Customer
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCustomerForm;
