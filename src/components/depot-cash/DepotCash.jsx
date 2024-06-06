import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Select, Input, Form, DatePicker } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';
import { readableDate } from '../../utils/config';
import moment from 'moment';

const { Option } = Select;

const DepotCash = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [depotCashEntries, setDepotCashEntries] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedWarehouseTransactions, setSelectedWarehouseTransactions] = useState([]);
    const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
    const [isEditTransactionModalVisible, setIsEditTransactionModelVisible] = useState(false);
    const [editTransactionData, setEditTransactionData] = useState(null)

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [form] = Form.useForm();
    const [selectedDateRange, setSelectedDateRange] = useState(null);

    useEffect(() => {
        fetchWarehouses();
        fetchDepotCashEntries();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const response = await api.request('get', '/api/warehouse');
            const { data } = response;
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchDepotCashEntries = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/depot-cash');
            setDepotCashEntries(response);
            setPagination({
                current: page,
                pageSize,
                total: response.length,
            });
        } catch (error) {
            console.error('Error fetching depot cash entries:', error);
        }
    };

    console.log('LOG', depotCashEntries);

    const handleAddModalOpen = () => {
        setIsAddModalVisible(true);
    };

    const handleAddModalClose = () => {
        setIsAddModalVisible(false);
        form.resetFields();
    };

    const handleAddDepotCash = async (values) => {
        try {
            const response = await api.request('post', '/api/depot-cash', values);
            handleAddModalClose();
            fetchDepotCashEntries();
        } catch (error) {
            console.error('Error adding depot cash:', error);
        }
    };

    const handleViewTransactions = (warehouseId) => {
        const selectedWarehouse = depotCashEntries.find(entry => entry.warehouseId === warehouseId);
        setSelectedWarehouseTransactions(selectedWarehouse.transactions);
        setIsTransactionModalVisible(true);
    };

    const handleEditTransaction = (record) => {
        setEditTransactionData(record);
        setIsEditTransactionModelVisible(true);
    };

    useEffect(() => {
        if (isEditTransactionModalVisible) {
            form.setFieldsValue(editTransactionData);
        }
    }, [isEditTransactionModalVisible, editTransactionData]);

    const handleEditTransactionSubmit = async (values) => {
        try {
            const response = await api.request('put', `/api/depot-cash/${editTransactionData._id}`, values);
            console.log('LOG', response)
            // setIsEditTransactionModelVisible(false);
            // fetchDepotCashEntries();
        } catch (error) {
            console.error('Error editing transaction:', error);
        }
    };

    const columns = [
        {
            title: 'Warehouse',
            dataIndex: ['warehouses', 0, 'name'],
            key: 'warehouseId',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'dateId',
            render: (date) => date ? readableDate(date) : 'NA'
        },
        {
            title: 'Opening Balance',
            dataIndex: 'openingAmount',
            key: 'openingBalanceId',
        },
        {
            title: 'Closing Balance',
            dataIndex: 'closingAmount',
            key: 'closingBalanceId',
        },
        {
            title: 'Actions',
            dataIndex: 'warehouseId',
            key: 'actions',
            render: (warehouseId) => (
                <Button onClick={() => handleViewTransactions(warehouseId)} type="primary">
                    Transactions
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Button
                style={{ marginBottom: 10, marginRight: 30 }}
                onClick={handleAddModalOpen}
                type="primary"
            >
                Add Depot Cash
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Consignments"
                data={depotCashEntries}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />

            <Modal
                title="Add Depot Cash"
                visible={isAddModalVisible}
                onCancel={handleAddModalClose}
                footer={null}
                width={600}
            >
                <Form form={form} onFinish={handleAddDepotCash} layout="vertical">
                    <Form.Item
                        name="warehouseId"
                        label="Warehouse"
                        rules={[{ required: true, message: 'Please select a warehouse!' }]}
                    >
                        <Select placeholder="Select Warehouse">
                            {warehouses.map(warehouse => (
                                <Option key={warehouse._id} value={warehouse._id}>
                                    {warehouse.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter the amount!' }]}
                    >
                        <Input type="number" placeholder="Enter Amount" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                        <Button onClick={handleAddModalClose} style={{ marginLeft: 10 }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Warehouse Transactions"
                visible={isEditTransactionModalVisible}
                onCancel={() => setIsEditTransactionModelVisible(false)}
                footer={null}
                width={600}
            >
                {editTransactionData && (
                    <Form form={form} onFinish={handleEditTransactionSubmit} layout="vertical" initialValues={editTransactionData}>

                        <Form.Item
                            name="amount"
                            label="Amount"
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                            <Button onClick={() => setIsEditTransactionModelVisible(false)} style={{ marginLeft: 10 }}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            <Modal
                title="Warehouse Transactions"
                visible={isTransactionModalVisible}
                onCancel={() => setIsTransactionModalVisible(false)}
                footer={null}
                width={800}
            >
                <DatePicker.RangePicker
                    style={{ marginLeft: 8 }}
                    onChange={(dates) => setSelectedDateRange(dates)}
                    value={selectedDateRange}
                />
                <Table
                    dataSource={selectedWarehouseTransactions
                        .filter(transaction => {
                            if (!selectedDateRange) return true;
                            const transactionDate = moment(transaction.date);
                            return transactionDate.isBetween(selectedDateRange[0], selectedDateRange[1], null, '[]');
                        })
                        .sort((a, b) => new Date(b.date) - new Date(a.date))}
                    columns={[
                        {
                            title: 'Entity',
                            dataIndex: 'entity',
                            key: 'entity',
                            render: (entity) => entity ? entity.name : 'NA'
                        },
                        { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => date ? readableDate(date) : 'NA' },
                        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
                        { title: 'Type', dataIndex: 'type', key: 'type' },
                        // {
                        //     title: 'Actions',
                        //     dataIndex: '_id',
                        //     key: 'actions',
                        //     render: (_, record, index) => {
                        //         const isLastTransaction = index === 0; 
                        //         if (isLastTransaction) {
                        //             if (record.entityType === 'User') {
                        //                 return (
                        //                     <Button onClick={() => handleEditTransaction(record)} type="primary">
                        //                         Edit
                        //                     </Button>
                        //                 );
                        //             } else if (record.entityType === 'Farmer' || record.entityType === 'Customer') {
                        //                 return (
                        //                     <Button onClick={() => handleRevertTransaction(record)} type="danger">
                        //                         Revert
                        //                     </Button>
                        //                 );
                        //             }
                        //         }
                        //         return null;
                        //     },
                        // },
                    ]}
                    pagination={true}
                />
            </Modal>



        </div>
    );
};

export default DepotCash;
