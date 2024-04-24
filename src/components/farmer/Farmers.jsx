import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditFarmer from './EditFarmer';
import AddFarmerForm from './AddFarmerForm';
import CustomTable from '../common/CustomTable';

const Farmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editFarmerData, setEditFarmerData] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        fetchFarmers(pagination.current, pagination.pageSize);
    }, []);

    const fetchFarmers = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/farmer');
            const { data } = response;
            setFarmers(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching farmers:', error);
        }
    };

    const showEditModal = (record) => {
        setEditFarmerData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditFarmerData({});
    };

    const handleDeleteFarmer = (farmerId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this farmer?',
            onOk: async () => {
                try {
                    console.log(`Deleting farmer with ID: ${farmerId}`);
                    await api.request('delete', `/api/farmer/${farmerId}`);
                    fetchFarmers(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting farmer:', error);
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
            title: 'Contact No',
            dataIndex: 'contactNo',
            key: 'contactNo',
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
                    <Button onClick={() => handleDeleteFarmer(record._id)} type="danger">
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
                Add Farmer
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Farmers"
                data={farmers}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditFarmer
                fetchFarmers={fetchFarmers}
                editModalVisible={editModalVisible}
                farmer={{ ...editFarmerData }}
                onCancel={handleEditModalClose} />
            <AddFarmerForm
                isAddModalVisible={isAddModalVisible}
                fetchFarmers={fetchFarmers}
                onCancel={setIsAddModalVisible} />
        </div>
    );
};

export default Farmers;
