import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const CashOuts = () => {
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

    const handleTransfered = (consignmentId, isRemoved = false) => {
        Modal.confirm({
            title: 'Confirm Cash Out',
            content: `This will mark this cash as ${isRemoved ? 'not' : ''} Transferred ?`,
            onOk: async () => {
                try {
                    const response = await api.request('put', `/api/consignment/${consignmentId}`, { transfered: isRemoved ? 'No' : 'Yes' });
                    fetchConsignments();
                } catch (error) {
                    console.error('Error updating cash out:', error);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Farmer',
            dataIndex: 'farmerId',
            key: 'farmerId',
            render: (farmerId) => farmerId ? farmerId.name : 'NA'
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
            title: 'Transferred',
            dataIndex: 'transfered',
            key: 'transfered',
            render: (transfered) => (<span style={{ color: (transfered && transfered.toLowerCase() === 'yes') ? 'green' : 'red' }}>{transfered}</span>)
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        style={{ backgroundColor: (record.transfered && record.transfered.toLowerCase() === 'yes') ? 'green' : '' }}
                        onClick={() => handleTransfered(record._id, record.transfered && record.transfered.toLowerCase() === 'yes')} type="primary">
                        {(record.transfered && record.transfered.toLowerCase() === 'yes') ? 'Remove Transferred' : 'Mark Transferred'}
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

export default CashOuts;
