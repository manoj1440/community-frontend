import React, { useState, useEffect } from 'react';
import { Modal, Table, Select, Button } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const { Option } = Select;

const StockIns = () => {
    const [stockIns, setStockIns] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [commodities, setCommodities] = useState([]);

    useEffect(() => {
        fetchStockIns(pagination.current, pagination.pageSize);
        fetchWarehouses();
        fetchCommodities();
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

    const fetchWarehouses = async () => {
        try {
            const response = await api.request('get', '/api/warehouse');
            const { data } = response;
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const fetchCommodities = async () => {
        try {
            const response = await api.request('get', '/api/commodity');
            const { data } = response;
            setCommodities(data);
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    };

    const clearFilters = () => {
        setSelectedWarehouse(null);
        setSelectedCommodity(null);
    };

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
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Select
                    placeholder="Select Warehouse"
                    style={{ width: 200, marginRight: 8 }}
                    onChange={(value) => setSelectedWarehouse(value)}
                    value={selectedWarehouse}
                >
                    {warehouses.map(warehouse => (
                        <Option key={warehouse._id} value={warehouse._id}>{warehouse.name}</Option>
                    ))}
                </Select>

                <Select
                    placeholder="Select Commodity"
                    style={{ width: 200, marginRight: 8 }}
                    onChange={(value) => setSelectedCommodity(value)}
                    value={selectedCommodity}
                >
                    {commodities.map(commodity => (
                        <Option key={commodity._id} value={commodity._id}>{commodity.name}</Option>
                    ))}
                </Select>
                {(selectedWarehouse || selectedCommodity) ? (
                    <Button
                        type="primary"
                        onClick={clearFilters}
                        style={{ marginLeft: 8 }}
                    >
                        Clear Filter
                    </Button>
                ) : ''}
            </div>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="StockIns"
                data={stockIns.filter((stockIn) => {
                    return (!selectedWarehouse || stockIn.warehouseId._id === selectedWarehouse) &&
                        (!selectedCommodity || stockIn.commodityId._id === selectedCommodity)
                })}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
        </div>
    );
};

export default StockIns;
