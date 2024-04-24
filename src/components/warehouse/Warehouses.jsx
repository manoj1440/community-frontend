import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditWarehouse from './EditWarehouse';
import AddWarehouseForm from './AddWarehouseForm';
import CustomTable from '../common/CustomTable';

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editWarehouseData, setEditWarehouseData] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        fetchWarehouses(pagination.current, pagination.pageSize);
    }, []);

    const fetchWarehouses = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/warehouse');
            const { data } = response;
            setWarehouses(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const showEditModal = (record) => {
        setEditWarehouseData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditWarehouseData({});
    };

    const handleDeleteWarehouse = (warehouseId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this warehouse?',
            onOk: async () => {
                try {
                    console.log(`Deleting warehouse with ID: ${warehouseId}`);
                    await api.request('delete', `/api/warehouse/${warehouseId}`);
                    fetchWarehouses(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting warehouse:', error);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showEditModal(record)} type="primary">
                        Edit
                    </Button>
                    <Button onClick={() => handleDeleteWarehouse(record._id)} type="danger">
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
                Add Warehouse
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Warehouses"
                data={warehouses}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditWarehouse
                fetchWarehouses={fetchWarehouses}
                editModalVisible={editModalVisible}
                warehouse={{ ...editWarehouseData }}
                onCancel={handleEditModalClose} />
            <AddWarehouseForm
                isAddModalVisible={isAddModalVisible}
                fetchWarehouses={fetchWarehouses}
                onCancel={setIsAddModalVisible} />
        </div>
    );
};

export default Warehouses;
