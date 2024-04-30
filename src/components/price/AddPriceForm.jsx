import React from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, message } from 'antd';
import api from '../../utils/api';

const AddPriceForm = ({ warehouses, commodities, onCancel, isAddModalVisible, fetchPrices }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        try {
            const response = await api.request('post', '/api/price', values);
            onCancel(false);
            fetchPrices();
        } catch (error) {
            if (error?.response?.data?.message) {
                messageApi.open({
                    type: 'error',
                    duration: 2,
                    content: error?.response?.data?.message,
                });
            }
            console.error('Error adding price:', error);
        }
    };

    return (
        <>
            {contextHolder}
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
                            <Select.Option value="Quintals">Quintals</Select.Option>
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
        </>
    );
};

export default AddPriceForm;
