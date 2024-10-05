import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, Row, Col, message, DatePicker } from 'antd';
import api from '../../utils/api';

const AddConsignmentForm = ({ warehouses, transporters, commodities, farmers, onCancel, isAddModalVisible, fetchConsignments }) => {
    const [form] = Form.useForm();
    const [unit, setUnit] = useState('');

    let userData = { user: { name: "", email: "", contact: "", location: "", role: "" } };
    try {
        userData = JSON.parse(localStorage.getItem('user')) || { user: { name: "", email: "", contact: "", location: "", role: "" } };
    } catch (error) {
        console.log("AddConsignmentForm ~ error", error)
    }

    const onFinish = async (values) => {
        console.log("🚀 ~ onFinish ~ values:", values)
        try {
            const response = await api.request('post', '/api/consignment/create-consignment-website', { ...values });
            form.resetFields();
            onCancel(false);
            fetchConsignments();
        } catch (error) {
            console.error('Error adding consignment:', error);
        }
    };

    const fetchPrice = async (warehouseId, commodityId) => {
        if (!warehouseId || !commodityId) {
            form.setFieldsValue({ rate: null });
            return;
        }

        try {
            const response = await api.request('get', `/api/price/${warehouseId}/${commodityId}`);

            if (response.status === false) {
                message.error(response?.message || 'Failed to fetch the price.');
                return;
            }

            const fetchedRate = response?.data?.latestPrice;
            if (fetchedRate) {
                form.setFieldsValue({
                    rate: fetchedRate
                });
            } else {
                form.setFieldsValue({ rate: null });
                message.warning('No rate available for the selected warehouse and commodity.');
            }
        } catch (error) {
            console.error('Error fetching Price:', error);

            if (error.response) {
                if (error.response.status === 404) {
                    message.error('Price not found for the selected warehouse and commodity.');
                } else {
                    message.error(`${error.response.data.message || 'Something went wrong.'}`);
                }
            } else if (error.request) {
                message.error('Network error. Please check your connection and try again.');
            } else {
                message.error('An unexpected error occurred. Please try again.');
            }
            form.setFieldsValue({ rate: null });
        }
    };

    const calculateQuantityAndAmount = () => {
        const noOfBags = form.getFieldValue('noOfBags') || 0;
        const weight = form.getFieldValue('weight') || 0;
        const rate = form.getFieldValue('rate') || 0;

        const quantity = Math.floor(noOfBags * weight);
        form.setFieldsValue({ quantity });

        const amount = Number((quantity * rate).toFixed(2));
        form.setFieldsValue({ amount });

    };

    const handleWarehouseChange = (value) => {
        const commodityId = form.getFieldValue('commodityId');
        fetchPrice(value, commodityId);
    };

    const handleCommodityChange = (value) => {
        const warehouseId = form.getFieldValue('warehouseId');
        fetchPrice(warehouseId, value);
    };

    const handleNoOfBagsChange = (value) => {
        form.setFieldsValue({ noOfBags: value });
        calculateQuantityAndAmount();
    };

    const handleWeightChange = (value) => {
        form.setFieldsValue({ weight: value });
        calculateQuantityAndAmount();
    };

    return (
        <Modal
            title="Add Consignment"
            visible={isAddModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Farmer"
                            name="farmerId"
                            rules={[{ required: true, message: 'Please enter a farmer' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Farmer"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {farmers?.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Transporter" name="transporterId" rules={[{ required: true, message: 'Please enter a transporter' }]}>
                            <Select
                                showSearch
                                placeholder="Transporter"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {transporters?.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.driverName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Warehouse" name="warehouseId" rules={[{ required: true, message: 'Please enter a warehouse' }]}>
                            <Select onChange={handleWarehouseChange}>
                                {warehouses?.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Commodity" name="commodityId" rules={[{ required: true, message: 'Please enter a commodity' }]}>
                            <Select onChange={handleCommodityChange}>
                                {commodities?.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="No of Bags" name="noOfBags" rules={[{ required: true, message: 'Please enter No of Bags' }]}>
                            <InputNumber min={1} onChange={handleNoOfBagsChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Weight (Each Bag)" name="weight" rules={[{ required: true, message: 'Please enter Weight of each bag' }]}>
                            <InputNumber min={1} onChange={handleWeightChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please enter Quantity' }]}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label={`Rate`} name="rate" rules={[{ required: true, message: 'Please enter a rate' }]}>
                    <Input disabled />
                </Form.Item>

                <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter an amount' }]}>
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please select a date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
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
