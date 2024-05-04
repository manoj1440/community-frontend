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

    const handletransferred = (consignmentId, isRemoved = false) => {
        Modal.confirm({
            title: 'Confirm Cash Out',
            content: `This will mark this cash as ${isRemoved ? 'not' : ''} Transferred ?`,
            onOk: async () => {
                try {
                    const response = await api.request('put', `/api/consignment/${consignmentId}`, { transferred: isRemoved ? 'No' : 'Yes' });
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
            dataIndex: 'transferred',
            key: 'transferred',
            render: (transferred) => (<span style={{ color: (transferred && transferred.toLowerCase() === 'yes') ? 'green' : 'red' }}>{transferred}</span>)
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        style={{ backgroundColor: (record.transferred && record.transferred.toLowerCase() === 'yes') ? 'green' : '' }}
                        onClick={() => handletransferred(record._id, record.transferred && record.transferred.toLowerCase() === 'yes')} type="primary">
                        {(record.transferred && record.transferred.toLowerCase() === 'yes') ? 'Remove Transferred' : 'Mark Transferred'}
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
