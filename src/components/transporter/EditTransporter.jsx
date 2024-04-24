import React, { useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import api from '../../utils/api';

const EditTransporter = ({ transporter, onCancel, editModalVisible, fetchTransporters }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(transporter);
    }, [transporter, form]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/transporter/${transporter._id}`, values);
            console.log('Transporter edited:', response);
            onCancel();
            fetchTransporters();
        } catch (error) {
            console.error('Error editing transporter:', error);
        }
    };

    return (
        <Modal
            title="Edit Transporter"
            visible={editModalVisible}
            onCancel={onCancel}
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
                        Save
                    </Button>
                    <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditTransporter;
