import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditCustomer from './EditCustomer';
import AddCustomerForm from './AddCustomerForm';
import CustomTable from '../common/CustomTable';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editCustomerData, setEditCustomerData] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        fetchCustomers(pagination.current, pagination.pageSize);
    }, []);

    const fetchCustomers = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/customer');
            const { data } = response;
            setCustomers(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const showEditModal = (record) => {
        setEditCustomerData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditCustomerData({});
    };

    const handleDeleteCustomer = (customerId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this customer?',
            onOk: async () => {
                try {
                    console.log(`Deleting customer with ID: ${customerId}`);
                    await api.request('delete', `/api/customer/${customerId}`);
                    fetchCustomers(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting customer:', error);
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
            title: 'Contact Detail',
            dataIndex: 'contactDetail',
            key: 'contactDetail',
        },
        {
            title: 'Transaction Ref',
            dataIndex: 'transactionRef',
            key: 'transactionRef',
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
                    <Button onClick={() => handleDeleteCustomer(record._id)} type="danger">
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
                Add Customer
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Customers"
                data={customers}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditCustomer
                fetchCustomers={fetchCustomers}
                editModalVisible={editModalVisible}
                customer={{ ...editCustomerData }}
                onCancel={handleEditModalClose} />
            <AddCustomerForm
                isAddModalVisible={isAddModalVisible}
                fetchCustomers={fetchCustomers}
                onCancel={setIsAddModalVisible} />
        </div>
    );
};

export default Customers;
