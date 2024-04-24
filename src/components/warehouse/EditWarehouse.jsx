// EditWarehouse.js
import React, { useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import api from '../../utils/api';

const EditWarehouse = ({ warehouse, onCancel, editModalVisible, fetchWarehouses }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(warehouse);
    }, [warehouse, form]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/warehouse/${warehouse._id}`, values);
            console.log('Warehouse edited:', response);
            onCancel();
            fetchWarehouses();
        } catch (error) {
            console.error('Error editing warehouse:', error);
        }
    };

    return (
        <Modal
            title="Edit Warehouse"
            visible={editModalVisible}
            onCancel={onCancel}
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

export default EditWarehouse;
