import { useState, useEffect } from 'react';
import { Modal, Button, Table, Tag, Select, message, DatePicker } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/GridTable';
import { readableDate } from '../../utils/config';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const CashOuts = () => {
    const [consignments, setConsignments] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState(null)
    const [selectedTransferred, setSelectedTransferred] = useState(null);
    const [farmers, setFarmers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        fetchFarmers();
        fetchWarehouses();
        fetchConsignments(pagination.current, pagination.pageSize);
    }, []);

    useEffect(() => {
        fetchConsignments(pagination.current = 1, pagination.pageSize = 10);
    }, [selectedFarmer, selectedWarehouse, selectedTransferred, selectedDateRange]);

    const fetchFarmers = async () => {
        try {
            const response = await api.request('get', '/api/farmer');
            const { data } = response;
            setFarmers(data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
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
            const response = await api.request('get', `/api/consignment/consignments?page=${page}&limit=${pageSize}&farmerId=${selectedFarmer || ''}&warehouseId=${selectedWarehouse || ''}&transferred=${selectedTransferred || ''}&dateRange=${selectedDateRange || ''}`)
            const { data, pagination } = response;
            console.log("🚀 ~ fetchConsignments ~ response:", response)

            setConsignments(data.map(consignment => ({
                ...consignment,
                commodity: consignment.commodity.map(commodity => ({
                    ...commodity,
                    totalBags: commodity.bags.reduce((acc, bag) => acc + bag.noOfBags, 0)
                }))
            })));
            setPagination({
                current: pagination.currentPage,
                pageSize: pagination.limit,
                total: pagination.totalCount,
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

                    if (response.status === false) {
                        message.error(response.message);
                    }
                    fetchConsignments();
                } catch (error) {
                    console.error('Error updating cash out:', error);
                }
            },
        });
    };

    const clearFilters = () => {
        setSelectedFarmer(null);
        setSelectedWarehouse(null);
        setSelectedDateRange(null);
        setSelectedTransferred(null);
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
            title: 'Farmer',
            dataIndex: ['farmerId', 'name'],
            key: 'farmerId',
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
            title: 'Transferred',
            dataIndex: 'transferred',
            key: 'transferred',
            render: (transferred) => (<span style={{ color: (transferred && transferred.toLowerCase() === 'yes') ? 'green' : 'red' }}>{transferred}</span>)
        },
        {
            title: 'Transferred At',
            dataIndex: 'transferredAt',
            key: 'transferredAt',
            render: (transferredAt) => transferredAt ? readableDate(transferredAt) : 'NA'
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Button
                    style={{ backgroundColor: (record.transferred && record.transferred.toLowerCase() === 'yes') ? 'green' : '' }}
                    onClick={() => handletransferred(record._id, record.transferred && record.transferred.toLowerCase() === 'yes')} type="primary">
                    {(record.transferred && record.transferred.toLowerCase() === 'yes') ? 'Remove Transferred' : 'Mark Transferred'}
                </Button>
            ),
        },
    ];

    const normalizeDate = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Select
                    showSearch
                    placeholder="Select Farmer"
                    style={{ width: 200, marginRight: 8 }}
                    onChange={(value) => setSelectedFarmer(value)}
                    filterOption={(inputValue, option) =>
                        option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                    }
                    value={selectedFarmer}
                >
                    {farmers.map(farmer => (
                        <Option key={farmer._id} value={farmer._id}>{farmer.name}</Option>
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

                <Select
                    placeholder="Transfer"
                    style={{ width: 200, marginLeft: '9px' }}
                    onChange={(value) => setSelectedTransferred(value)}
                    value={selectedTransferred}
                >
                    <Option key='Yes' value='Yes'>Transferred</Option>
                    <Option key='No' value='No'>Not Transferred</Option>

                </Select>

                <DatePicker.RangePicker
                    style={{ marginLeft: 8 }}
                    onChange={(dates) => setSelectedDateRange(dates)}
                    value={selectedDateRange}
                />

                {selectedFarmer || selectedWarehouse || selectedDateRange || selectedTransferred ? (
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
                data={consignments}
                columns={columns}
                pagination={pagination}
                fetchConsignments={fetchConsignments}
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

export default CashOuts;
