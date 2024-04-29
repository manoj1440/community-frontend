import React from 'react';
import { Modal, Form, Input, Button, Select, InputNumber } from 'antd';
import api from '../../utils/api';

const AddPriceForm = ({ warehouses, commodities, onCancel, isAddModalVisible, fetchPrices }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/price', values);
            onCancel(false);
            fetchPrices();
        } catch (error) {
            console.error('Error adding price:', error);
        }
    };

    return (
        <Modal
            title="Add Price"
            visible={isAddModalVisible}
            onCancel={() => onCancel(false)}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Commodity" name="commodityId" rules={[{ required: true, message: 'Please select a Commodity' }]}>
                    <Select>
                        {commodities?.map((item, index) => {
                            return (
                                <>
                                    <Select.Option value={item._id}>{item.name}</Select.Option>
                                </>
                            )
                        })}
                    </Select>
                </Form.Item>

                <Form.Item label="Warehouse" name="warehouseId" rules={[{ required: true, message: 'Please select a Warehouse' }]}>
                    <Select>
                        {warehouses?.map((item, index) => {
                            return (
                                <>
                                    <Select.Option value={item._id}>{item.name}</Select.Option>
                                </>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter a price' }]}>
                    <InputNumber min={0} type="number" />
                </Form.Item>
                <Form.Item label="Unit" name="unit" rules={[{ required: true, message: 'Please select a role' }]}>
                    <Select>
                        <Select.Option value="Kgs">Kgs</Select.Option>
                        <Select.Option value="Tons">Tons</Select.Option>
                        <Select.Option value="Quitals">Quitals</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Price
                    </Button>
                    <Button onClick={() => onCancel(false)} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddPriceForm;
