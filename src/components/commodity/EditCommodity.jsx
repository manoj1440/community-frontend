import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import api from '../../utils/api';

const EditCommodity = ({ commodity, onCancel, editModalVisible, fetchCommodities }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(commodity);
    }, [commodity, form]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/commodity/${commodity._id}`, values);
            console.log('Commodity edited:', response);
            onCancel();
            fetchCommodities();
        } catch (error) {
            console.error('Error editing commodity:', error);
        }
    };

    return (
        <Modal
            title="Edit Commodity"
            visible={editModalVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
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

export default EditCommodity;
