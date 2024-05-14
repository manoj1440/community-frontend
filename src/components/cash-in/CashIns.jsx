import { useState, useEffect } from 'react';
import { Modal, Button, Table, Tag, Select } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';
import { readableDate } from '../../utils/config';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const CashIns = () => {
    const [consignments, setConsignments] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        fetchCustomers();
        fetchWarehouses();
        fetchConsignments(pagination.current, pagination.pageSize);
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.request('get', '/api/customer');
            const { data } = response;
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
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
                    await api.request('put', `/api/stock-out/${consignmentId}`, { received: isRemoved ? 'No' : 'Yes' });
                    fetchConsignments();
                } catch (error) {
                    console.error('Error updating cash In:', error);
                }
            },
        });
    };

    const clearFilters = () => {
        setSelectedCustomer(null);
        setSelectedWarehouse(null);
    }

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
            title: 'Received At',
            dataIndex: 'receivedAt',
            key: 'receivedAt',
            render: (receivedAt) => receivedAt ? readableDate(receivedAt) : 'NA'
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
            <div style={{ marginBottom: 16 }}>
                <Select
                    showSearch
                    placeholder="Select Customer"
                    style={{ width: 200, marginRight: 8 }}
                    onChange={(value) => setSelectedCustomer(value)}
                    filterOption={(inputValue, option) =>
                        option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                    }
                    value={selectedCustomer}
                >
                    {customers.map(customer => (
                        <Option key={customer._id} value={customer._id}>{customer.name}</Option>
                    ))}
                </Select>


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

                {selectedCustomer || selectedWarehouse ? (
                    <Button
                        type="primary"
                        onClick={clearFilters}
                        style={{ marginLeft: 8 }}
                        icon={<CloseCircleOutlined />}
                    >
                        Clear Filter
                    </Button>
                ) : null}
            </div>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Consignments"
                data={consignments.filter(consignment => {
                    return ((!selectedCustomer || consignment.customerId._id === selectedCustomer) && (!selectedWarehouse || consignment.warehouseId._id === selectedWarehouse));
                })}
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
