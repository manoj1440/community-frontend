import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import api from '../../utils/api';

const AddCommodityForm = ({ onCancel, isAddModalVisible, fetchCommodities }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/commodity', values);
            onCancel(false);
            fetchCommodities();
        } catch (error) {
            console.error('Error adding commodity:', error);
        }
    };

    return (
        <Modal
            title="Add Commodity"
            visible={isAddModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Commodity
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCommodityForm;
