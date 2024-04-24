import React, { useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import api from '../../utils/api';

const EditCustomer = ({ customer, onCancel, editModalVisible, fetchCustomers }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(customer);
    }, [customer, form]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/customer/${customer._id}`, values);
            console.log('Customer edited:', response);
            onCancel();
            fetchCustomers();
        } catch (error) {
            console.error('Error editing customer:', error);
        }
    };

    return (
        <Modal
            title="Edit Customer"
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
                <Form.Item label="Contact Detail" name="contactDetail" rules={[{ required: true, message: 'Please enter contact detail' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Transaction Ref" name="transactionRef" rules={[{ required: true, message: 'Please enter a transaction ref' }]}>
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

export default EditCustomer;
