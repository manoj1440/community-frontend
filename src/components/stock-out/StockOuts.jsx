import React, { useState, useEffect } from 'react';
import { Modal, Space, Button, Table, Tag, Select, DatePicker } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';
import { CloseCircleOutlined } from '@ant-design/icons';
import EditStockOut from './EditStockOut';

const { Option } = Select;

const StockOuts = () => {
    const [consignments, setConsignments] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedCommodityBags, setSelectedCommodityBags] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingConsignment, setEditingConsignment] = useState(null);

    useEffect(() => {
        fetchCustomers();
        fetchWarehouses();
        fetchConsignments(pagination.current, pagination.pageSize);
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.request('get', '/api/customer');
            const { data } = response;
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await api.request('get', '/api/warehouse');
            const { data } = response;
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };


    const fetchConsignments = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/stock-out');
            const { data } = response;
            setConsignments(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching stock-out:', error);
        }
    };

    const handleDeleteConsignment = (consignmentId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this stock-out?',
            onOk: async () => {
                try {
                    console.log(`Deleting stock-out with ID: ${consignmentId}`);
                    await api.request('delete', `/api/stock-out/${consignmentId}`);
                    fetchConsignments(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting stock-out:', error);
                }
            },
        });
    };

    const clearFilters = () => {
        setSelectedCustomer(null);
        setSelectedWarehouse(null);
    }

    const bagColumns = [
        {
            title: 'No. of Bags',
            dataIndex: 'noOfBags',
            key: 'noOfBags',
        },
        {
            title: 'Weight (Each Bag)',
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
    ];

    const columns = [
        {
            title: 'Customer',
            dataIndex: ['customerId', 'name'],
            key: 'customerId',
        },
        {
            title: 'Warehouse',
            dataIndex: ['warehouseId', 'name'],
            key: 'warehouseId',
        },
        {
            title: 'Commodities',
            dataIndex: 'commodity',
            key: 'commodity',
            render: (_, record) => (
                <Tag
                    color="geekblue"
                    style={{ marginBottom: 4, cursor: 'pointer' }}
                    onClick={() => setSelectedCommodityBags(record.bags)}
                >
                    {record.commodityId.name}
                </Tag>
            ),
        },
        {
            title: 'Total Quantity',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
        },
        {
            title: 'Rate Per Commodity',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: 'Total Expected Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Total Received Quantity',
            dataIndex: 'totalReceivedQuantity',
            key: 'totalReceivedQuantity',
        },
        {
            title: 'Total Received Amount',
            dataIndex: 'receivedAmount',
            key: 'receivedAmount',
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEditConsignment(record)}>Edit</Button>
                    <Button disabled={record.received.toLowerCase() === 'yes'} onClick={() => handleDeleteConsignment(record._id)} type="danger">
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleEditConsignment = (consignment) => {
        setEditingConsignment(consignment);
        setShowEditModal(true);
    };

    const handleEditOk = async (values) => {
        try {
            // Update the consignment with the new values
            await api.request('put', `/api/stock-out/${editingConsignment._id}`, values);
            setShowEditModal(false);
            setEditingConsignment(null);
            fetchConsignments(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error('Error updating stock-out:', error);
        }
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
        setEditingConsignment(null);
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Select
                    showSearch
                    placeholder="Select Customer"
                    style={{ width: 200, marginRight: 8 }}
                    onChange={(value) => setSelectedCustomer(value)}
                    filterOption={(inputValue, option) =>
                        option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                    }
                    value={selectedCustomer}
                >
                    {customers.map(customer => (
                        <Option key={customer._id} value={customer._id}>{customer.name}</Option>
                    ))}
                </Select>

                <Select
                    placeholder="Select Warehouse"
                    style={{ width: 200 }}
                    onChange={(value) => setSelectedWarehouse(value)}
                    value={selectedWarehouse}
                >
                    {warehouses.map(warehouse => (
                        <Option key={warehouse._id} value={warehouse._id}>{warehouse.name}</Option>
                    ))}
                </Select>

                <DatePicker.RangePicker
                    style={{ marginLeft: 8 }}
                    // onChange={(dates) => setSelectedDateRange(dates)}
                    // value={selectedDateRange}
                />

                {selectedCustomer || selectedWarehouse ? (
                    <Button
                        type="primary"
                        onClick={clearFilters}
                        style={{ marginLeft: 8 }}
                        icon={<CloseCircleOutlined />}
                    >
                        Clear Filter
                    </Button>
                ) : null}
            </div>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Consignments"
                data={consignments?.filter(consignment => {
                    return ((!selectedCustomer || consignment.customerId._id === selectedCustomer) && (!selectedWarehouse || consignment.warehouseId._id === selectedWarehouse));
                }) || []}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <Modal
                title="Commodity Details"
                visible={selectedCommodityBags !== null}
                onCancel={() => setSelectedCommodityBags(null)}
                footer={null}
                width={800}
            >
                {selectedCommodityBags && (
                    <Table
                        dataSource={selectedCommodityBags}
                        columns={bagColumns}
                        pagination={false}
                        rowKey="noOfBags"
                    />
                )}
            </Modal>
            <EditStockOut
                visible={showEditModal}
                onCancel={handleEditCancel}
                onOk={handleEditOk}
                initialValues={editingConsignment}
            />
        </div>
    );
};

export default StockOuts;

