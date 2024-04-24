import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditUser from './EditUser';
import AddUserForm from './AddUser';
import CustomTable from '../common/CustomTable';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editUserData, setEditUserData] = useState({});
    const [isAddModal, setIsAddModal] = useState(false)


    useEffect(() => {
        fetchUsers(pagination.current, pagination.pageSize);
        fetchWarehouses();
    }, []);

    const fetchUsers = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/user');
            const { data } = response;
            setUsers(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching users:', error);
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

    const showEditModal = (record) => {
        setEditUserData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditUserData({});
    };

    const handleDeleteUser = (userId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this user?',
            onOk: async () => {
                try {
                    console.log(`Deleting user with ID: ${userId}`);
                    const response = await api.request('delete', `/api/user/${userId}`);
                    fetchUsers(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting user:', error);
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouseId',
            key: 'warehouseId',
            render: (warehouseId) => warehouseId ? warehouseId.name : 'NA'
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
                    <Button onClick={() => handleDeleteUser(record._id)} type="danger">
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
                onClick={() => setIsAddModal(true)} type="primary">
                Add User
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Users"
                data={users}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditUser
                fetchUsers={fetchUsers}
                editModalVisible={editModalVisible}
                user={{ ...editUserData }}
                onCancel={handleEditModalClose}
                warehouses={warehouses}
                />
            <AddUserForm
                isAddModal={isAddModal}
                fetchUsers={fetchUsers}
                onCancel={setIsAddModal}
                warehouses={warehouses}
                
                />
        </div>
    );
};

export default Users;
