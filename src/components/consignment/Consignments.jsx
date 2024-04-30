import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditConsignment from './EditConsignment';
import AddConsignmentForm from './AddConsignmentForm';
import CustomTable from '../common/CustomTable';

const Consignments = () => {
    const [consignments, setConsignments] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [farmers, setFarmers] = useState([]);

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
        fetchFarmers();
        fetchCommodities();
        fetchTransportes();
    }, []);

    const fetchConsignments = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/consignment');
            const { data } = response;
            setConsignments(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching consignments:', error);
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

    const fetchFarmers = async () => {
        try {
            const response = await api.request('get', '/api/farmer');
            const { data } = response;
            setFarmers(data);
        } catch (error) {
            console.error('Error fetching farmer:', error);
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

    const fetchTransportes = async () => {
        try {
            const response = await api.request('get', '/api/transporter');
            const { data } = response;
            setTransporters(data);
        } catch (error) {
            console.error('Error fetching transporters:', error);
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
            content: 'Are you sure you want to delete this consignment?',
            onOk: async () => {
                try {
                    console.log(`Deleting consignment with ID: ${consignmentId}`);
                    await api.request('delete', `/api/consignment/${consignmentId}`);
                    fetchConsignments(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting consignment:', error);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Consignment ID',
            dataIndex: 'consignmentId',
            key: 'consignmentId',
            render: (consignmentId) => consignmentId ? consignmentId : 'NA'
        },
        {
            title: 'Farmer',
            dataIndex: 'farmerId',
            key: 'farmerId',
            render: (farmerId) => farmerId ? farmerId.name : 'NA'
        },
        {
            title: 'Transporter',
            dataIndex: 'transporterId',
            key: 'transporterId',
            render: (transporterId) => transporterId ? transporterId.transportAgency : 'NA'

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
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
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
                Add Consignment
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Consignments"
                data={consignments}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditConsignment
                fetchConsignments={fetchConsignments}
                editModalVisible={editModalVisible}
                consignment={{ ...editConsignmentData }}
                onCancel={handleEditModalClose}
                warehouses={warehouses}
                transporters={transporters}
                commodities={commodities}
                farmers={farmers}

            />
            <AddConsignmentForm
                isAddModalVisible={isAddModalVisible}
                fetchConsignments={fetchConsignments}
                onCancel={handleAddModalClose}
                warehouses={warehouses}
                transporters={transporters}
                commodities={commodities}
                farmers={farmers}

            />
        </div>
    );
};

export default Consignments;
