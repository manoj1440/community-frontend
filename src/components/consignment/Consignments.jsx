import { useState, useEffect } from 'react';
import { Modal, Space, Button, Table, Tag, Select, DatePicker, Tooltip } from 'antd';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';
import { CloseCircleOutlined } from '@ant-design/icons';

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
    const [farmers, setFarmers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        fetchFarmers();
        fetchWarehouses();
        fetchConsignments(pagination.current, pagination.pageSize);
    }, []);

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
            const response = await api.request('get', '/api/consignment');
            const { data } = response;
            let filteredConsignments = data;

            setConsignments(filteredConsignments);

            setPagination({
                current: page,
                pageSize,
                total: filteredConsignments.length,
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
            dataIndex: ['transporterId', 'transportAgency'],
            key: 'transporterId',
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
                    <Button disabled={record.transferred.toLowerCase() === 'yes'} onClick={() => handleDeleteConsignment(record._id)} type="danger">
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Select
                    placeholder="Select Farmer"
                    style={{ width: 200, marginRight: 8 }}
                    onChange={(value) => {
                        setSelectedFarmer(value);
                    }}
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

                <DatePicker.RangePicker
                    style={{ marginLeft: 8 }}
                    onChange={(dates) => setSelectedDateRange(dates)}
                    value={selectedDateRange}
                />

                {selectedFarmer || selectedWarehouse || selectedDateRange ? (
                    <Button
                        type="primary"
                        onClick={clearFilters}
                        style={{ marginLeft: 8 }}
                        icon={<CloseCircleOutlined/>}
                    >
                        Clear Filter
                    </Button>
                ) : null}



            </div>
            <CustomTable
                downloadButtonText="Export"
                downloadFileName="Consignments"
                data={consignments.filter((consignment) => {
                    const consignmentDate = new Date(consignment.createdAt);
                    return ((!selectedFarmer || consignment.farmerId._id === selectedFarmer)
                        && (!selectedWarehouse || consignment.warehouseId._id === selectedWarehouse)
                        && (!selectedDateRange || (consignmentDate >= selectedDateRange[0] && consignmentDate <= selectedDateRange[1])));
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

export default Consignments;
