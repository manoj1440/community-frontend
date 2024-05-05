import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Tag } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const CashIns = () => {
    const [consignments, setConsignments] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedCommodity, setSelectedCommodity] = useState(null);

    useEffect(() => {
        fetchConsignments(pagination.current, pagination.pageSize);
    }, []);

    const fetchConsignments = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/stock-out');
            const { data } = response;
            setConsignments(data.map(consignment => ({
                ...consignment,
                commodity: consignment.commodity.map(commodity => ({
                    ...commodity,
                    totalBags: commodity.bags.reduce((acc, bag) => acc + bag.noOfBags, 0)
                }))
            })));
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
                    console.error('Error updating cash In:', error);
                }
            },
        });
    };

    const commodityColumns = [
        {
            title: 'Commodity',
            dataIndex: ['commodityId', 'name'],
            key: 'commodityId',
        },
        {
            title: 'Total Bags',
            dataIndex: 'totalBags',
            key: 'totalBags',
        },
    ];

    const columns = [
        {
            title: 'Customer',
            dataIndex: ['customerId', 'name'],
            key: 'customerId',
        },
        {
            title: 'Warehouse',
            dataIndex: ['warehouseId', 'name'],
            key: 'warehouseId',
        },
        {
            title: 'Commodities',
            dataIndex: 'commodity',
            key: 'commodity',
            render: (commodities) => (
                <div>
                    {commodities.map((commodity, index) => (
                        <Tag
                            key={index}
                            color="geekblue"
                            style={{ marginBottom: 4, cursor: 'pointer' }}
                            onClick={() => setSelectedCommodity(commodity)}
                        >
                            {commodity.commodityId.name}
                        </Tag>
                    ))}
                </div>
            ),
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
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
                <Button
                    style={{ backgroundColor: (record.received && record.received.toLowerCase() === 'yes') ? 'green' : '' }}
                    onClick={() => handleReceived(record._id, record.received && record.received.toLowerCase() === 'yes')} type="primary">
                    {(record.received && record.received.toLowerCase() === 'yes') ? 'Remove Received' : 'Mark Received'}
                </Button>
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
            <Modal
                title="Commodity Details"
                visible={selectedCommodity !== null}
                onCancel={() => setSelectedCommodity(null)}
                footer={null}
                width={800}
            >
                {selectedCommodity && (
                    <Table
                        dataSource={[selectedCommodity]}
                        columns={commodityColumns}
                        pagination={false}
                        rowKey="commodityId"
                    />
                )}
            </Modal>
        </div>
    );
};

export default CashIns;
