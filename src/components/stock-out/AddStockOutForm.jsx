import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber } from 'antd';
import api from '../../utils/api';

const conversionFactors = {
    Tons: 1000,
    Kgs: 1,
    Quintals: 100
};

const AddStockOutForm = ({
    warehouses,
    commodities,
    customers,
    onCancel, isAddModalVisible, fetchConsignments }) => {

    const [form] = Form.useForm();
    const [maxQunatity, setMaxQunatity] = useState(0);
    const [initialQunatity, setInitialQunatity] = useState(0);

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
    }, [role, warehouseId]);

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/stock-out', values);
            onCancel(false);
            form.resetFields();
            fetchConsignments();
        } catch (error) {
            console.error('Error adding stock-out:', error);
        }
    };

    const fetchQuantity = async (warehouseId, commodityId) => {
        try {
            const response = await api.request('get', `/api/stock-in/quantity/${warehouseId}/${commodityId}`);
            const { data } = response;

            setMaxQunatity(data.quantity);
            setInitialQunatity(data.quantity);
            form.setFieldsValue({
                quantity: data.quantity,
                unit: 'Kgs'
            });

            if (form.getFieldValue('sellingPrice')) {

                const calcAmount = data.quantity * form.getFieldValue('sellingPrice')
                if (!Number.isNaN(calcAmount)) {
                    form.setFieldsValue({
                        amount: calcAmount
                    });
                }
            }

        } catch (error) {
            setMaxQunatity(0);
            setInitialQunatity(0);
            form.setFieldsValue({
                quantity: 0,
                unit: 'Kgs',
                amount: ''
            });
            console.error('Error fetching Quantity:', error);
        }
    };

    return (
        <Modal
            title="Add Stock Out"
            visible={isAddModalVisible}
            onCancel={() => {
                form.resetFields();
                onCancel(false)
            }}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Customer" name="customerId" rules={[{ required: true, message: 'Please enter a customer' }]}>
                    <Select>
                        {customers?.map((item) => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Warehouse" name="warehouseId" rules={[{ required: true, message: 'Please enter a warehouse' }]}>
                    <Select disabled={role !== 'ADMIN'} onChange={(value) => fetchQuantity(value, form.getFieldValue('commodityId'))}>
                        {warehouses?.map((item) => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Commodity" name="commodityId" rules={[{ required: true, message: 'Please enter a commodity' }]}>
                    <Select onChange={(value) => fetchQuantity(form.getFieldValue('warehouseId'), value)}>
                        {commodities?.map((item) => (
                            <Select.Option key={item._id} value={item._id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
                    <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please enter a quantity' }]}>
                        <InputNumber min={1} max={maxQunatity} onChange={() => {
                            form.setFieldsValue({
                                amount: form.getFieldValue('sellingPrice') * form.getFieldValue('quantity')
                            });
                        }} />
                    </Form.Item>
                    <Form.Item label="Unit" name="unit" rules={[{ required: true, message: 'Please enter a unit' }]}>
                        <Select onChange={() => {
                            const formQuantity = initialQunatity / conversionFactors[form.getFieldValue('unit')];
                            setMaxQunatity(formQuantity);
                            form.setFieldsValue({
                                quantity: formQuantity
                            });

                            if (form.getFieldValue('sellingPrice')) {
                                form.setFieldsValue({
                                    amount: formQuantity * form.getFieldValue('sellingPrice')
                                });
                            }
                        }}>
                            <Select.Option value="Kgs">Kgs</Select.Option>
                            <Select.Option value="Tons">Tons</Select.Option>
                            <Select.Option value="Quintals">Quintals</Select.Option>
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item label="Selling Price" name="sellingPrice" rules={[{ required: true, message: 'Please enter a selling price' }]}>
                    <InputNumber onChange={() => {
                        form.setFieldsValue({
                            amount: form.getFieldValue('sellingPrice') * form.getFieldValue('quantity')
                        });
                    }} />
                </Form.Item>
                <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter an amount' }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={(form.getFieldValue('quantity') > maxQunatity) || (!initialQunatity || initialQunatity <= 0)}>
                        Add Stock Out
                    </Button>
                    <Button onClick={() => {
                        form.resetFields();
                        onCancel(false)
                    }} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddStockOutForm;
