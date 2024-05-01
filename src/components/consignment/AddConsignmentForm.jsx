import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber } from 'antd';
import api from '../../utils/api';

const AddConsignmentForm = ({
    warehouses,
    transporters,
    commodities,
    farmers,
    onCancel, isAddModalVisible, fetchConsignments }) => {

    const [form] = Form.useForm();

    const [unit, setUnit] = useState('');

    let userData = { user: { name: "", email: "", contact: "", location: "", role: "" } };
    try {
        userData = JSON.parse(localStorage.getItem('user')) || { user: { name: "", email: "", contact: "", location: "", role: "" } };
    } catch (error) {

    }
    const { role, warehouseId } = userData.user

    useEffect(() => {
        form.resetFields();

        if (role !== 'ADMIN') {
            form.setFieldsValue({
                warehouseId: warehouseId?._id || warehouseId,
            });
        }
    }, []);

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/consignment', { ...values, existingUnit: unit });
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
            const fetchedRate = data?.historicalPrices[data.historicalPrices.length - 1]?.price
            setUnit(data?.unit);
            form.setFieldsValue({
                rate: fetchedRate
            });

            if (form.getFieldValue('quantity')) {
                const amount = calculateAmount(fetchedRate, data?.unit, form.getFieldValue('quantity'), form.getFieldValue('unit'))
                form.setFieldsValue({
                    amount: amount
                });
            }

        } catch (error) {
            console.error('Error fetching Price:', error);
        }
    };

    const calculateAmount = (rate, rateUnit, incomingQuantity, incomingUnit) => {
        const tonToKg = 1000;
        const quitalToKg = 100;
        let perKgRate;
        switch (rateUnit.toLowerCase()) {
            case 'tons':
                perKgRate = rate / tonToKg;
                break;
            case 'kgs':
                perKgRate = rate;
                break;
            case 'quintals':
                perKgRate = rate / quitalToKg;
                break;
            default:
                throw new Error('Invalid rate unit');
        }

        let convertedQuantity;
        switch (incomingUnit.toLowerCase()) {
            case 'tons':
                convertedQuantity = incomingQuantity * tonToKg;
                break;
            case 'kgs':
                convertedQuantity = incomingQuantity;
                break;
            case 'quintals':
                convertedQuantity = incomingQuantity * quitalToKg;
                break;
            default:
                throw new Error('Invalid incoming unit');
        }

        const amount = perKgRate * convertedQuantity;
        return amount;
    }

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
                                {item.driverName}-{item.transportAgency}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Warehouse" name="warehouseId" rules={[{ required: true, message: 'Please enter a warehouse' }]}>
                    <Select disabled={role !== 'ADMIN'} onChange={(value) => fetchPrice(value, form.getFieldValue('commodityId'))}>
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
                <Form.Item label="Unit" name="unit" rules={[{ required: true, message: 'Please enter a unit' }]}>
                    <Select onChange={() => {
                        const amount = calculateAmount(form.getFieldValue('rate'), unit, form.getFieldValue('quantity'), form.getFieldValue('unit'))
                        form.setFieldsValue({
                            amount: amount
                        });
                    }}>
                        <Select.Option value="Kgs">Kgs</Select.Option>
                        <Select.Option value="Tons">Tons</Select.Option>
                        <Select.Option value="Quintals">Quintals</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please enter a quantity' }]}>
                    <InputNumber min={1} onChange={() => {
                        const amount = calculateAmount(form.getFieldValue('rate'), unit, form.getFieldValue('quantity'), form.getFieldValue('unit'))
                        form.setFieldsValue({
                            amount: amount
                        });
                    }} />
                </Form.Item>
                <Form.Item label={`Rate per ${unit}`} name="rate" rules={[{ required: true, message: 'Please enter a rate' }]}>
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
