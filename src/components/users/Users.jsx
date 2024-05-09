import React, { useState, useEffect } from 'react';
import { Modal, Space, Button, Select } from 'antd';
import api from '../../utils/api';
import EditUser from './EditUser';
import AddUserForm from './AddUser';
import CustomTable from '../common/CustomTable';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const Users = () => {
    const [users, setUsers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editUserData, setEditUserData] = useState({});
    const [isAddModal, setIsAddModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

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

    const clearFilters = () => {
        setSelectedWarehouse(null);
    }

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
            <div style={{ marginBottom: 16 }}>
                {/* <Select
                    placeholder="Select Role"
                    style={{ width: 200, marginRight: 8 }}
                    onChange={(value) => setSelectedRole(value)}
                >
                    <Option value="admin">Admin</Option>
                    <Option value="manager">Manager</Option>
                    <Option value="employee">Employee</Option>
                </Select> */}


            </div>
            <Button
                style={{ marginBottom: 10, marginRight: 30 }}
                onClick={() => setIsAddModal(true)} type="primary">
                Add User
            </Button>

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

            {selectedWarehouse ? (
                <Button
                    type="primary"
                    onClick={clearFilters}
                    style={{ marginLeft: 8 }}
                    icon={<CloseCircleOutlined />}
                >
                    Clear Filter
                </Button>
            ) : null}

            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Users"
                data={users.filter(user => {
                    return ((!selectedRole || user.role === selectedRole) && (!selectedWarehouse || (user.warehouseId && user.warehouseId._id === selectedWarehouse)));
                })}
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
