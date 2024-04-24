import React, { useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import api from '../../utils/api';

const EditFarmer = ({ farmer, onCancel, editModalVisible, fetchFarmers }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(farmer);
    }, [farmer, form]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/farmer/${farmer._id}`, values);
            console.log('Farmer edited:', response);
            onCancel();
            fetchFarmers();
        } catch (error) {
            console.error('Error editing farmer:', error);
        }
    };

    return (
        <Modal
            title="Edit Farmer"
            visible={editModalVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Contact No" name="contactNo" rules={[{ required: true, message: 'Please enter a contact number' }]}>
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

export default EditFarmer;
