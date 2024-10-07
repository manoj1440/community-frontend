import { useState, useEffect } from 'react';
import { Modal, Space, Button, Table, Tag, Select, DatePicker, Tooltip } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/GridTable';
import { CloseCircleOutlined } from '@ant-design/icons';
import { readableDate } from '../../utils/config';
import ConsignmentExcelExport from './ConsignmentExcelExport'
import AddConsignmentForm from './AddConsignmentForm';

const { Option } = Select;

const Consignments = () => {
    const [consignments, setConsignments] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const [selectedFarmer, setSelectedFarmer] = useState(null);

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState(null);
    const [optionCommodity, setOptionCommodity] = useState(null);
    const [selectedCreatedUser, setSelectedCreatedUser] = useState(null);
    const [farmers, setFarmers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const [users, setUsers] = useState([]);
    const [prices, setPrices] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState('');
    const [filteredConsignments, setFilteredConsignments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFarmers();
        fetchWarehouses();
        fetchCommodities();
        fetchUsers();
        fetchPrices();
        fetchTransporters();
    }, []);

    useEffect(() => {
        fetchConsignments(pagination.current = 1, pagination.pageSize = 10);
    }, [selectedDateRange, selectedFarmer, optionCommodity, selectedCreatedUser, selectedWarehouse]);

    useEffect(() => {
        const prefetchConsignments = async () => {
            const data = await handleFetchFilteredConsignments();
            setFilteredConsignments(data);
        };

        prefetchConsignments();
    }, [selectedDateRange, selectedFarmer, optionCommodity, selectedCreatedUser, selectedWarehouse]);

    const handleFetchFilteredConsignments = async () => {
         setLoading(true);
        try {
            const url = `/api/consignment/consignments?page=1&limit=99999&farmerId=${selectedFarmer || ''}&warehouseId=${selectedWarehouse || ''}&commodityId=${optionCommodity || ''}&createdBy=${selectedCreatedUser || ''}&dateRange=${selectedDateRange || ''}`;
            const response = await api.request('get', url);
            const { data } = response;
            setLoading(false)
            return data;
        } catch (error) {
            console.error('Error fetching all consignments:', error);
            setLoading(false)
            return [];
        }
    };

    const fetchFarmers = async () => {
        try {
            const response = await api.request('get', '/api/farmer');
            const { data } = response;
            setFarmers(data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
        }
    };

    const fetchTransporters = async () => {
        try {
            const response = await api.request('get', '/api/transporter');
            const { data } = response;
            setTransporters(data);
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

    const fetchCommodities = async () => {
        try {
            const response = await api.request('get', '/api/commodity');
            const { data } = response;
            setCommodities(data);
        } catch (error) {
            console.error('Error fetching commodities:', error);
        }
    };

    const fetchUsers = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const response = await api.request('get', '/api/user');
            const { data } = response;
            setUsers(data);
            setPagination({
                current: page,
                pageSize,
                total: data.length,
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchPrices = async () => {
        try {
            const response = await api.request('get', '/api/price');
            const { data } = response;
            setPrices(data);
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    const fetchConsignments = async (page = pagination.current, pageSize = pagination.pageSize) => {
        try {
            const url = `/api/consignment/consignments?page=${page}&limit=${pageSize}&farmerId=${selectedFarmer || ''}&warehouseId=${selectedWarehouse || ''}&commodityId=${optionCommodity || ''}&createdBy=${selectedCreatedUser || ''}&dateRange=${selectedDateRange || ''}`;


            const response = await api.request('get', url);

            console.log("🚀 ~ fetchConsignments ~ response:", response);

            const { data, pagination } = response;
            setConsignments(data);

            setPagination({
                current: pagination.currentPage,
                pageSize: pagination.limit,
                total: pagination.totalCount,
            });
        } catch (error) {
            console.error('Error fetching consignments:', error);
        }
    };

    const handleDeleteConsignment = (consignmentId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this consignment?',
            onOk: async () => {
                try {
                    console.log(`Deleting consignment with ID: ${consignmentId}`);
                    await api.request('delete', `/api/consignment/${consignmentId}`);
                    fetchConsignments(pagination.current, pagination.pageSize);
                } catch (error) {
                    console.error('Error deleting consignment:', error);
                }
            },
        });
    };

    const clearFilters = () => {
        setSelectedFarmer(null);
        setSelectedWarehouse(null);
        setSelectedDateRange(null);
        setOptionCommodity(null);
        setSelectedCreatedUser(null);
    }

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
            title: 'Consignment ID',
            dataIndex: 'consignmentId',
            key: 'consignmentId',
            render: (consignmentId) => consignmentId ? consignmentId : 'NA'
        },
        {
            title: 'Farmer',
            dataIndex: ['farmerId', 'name'],
            key: 'farmerId',
        },
        {
            title: 'Transporter',
            dataIndex: ['transporterId', 'driverName'],
            key: 'transporterId',
            //render: (_, record) => record.transporterId ? `${record.transporterId.driverName}` : 'NA'
        },
        {
            title: 'Warehouse',
            dataIndex: ['warehouseId', 'name'],
            key: 'warehouseId',
        },
        {
            title: 'CreatedBy',
            dataIndex: ['createdBy', 'name'],
            key: 'createdBy'
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
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => createdAt ? readableDate(createdAt) : 'NA'
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button disabled={record.transferred.toLowerCase() === 'yes'} onClick={() => handleDeleteConsignment(record._id)} type="danger">
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];


    const normalizeDate = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    const handleDateRangeChange = (dates) => {
        setSelectedDateRange(dates);
    };


    // const consignmentData = consignments.filter((consignment) => {
    //     const consignmentDate = normalizeDate(consignment.createdAt);

    //     let dateRangeMatch = true;

    //     if (selectedDateRange) {
    //         const [start, end] = selectedDateRange.map(date => normalizeDate(date));
    //         dateRangeMatch = consignmentDate >= start && consignmentDate <= end;
    //     }
    //     const hasSelectedCommodity = !optionCommodity ||
    //         consignment.commodity.some(commodityItem =>
    //             commodityItem.commodityId._id === optionCommodity
    //         );

    //     return ((!selectedFarmer || (consignment.farmerId && consignment.farmerId._id === selectedFarmer))
    //         && (!selectedWarehouse || consignment.warehouseId._id === selectedWarehouse)
    //         && (!selectedCreatedUser || consignment.createdBy?._id === selectedCreatedUser)
    //         && dateRangeMatch && hasSelectedCommodity
    //     )
    // })

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={() => { setAddModalOpen(true) }}
                >
                    Add Consignment
                </Button>

                <Select
                    showSearch
                    placeholder="Select Farmer"
                    style={{ width: 140, marginRight: 4, marginLeft: '3px' }}
                    onChange={(value) => {
                        setSelectedFarmer(value);
                    }}
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
                    style={{ width: 130 }}
                    onChange={(value) => setSelectedWarehouse(value)}
                    value={selectedWarehouse}
                >
                    {warehouses.map(warehouse => (
                        <Option key={warehouse._id} value={warehouse._id}>{warehouse.name}</Option>
                    ))}
                </Select>

                <Select
                    showSearch
                    placeholder="Select Commodity"
                    style={{ width: 130, marginRight: 4, marginLeft: 4 }}
                    onChange={(value) => setOptionCommodity(value)}
                    filterOption={(inputValue, option) =>
                        option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                    }
                    value={optionCommodity}
                >
                    {commodities.map((commodity) => (
                        <Option key={commodity._id} value={commodity._id}>
                            {commodity.name}
                        </Option>
                    ))}
                </Select>

                <Select
                    showSearch
                    placeholder="Select User"
                    style={{ width: 130, marginRight: 4, marginLeft: 4 }}
                    onChange={(value) => setSelectedCreatedUser(value)}
                    filterOption={(inputValue, option) =>
                        option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                    }
                    value={selectedCreatedUser}
                >
                    {users.map((user) => (
                        <Option key={user._id} value={user._id}>
                            {user.name}
                        </Option>
                    ))}
                </Select>

                <DatePicker.RangePicker
                    style={{ marginLeft: 1 }}
                    onChange={handleDateRangeChange}
                    value={selectedDateRange}
                />

                <ConsignmentExcelExport
                    excelData={filteredConsignments ? filteredConsignments : []}
                    prices={prices}
                    buttonText='Export'
                    fileName='Consignments'
                    handleFetchFilteredConsignments={handleFetchFilteredConsignments}
                />



                {selectedFarmer || selectedWarehouse || selectedDateRange || optionCommodity || selectedCreatedUser ? (
                    <Button
                        type="primary"
                        onClick={clearFilters}
                        style={{ marginLeft: 4 }}
                        icon={<CloseCircleOutlined />}
                    >
                        Clear   
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

            <AddConsignmentForm
                isAddModalVisible={addModalOpen}
                onCancel={() => { setAddModalOpen(false) }}
                warehouses={warehouses}
                commodities={commodities}
                transporters={transporters}
                farmers={farmers}
                fetchConsignments={fetchConsignments}
            />
        </div>
    );
};

export default Consignments;
