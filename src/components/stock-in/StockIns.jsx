import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const StockIns = () => {
    const [stockIns, setStockIns] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

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

    const columns = [
        {
            title: 'Commodity',
            dataIndex: 'commodityId',
            key: 'commodityId',
            render: (commodityId) => commodityId ? commodityId.name : 'NA'
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouseId',
            key: 'warehouseId',
            render: (warehouseId) => warehouseId ? warehouseId.name : 'NA'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
    ];

    return (
        <div>
            <div className='page-title-text' >Stock In</div>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="StockIns"
                data={stockIns}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
        </div>
    );
};

export default StockIns;
