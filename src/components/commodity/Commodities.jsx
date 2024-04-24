import React, { useState, useEffect } from 'react';
import { Button, Modal, Space } from 'antd';
import api from '../../utils/api';
import EditCommodity from './EditCommodity';
import AddCommodityForm from './AddCommodityForm';
import CustomTable from '../common/CustomTable';

const Commodities = () => {
    const [commodities, setCommodities] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editCommodityData, setEditCommodityData] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    useEffect(() => {
        fetchCommodities();
    }, []);

    const fetchCommodities = async () => {
        try {
            const response = await api.request('get', '/api/commodity');
            const { data } = response;
            setCommodities(data);
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    };

    const showEditModal = (record) => {
        setEditCommodityData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditCommodityData({});
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this commodity?',
            onOk: async () => {
                try {
                    console.log(`Deleting commodity with ID: ${id}`);
                    await api.request('delete', `/api/commodity/${id}`);
                    fetchCommodities();
                } catch (error) {
                    console.error('Error deleting commodity:', error);
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
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showEditModal(record)} type="primary">
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record._id)} type="danger">
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
                Add Commodity
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Commodity"
                data={commodities}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditCommodity
                commodity={editCommodityData}
                onCancel={handleEditModalClose}
                editModalVisible={editModalVisible}
                fetchCommodities={fetchCommodities}
            />
            <AddCommodityForm
                isAddModalVisible={isAddModalVisible}
                onCancel={setIsAddModalVisible}
                fetchCommodities={fetchCommodities}
            />
        </div>
    );
};

export default Commodities;
