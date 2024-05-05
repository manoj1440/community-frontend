import React, { useState, useEffect } from 'react';
import { Modal, Space, Button, Table, Tag } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const StockOuts = () => {
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
            setConsignments(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching stock-out:', error);
        }
    };

    const handleDeleteConsignment = (consignmentId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this stock-out?',
            onOk: async () => {
                try {
                    console.log(`Deleting stock-out with ID: ${consignmentId}`);
                    await api.request('delete', `/api/stock-out/${consignmentId}`);
                    fetchConsignments(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting stock-out:', error);
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
            title: 'Total Quantity',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
        },
        {
            title: 'Rate Per Commodity',
            dataIndex: 'rate',
            key: 'rate',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
    ];

    const bagColumns = [
        {
            title: 'No. of Bags',
            dataIndex: 'noOfBags',
            key: 'noOfBags',
        },
        {
            title: 'Weight (Each Bag)',
            dataIndex: 'weight',
            key: 'weight',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
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
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleDeleteConsignment(record._id)} type="danger">
                        Delete
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
            <Modal
                title="Commodity Details"
                open={selectedCommodity !== null}
                onCancel={() => setSelectedCommodity(null)}
                footer={null}
                width={800}
            >
                {selectedCommodity && (
                    <div>
                        <Table
                            dataSource={[selectedCommodity]}
                            columns={commodityColumns}
                            pagination={false}
                            rowKey="commodityId"
                            expandable={{
                                expandedRowRender: (record) => (
                                    <Table
                                        dataSource={record.bags}
                                        columns={bagColumns}
                                        pagination={false}
                                        rowKey="noOfBags"
                                    />
                                ),
                            }}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StockOuts;