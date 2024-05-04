import React, { useState, useEffect } from 'react';
import { Modal, Table } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const StockIns = () => {
    const [stockIns, setStockIns] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedStockIn, setSelectedStockIn] = useState(null);

    useEffect(() => {
        fetchStockIns(pagination.current, pagination.pageSize);
    }, []);

    const fetchStockIns = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/stock-in');
            const { data } = response;
            setStockIns(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching stockIns:', error);
        }
    };

    const bagColumns = [
        {
            title: 'No. of Bags',
            dataIndex: 'noOfBags',
            key: 'noOfBags',
        },
        {
            title: 'Weight',
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
            title: 'Warehouse',
            dataIndex: ['warehouseId', 'name'],
            key: 'warehouseId',
        },
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
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Bags',
            dataIndex: 'bags',
            key: 'bags',
            render: (bags, record) => (
                <a onClick={() => setSelectedStockIn(record)}>View Bags</a>
            ),
        },
    ];

    return (
        <div>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="StockIns"
                data={stockIns}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <Modal
                title="Bag Details"
                open={selectedStockIn !== null}
                onCancel={() => setSelectedStockIn(null)}
                footer={null}
                width={800}
            >
                {selectedStockIn && (
                    <Table
                        dataSource={selectedStockIn.bags}
                        columns={bagColumns}
                        pagination={false}
                        rowKey="noOfBags"
                    />
                )}
            </Modal>
        </div>
    );
};

export default StockIns;