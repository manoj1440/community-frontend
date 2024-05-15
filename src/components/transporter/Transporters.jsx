import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditTransporter from './EditTransporter';
import AddTransporterForm from './AddTransporterForm';
import CustomTable from '../common/CustomTable';

const Transporters = () => {
    const [transporters, setTransporters] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editTransporterData, setEditTransporterData] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        fetchTransporters(pagination.current, pagination.pageSize);
    }, []);

    const fetchTransporters = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/transporter');
            const { data } = response;
            console.log(data);
            setTransporters(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching transporters:', error);
        }
    };

    const showEditModal = (record) => {
        setEditTransporterData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditTransporterData({});
    };

    const handleDeleteTransporter = (transporterId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this transporter?',
            onOk: async () => {
                try {
                    console.log(`Deleting transporter with ID: ${transporterId}`);
                    await api.request('delete', `/api/transporter/${transporterId}`);
                    fetchTransporters(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting transporter:', error);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Driver Name',
            dataIndex: 'driverName',
            key: 'driverName',
        },
        {
            title: 'Vehicle Number',
            dataIndex: 'vehicleNumber',
            key: 'vehicleNumber',
        },
        {
            title: 'Driver Contact No',
            dataIndex: 'driverContactNo',
            key: 'driverContactNo',
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
                    <Button onClick={() => handleDeleteTransporter(record._id)} type="danger">
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
                Add Transporter
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Transporters"
                data={transporters}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditTransporter
                fetchTransporters={fetchTransporters}
                editModalVisible={editModalVisible}
                transporter={{ ...editTransporterData }}
                onCancel={handleEditModalClose} />
            <AddTransporterForm
                isAddModalVisible={isAddModalVisible}
                fetchTransporters={fetchTransporters}
                onCancel={setIsAddModalVisible} />
        </div>
    );
};

export default Transporters;
