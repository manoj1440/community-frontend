import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Select } from 'antd';
import api from '../../utils/api';

const EditPrice = ({ warehouses, commodities, price, onCancel, editModalVisible, fetchPrices }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();

        const { historicalPrices } = price;

        const priceEditData = {
            ...price,
            warehouseId: price.warehouseId?._id || price.warehouseId,
            commodityId: price.commodityId?._id || price.commodityId,
            price: historicalPrices?.length > 0 ? historicalPrices[historicalPrices.length - 1].price : 'N/A'
        };

        form.setFieldsValue(priceEditData);
    }, [price, form]);
    const onFinish = async (values) => {
        try {
            const response = await api.request('put', `/api/price/${price._id}`, values);
            console.log('Price edited:', response);
            onCancel();
            fetchPrices();
        } catch (error) {
            console.error('Error editing price:', error);
        }
    };

    return (
        <Modal
            title="Edit Price"
            visible={editModalVisible}
            onCancel={onCancel}
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
                    <Input type="number" />
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

export default EditPrice;
