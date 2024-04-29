import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const CashIns = () => {
    const [consignments, setConsignments] = useState([]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    useEffect(() => {
        fetchConsignments(pagination.current, pagination.pageSize);
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
            console.error('Error fetching consignments:', error);
        }
    };

    const handleReceived = (consignmentId, isRemoved = false) => {
        Modal.confirm({
            title: 'Confirm Cash In',
            content: `This will mark this cash as ${isRemoved ? 'not' : ''} received ?`,
            onOk: async () => {
                try {
                    const response = await api.request('put', `/api/stock-out/${consignmentId}`, { received: isRemoved ? 'No' : 'Yes' });
                    fetchConsignments();
                } catch (error) {
                    console.error('Error updating cash in:', error);
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
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Received',
            dataIndex: 'received',
            key: 'received',
            render: (received) => (<span style={{ color: (received && received.toLowerCase() === 'yes') ? 'green' : 'red' }}>{received}</span>)
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        style={{ backgroundColor: (record.received && record.received.toLowerCase() === 'yes') ? 'green' : '' }}
                        onClick={() => handleReceived(record._id, record.received && record.received.toLowerCase() === 'yes')} type="primary">
                        {(record.received && record.received.toLowerCase() === 'yes') ? 'Remove Received' : 'Mark Received'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Consignments"
                data={consignments}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
        </div>
    );
};

export default CashIns;
