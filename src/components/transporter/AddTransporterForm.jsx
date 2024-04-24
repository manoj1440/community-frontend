import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import api from '../../utils/api';

const AddTransporterForm = ({ onCancel, isAddModalVisible, fetchTransporters }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/transporter', values);
            onCancel(false);
            fetchTransporters();
        } catch (error) {
            console.error('Error adding transporter:', error);
        }
    };

    return (
        <Modal
            title="Add Transporter"
            visible={isAddModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Driver Name" name="driverName" rules={[{ required: true, message: 'Please enter a driver name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Vehicle Number" name="vehicleNumber" rules={[{ required: true, message: 'Please enter a vehicle number' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Transport Agency" name="transportAgency" rules={[{ required: true, message: 'Please enter a transport agency' }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Transporter
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTransporterForm;
