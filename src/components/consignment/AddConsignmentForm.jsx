import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber } from 'antd';
import api from '../../utils/api';

const AddConsignmentForm = ({
    warehouses,
    transporters,
    commodities,
    farmers,
    onCancel, isAddModalVisible, fetchConsignments }) => {

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/consignment', values);
            onCancel(false);
            fetchConsignments();
        } catch (error) {
            console.error('Error adding consignment:', error);
        }
    };

    const fetchPrice = async (warehouseId, commodityId) => {
        try {
            const response = await api.request('get', `/api/price/${warehouseId}/${commodityId}`);
            const { data } = response;
            const rate = data?.historicalPrices[data.historicalPrices.length - 1]?.price

            form.setFieldsValue({
                rate: rate
            });

            if (form.getFieldValue('quantity')) {
                form.setFieldsValue({
                    amount: rate * form.getFieldValue('quantity')
                });
            }

        } catch (error) {
            console.error('Error fetching Price:', error);
        }
    };

    return (
        <Modal
            title="Add Consignment"
            visible={isAddModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Farmer" name="farmerId" rules={[{ required: true, message: 'Please enter a farmer' }]}>
                    <Select>
                        {farmers?.map((item) => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Transporter" name="transporterId" rules={[{ required: true, message: 'Please enter a transporter' }]}>
                    <Select>
                        {transporters?.map((item) => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.transportAgency}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Warehouse" name="warehouseId" rules={[{ required: true, message: 'Please enter a warehouse' }]}>
                    <Select onChange={(value) => fetchPrice(value, form.getFieldValue('commodityId'))}>
                        {warehouses?.map((item) => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Commodity" name="commodityId" rules={[{ required: true, message: 'Please enter a commodity' }]}>
                    <Select onChange={(value) => fetchPrice(form.getFieldValue('warehouseId'), value)}>
                        {commodities?.map((item) => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please enter a quantity' }]}>
                    <InputNumber min={1} onChange={() => {
                        form.setFieldsValue({
                            amount: form.getFieldValue('rate') * form.getFieldValue('quantity')
                        });
                    }} />
                </Form.Item>
                <Form.Item label="Rate" name="rate" rules={[{ required: true, message: 'Please enter a rate' }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter an amount' }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Consignment
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddConsignmentForm;
