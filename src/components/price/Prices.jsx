import React, { useState, useEffect } from 'react';
import { Modal, Space, Button } from 'antd';
import api from '../../utils/api';
import EditPrice from './EditPrice';
import AddPriceForm from './AddPriceForm';
import CustomTable from '../common/CustomTable';

const Prices = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [prices, setPrices] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editPriceData, setEditPriceData] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    useEffect(() => {
        fetchPrices(pagination.current, pagination.pageSize);
        fetchWarehouses();
        fetchCommodities()
    }, []);

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
            console.error('Error fetching warehouses:', error);
        }
    };


    const fetchPrices = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/price');
            const { data } = response;
            setPrices(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    const showEditModal = (record) => {
        setEditPriceData(record);
        setEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setEditPriceData({});
    };

    const handleDeletePrice = (priceId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this price?',
            onOk: async () => {
                try {
                    console.log(`Deleting price with ID: ${priceId}`);
                    await api.request('delete', `/api/price/${priceId}`);
                    fetchPrices(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting price:', error);
                }
            },
        });
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
            title: 'Price',
            dataIndex: 'historicalPrices',
            key: 'price',
            render: (historicalPrices) => (historicalPrices.length > 0 ? historicalPrices[historicalPrices.length - 1].price : 'N/A'),
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
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
                    <Button onClick={() => handleDeletePrice(record._id)} type="danger">
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
                onClick={() => setIsAddModalVisible(true)} type="primary">
                Add Price
            </Button>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Prices"
                data={prices}
                isFilter={false}
                columns={columns}
                pagination={pagination}
            />
            <EditPrice
                fetchPrices={fetchPrices}
                editModalVisible={editModalVisible}
                price={{ ...editPriceData }}
                onCancel={handleEditModalClose}
                warehouses={warehouses}
                commodities={commodities}
            />
            <AddPriceForm
                isAddModalVisible={isAddModalVisible}
                fetchPrices={fetchPrices}
                onCancel={setIsAddModalVisible}
                warehouses={warehouses}
                commodities={commodities}
            />
        </div>
    );
};

export default Prices;
