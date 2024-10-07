import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Select, Input, Form, DatePicker, notification, Row, Col } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';
import { readableDate } from '../../utils/config';
import moment from 'moment';
import { FolderOpenTwoTone } from '@ant-design/icons';
import ExcelExport from './TransactionExcelExport';


const { Option } = Select;

const DepotCash = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [depotCashEntries, setDepotCashEntries] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedWarehouseTransactions, setSelectedWarehouseTransactions] = useState([]);
    const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
    const [isEditTransactionModalVisible, setIsEditTransactionModelVisible] = useState(false);
    const [editTransactionData, setEditTransactionData] = useState(null)
    const [overview, setOverview] = useState({
        totalTransactions: 0,
        totalCredits: 0,
        totalDebits: 0,
        netBalance: 0,
        averageTransactionAmount: 0,
        largestCreditTransaction: 0,
        largestDebitTransaction: 0,
        totalCreditsByEntityType: {},
        totalDebitsByEntityType: {},
        roundedTotalDebits: 0,
        roundedTotalCredits: 0
    });
    const [originalTransactions, setOriginalTransactions] = useState([])


    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [transactionPagination, setTransactionPagination] = useState({
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
            const response = await api.request('get', `/api/depot-cash?page=${page}&limit=${pageSize}`);

            setDepotCashEntries(response.entries);

        } catch (error) {
            console.error('Error fetching depot cash entries:', error);
        }
    };

    const fetchTransactionsByWarehouseId = async (warehouseId, page = transactionPagination.current, pageSize = transactionPagination.pageSize) => {
        try {
            const response = await api.request('get', `/api/depot-cash/${warehouseId}/transactions?page=${page}&limit=${pageSize}`);

            setSelectedWarehouseTransactions(response.entries);
            setTransactionPagination((prev) => ({
                ...prev,
                total: response.total,
            }));
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };


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

    const normalizeDate = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    const handleViewTransactions = (warehouseId) => {
        const selectedWarehouse = depotCashEntries.find(entry => entry.warehouseId === warehouseId._id);

        fetchTransactionsByWarehouseId(warehouseId._id);
        setIsTransactionModalVisible(true);
    };


    useEffect(() => {
        if (isTransactionModalVisible) {
            const filteredTransactions = originalTransactions.filter(transaction => {
                const transactionDate = normalizeDate(transaction.date);
                if (selectedDateRange) {
                    const [start, end] = selectedDateRange.map(date => normalizeDate(date));
                    return transactionDate >= start && transactionDate <= end;
                }
                return true;
            });
            setSelectedWarehouseTransactions(filteredTransactions);
            const overviewData = calculateOverview(filteredTransactions);
            setOverview(overviewData);
        }
    }, [selectedDateRange, isTransactionModalVisible, originalTransactions]);




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

            setIsEditTransactionModelVisible(false);
            setIsTransactionModalVisible(false);
            fetchDepotCashEntries();
            notification.success({ message: 'Transaction edited successfully' });
        } catch (error) {
            console.error('Error editing transaction:', error);
        }
    };

    const handleRevertTransaction = async (record) => {
        try {
            await api.request('post', `/api/depot-cash/revert/${record._id}`, record);
            setIsTransactionModalVisible(false);
            fetchDepotCashEntries();
            notification.success({ message: 'Transaction reverted successfully' });
        } catch (error) {
            console.error('Error reverting transaction:', error);
            notification.error({ message: 'Failed to revert transaction' });
        }
    };


    const columns = [
        {
            title: 'Warehouse',
            dataIndex: ['warehouseId', 'name'],
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
            render: (text) => parseFloat(text).toFixed(2),
        },
        {
            title: 'Closing Balance',
            dataIndex: 'closingAmount',
            key: 'closingBalanceId',
            render: (text) => parseFloat(text).toFixed(2),
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

    const calculateOverview = (transactions) => {
        const totalTransactions = transactions.length;
        const totalCredits = transactions.reduce((sum, transaction) => transaction.type === 'Credit' ? sum + transaction.amount : sum, 0);
        const totalDebits = transactions.reduce((sum, transaction) => transaction.type === 'Debit' ? sum + transaction.amount : sum, 0);
        const netBalance = totalCredits - totalDebits;
        const averageTransactionAmount = transactions.length ? transactions.reduce((sum, transaction) => sum + transaction.amount, 0) / transactions.length : 0;
        const largestCreditTransaction = transactions.filter(t => t.type === 'Credit').reduce((max, t) => t.amount > max ? t.amount : max, 0);
        const largestDebitTransaction = transactions.filter(t => t.type === 'Debit').reduce((max, t) => t.amount > max ? t.amount : max, 0);
        const roundedTotalCredits = totalCredits.toFixed(2);
        const roundedTotalDebits = totalDebits.toFixed(2);

        const totalCreditsByEntityType = transactions.reduce((acc, transaction) => {
            if (transaction.type === 'Credit') {
                acc[transaction.entityType] = (acc[transaction.entityType] || 0) + transaction.amount;
            }
            return acc;
        }, {});

        const totalDebitsByEntityType = transactions.reduce((acc, transaction) => {
            if (transaction.type === 'Debit') {
                acc[transaction.entityType] = (acc[transaction.entityType] || 0) + transaction.amount;
            }
            return acc;
        }, {});

        return {
            totalTransactions,
            totalCredits,
            totalDebits,
            netBalance,
            averageTransactionAmount,
            largestCreditTransaction,
            largestDebitTransaction,
            totalCreditsByEntityType,
            totalDebitsByEntityType,
            roundedTotalCredits,
            roundedTotalDebits
        };
    };


    const overviewStyle = {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '14px',
        color: 'red'
    }

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

                <ExcelExport
                    data={selectedWarehouseTransactions}
                    warehouses={warehouses}
                />

                <div style={{ marginBottom: 20, marginTop: 20 }}>

                    {/* <Row gutter={16}>
                        <Col span={8} style={overviewStyle}>Total Transactions: {overview.totalTransactions}</Col>
                        <Col span={8} style={overviewStyle}>Total Credits: {overview.roundedTotalCredits}</Col>
                        <Col span={8} style={overviewStyle}>Total Debits: {overview.roundedTotalDebits}</Col>
                    </Row> */}
                </div>

                <Table
                    dataSource={selectedWarehouseTransactions
                        .sort((a, b) => new Date(b.date) - new Date(a.date))}

                    columns={[
                        {
                            title: 'Entity',
                            dataIndex: ['entityId', 'name'],
                            key: 'entityId',
                        },
                        {
                            title: 'Date',
                            dataIndex: 'date',
                            key: 'date',
                            render: (date) => date ? readableDate(date) : 'NA'
                        },
                        {
                            title: 'Amount',
                            dataIndex: 'amount',
                            key: 'amount'
                        },
                        {
                            title: 'Type',
                            dataIndex: 'type',
                            key: 'type'
                        },
                        {
                            title: 'Actions',
                            dataIndex: '_id',
                            key: 'actions',
                            render: (_, record, index) => {
                                const buttonStyle = {
                                    width: '100px',
                                    textAlign: 'center'
                                };
                                if (record.entityType === 'User') {
                                    if (index === 0) {
                                        return (
                                            <Button onClick={() => handleEditTransaction(record)} type="primary" style={buttonStyle}>
                                                Edit
                                            </Button>
                                        );
                                    } else {
                                        return (
                                            <Button onClick={() => handleEditTransaction(record)} type="primary" disabled style={buttonStyle}>
                                                Edit
                                            </Button>
                                        );
                                    }
                                } else if (record.entityType === 'Farmer' || record.entityType === 'Customer') {
                                    if (record.originalTransactionId) {
                                        return null;
                                    }
                                    return (
                                        <Button
                                            onClick={() => handleRevertTransaction(record)}
                                            type={record.reverted === true ? 'primary' : 'danger'}
                                            disabled={record.reverted === true}
                                            style={buttonStyle}
                                        >
                                            {record.reverted ? 'Reverted' : 'Revert'}
                                        </Button>
                                    );
                                }
                                return null;
                            },
                        }
                    ]}


                    pagination={{
                        current: transactionPagination.current,
                        pageSize: transactionPagination.pageSize,
                        total: transactionPagination.total,
                        onChange: (page, pageSize) => {
                            setTransactionPagination({ ...transactionPagination, current: page, pageSize });
                            fetchTransactionsByWarehouseId(selectedWarehouseTransactions[0]?.warehouseId, page, pageSize); 
                        },
                    }}
                />
            </Modal>



        </div>
    );
};


export default DepotCash;
