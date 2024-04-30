import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditStockOut from './EditStockOut';
import AddStockOutForm from './AddStockOutForm';
import CustomTable from '../common/CustomTable';

const StockOuts = () => {
    const [consignments, setConsignments] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editConsignmentData, setEditConsignmentData] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        fetchConsignments(pagination.current, pagination.pageSize);
        fetchWarehouses();
        fetchCustomers();
        fetchCommodities();
    }, []);

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

    const fetchWarehouses = async () => {
        try {
            const response = await api.request('get', '/api/warehouse');
            const { data } = response;
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.request('get', '/api/customer');
            const { data } = response;
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customer:', error);
        }
    };

    const fetchCommodities = async () => {
        try {
            const response = await api.request('get', '/api/commodity');
            const { data } = response;
            setCommodities(data);
        } catch (error) {
            console.error('Error fetching commodity:', error);
        }
    };

    const showEditModal = (record) => {
        setEditConsignmentData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditConsignmentData({});
    };

    const handleAddModalClose = () => {
        setIsAddModalVisible(false);
        setEditConsignmentData({});
    };

    const handleDeleteConsignment = (consignmentId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this stock out?',
            onOk: async () => {
                try {
                    console.log(`Deleting stock out with ID: ${consignmentId}`);
                    await api.request('delete', `/api/stock-out/${consignmentId}`);
                    fetchConsignments(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting stock out:', error);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Customer',
            dataIndex: 'customerId',
            key: 'customerId',
            render: (customerId) => customerId ? customerId.name : 'NA'
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouseId',
            key: 'warehouseId',
            render: (warehouseId) => warehouseId ? warehouseId.name : 'NA'

        },
        {
            title: 'Commodity',
            dataIndex: 'commodityId',
            key: 'commodityId',
            render: (commodityId) => commodityId ? commodityId.name : 'NA'

        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Selliong Price',
            dataIndex: 'sellingPrice',
            key: 'sellingPrice',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {/* <Button onClick={() => showEditModal(record)} type="primary">
                        Edit
                    </Button> */}
                    <Button onClick={() => handleDeleteConsignment(record._id)} type="danger">
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button
                style={{ marginBottom: 10 }}
                onClick={() => setIsAddModalVisible(true)} type="primary">
                Add Stock Out
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="StockOut"
                data={consignments}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditStockOut
                fetchConsignments={fetchConsignments}
                editModalVisible={editModalVisible}
                consignment={{ ...editConsignmentData }}
                onCancel={handleEditModalClose}
                warehouses={warehouses}
                commodities={commodities}
                customers={customers}

            />
            <AddStockOutForm
                isAddModalVisible={isAddModalVisible}
                fetchConsignments={fetchConsignments}
                onCancel={handleAddModalClose}
                warehouses={warehouses}
                commodities={commodities}
                customers={customers}

            />
        </div>
    );
};

export default StockOuts;
