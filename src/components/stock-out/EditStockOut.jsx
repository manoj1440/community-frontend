import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';

const EditStockOutModal = ({ visible, onCancel, onOk, initialValues }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = async () => {
        setConfirmLoading(true);
        try {
            const values = await form.validateFields();
            onOk({ ...values });
        } catch (err) {
            console.error('Form validation error:', err);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            title="Edit Stock Out"
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
        >
            <Form form={form} initialValues={initialValues} layout="vertical">
                <Form.Item
                    name="totalQuantity"
                    label="Total Quantity"
                >
                    <InputNumber min={0} disabled />
                </Form.Item>

                <Form.Item
                    name="rate"
                    label="Rate Per Commodity"
                    rules={[{ required: true, message: 'Please enter the rate per commodity' }]}
                >
                    <InputNumber min={0} step={0.01} onChange={() => {
                        form.setFieldsValue({
                            amount: form.getFieldValue('rate') * form.getFieldValue('totalQuantity'),
                            receivedAmount: form.getFieldValue('rate') * form.getFieldValue('totalReceivedQuantity'),
                        });
                    }} />
                </Form.Item>

                <Form.Item name="amount" label="Total Expected Amount">
                    <InputNumber disabled />
                </Form.Item>

                <Form.Item
                    name="totalReceivedQuantity"
                    label="Total Received Quantity"
                >
                    <InputNumber min={0} max={initialValues?.totalQuantity} onChange={() => {
                        form.setFieldsValue({
                            receivedAmount: form.getFieldValue('rate') * form.getFieldValue('totalReceivedQuantity')
                        });
                    }} />
                </Form.Item>

                <Form.Item name="receivedAmount" label="Total Received Amount">
                    <InputNumber disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditStockOutModal;