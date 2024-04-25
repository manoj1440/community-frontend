import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Select, InputNumber } from 'antd';
import api from '../../utils/api';

const EditStockOut = ({
    warehouses,
    transporters,
    commodities,
    farmers,
    consignment, onCancel, editModalVisible, fetchConsignments }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();

        const editConsignmentData = {
            ...consignment,
            warehouseId: consignment.warehouseId?._id || consignment.warehouseId,
            commodityId: consignment.commodityId?._id || consignment.commodityId,
            customerId: consignment.customerId?._id || consignment.customerId,
        };

        form.setFieldsValue(editConsignmentData);
    }, [consignment, form]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/stock-out/${consignment._id}`, values);
            console.log('stock-out edited:', response);
            onCancel();
            fetchConsignments();
        } catch (error) {
            console.error('Error editing stock-out:', error);
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
            title="Edit Consignment"
            visible={editModalVisible}
            onCancel={onCancel}
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

export default EditStockOut;
