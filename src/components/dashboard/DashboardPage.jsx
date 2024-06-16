import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Select, DatePicker, Space } from 'antd';
import './DashboardPage.css';
import api from '../../utils/api';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from 'chart.js';
import DashboardCard from './DashboardCard';
import moment from 'moment';
import { CalendarOutlined, AppstoreOutlined, EnvironmentOutlined } from '@ant-design/icons';

ChartJS.register(ArcElement, Tooltip, Legend, ...registerables);
const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [commodityStats, setCommodityStats] = useState([]);
  const [warehouseStats, setWarehouseStats] = useState([]);
  const [consignments, setConsignments] = useState([]);
  const [selectedCommodities, setSelectedCommodities] = useState(['All Commodities']);
  const [selectedWarehouses, setSelectedWarehouses] = useState(['All Warehouses']);
  const [dateRange, setDateRange] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [stockIns, setStockIns] = useState([]);
  const [stockOuts, setStockOuts] = useState([]);
  const [depotCash, setDepotCash] = useState([]);

  let userData = { user: { name: "", email: "", contact: "", location: "", role: "" } };
  try {
    userData = JSON.parse(localStorage.getItem('user')) || { user: { name: "", email: "", contact: "", location: "", role: "" } };
  } catch (error) {

  }
  const { name, role } = userData.user;


  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await api.request('get', '/api/warehouse');
        const { data } = response;
        setWarehouses(data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    fetchWarehouses();
  }, []);

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await api.request('get', '/api/commodity');
        const { data } = response;
        setCommodities(data);
      } catch (error) {
        console.error('Error fetching commodities:', error);
      }
    };

    fetchCommodities();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.request('get', '/api/dashboard');
        setDashboardData(response.data);
        setCommodityStats(response.data.stockInCommodityStats);
        setWarehouseStats(response.data.stockInWarehouseWiseStats);
        setConsignments(response.data.consignmentData);
        setStockIns(response.data.stockInData);
        setStockOuts(response.data.stockOutData);
        setDepotCash(response.data.depotCashData);
      } catch (error) {
        console.error('Error fetching dashboardData:', error);
      }
    };

    fetchDashboard();
  }, []);

  const handleCommoditiesChange = (value) => {
    if (value.includes('All Commodities') && value.length > 1) {
      setSelectedCommodities(value.filter((item) => item !== 'All Commodities'));
    } else if (value.length === 0) {
      setSelectedCommodities(['All Commodities']);
    } else {
      setSelectedCommodities(value);
    }
  };

  const handleWarehouseChange = (value) => {
    if (value.includes('All Warehouses') && value.length > 1) {
      setSelectedWarehouses(value.filter((item) => item !== 'All Warehouses'));
    } else if (value.length === 0) {
      setSelectedWarehouses(['All Warehouses']);
    } else {
      setSelectedWarehouses(value);
    }
  };


  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const filteredConsignments = consignments.filter((consignment) => {
    const consignmentDate = normalizeDate(consignment.createdAt);
    let dateRangeMatch = true;
    if (dateRange) {
      const [start, end] = dateRange.map(date => normalizeDate(date));
      dateRangeMatch = consignmentDate >= start && consignmentDate <= end;
    }
    return (
      (selectedWarehouses.includes('All Warehouses') || selectedWarehouses.includes(consignment.warehouseId)) &&
      (selectedCommodities.includes('All Commodities') || consignment.commodity.some((commodity) => selectedCommodities.includes(commodity.commodityId))) &&
      (dateRangeMatch));
  });


  const commodityTotals = {};
  filteredConsignments.forEach((consignment) => {
    consignment.commodity.forEach((commodityItem) => {
      const commodityId = commodityItem.commodityId;
      if (selectedCommodities.includes('All Commodities') || selectedCommodities.includes(commodityId)) {
        commodityTotals[commodityId] = (commodityTotals[commodityId] || 0) + commodityItem.amount;
      }
    });
  });

  const totalAmounts = Object.values(commodityTotals).reduce((acc, amount) => acc + amount, 0);

  const filteredStockIns = stockIns.filter((stockIn) => {
    return (
      (selectedWarehouses.includes('All Warehouses') || selectedWarehouses.includes(stockIn.warehouseId)) &&
      (selectedCommodities.includes('All Commodities') || selectedCommodities.includes(stockIn.commodityId)));
  });

  const filteredStockOuts = stockOuts.filter((stockOut) => {
    const stockOutsDate = normalizeDate(stockOut.createdAt);
    let dateRangeMatch = true;
    if (dateRange) {
      const [start, end] = dateRange.map(date => normalizeDate(date));
      dateRangeMatch = stockOutsDate >= start && stockOutsDate <= end;
    }
    return (
      (selectedWarehouses.includes('All Warehouses') || selectedWarehouses.includes(stockOut.warehouseId)) &&
      (selectedCommodities.includes('All Commodities') || selectedCommodities.includes(stockOut.commodityId)) &&
      (dateRangeMatch));
  });

  const filteredDepotCash = depotCash.filter((cash) => {
    return (
      selectedWarehouses.includes('All Warehouses') || selectedWarehouses.includes(cash.warehouseId)
    );
  });

  const commodityData = {
    labels: commodityStats.map((stat) => stat._id),
    datasets: [
      {
        data: commodityStats.map((stat) => stat.totalQuantity),
        backgroundColor: commodityStats.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      },
    ],
  };

  const warehouseData = {
    labels: warehouseStats.map((stat) => `${stat._id.warehouseName} - ${stat._id.commodityName}`),
    datasets: [
      {
        data: warehouseStats.map((stat) => stat.totalQuantity),
        backgroundColor: warehouseStats.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      },
    ],
  };

  const depotCashData = {
    labels: filteredDepotCash.map((item) => {
      const warehouse = warehouses.find((warehouse) => warehouse._id === item.warehouseId);
      return warehouse ? warehouse.name : null;
    }),
    datasets: [
      {
        label: 'Depot Cash Amount',
        data: filteredDepotCash.map((item) => item.closingAmount),
        backgroundColor: warehouseStats.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      },
    ],
  };

  const consignmentsByDate = {};
  filteredConsignments.forEach((consignment) => {
    const consignmentDate = moment(consignment.createdAt).format('YYYY-MM-DD');
    if (consignmentsByDate[consignmentDate]) {
      consignmentsByDate[consignmentDate]++;
    } else {
      consignmentsByDate[consignmentDate] = 1;
    }
  });

  const stockInsByDate = {};
  let totalStockInQuantity = 0;
  filteredStockIns.forEach((stockIn) => {
    const stockInDate = moment(stockIn.createdAt).format('YYYY-MM-DD');
    totalStockInQuantity = totalStockInQuantity + stockIn.totalQuantity;
    if (stockInsByDate[stockInDate]) {
      stockInsByDate[stockInDate]++;
    } else {
      stockInsByDate[stockInDate] = 1;
    }
  });

  const stockOutsByDate = {};
  filteredStockOuts.forEach((stockOut) => {
    const stockOutDate = moment(stockOut.createdAt).format('YYYY-MM-DD');
    if (stockOutsByDate[stockOutDate]) {
      stockOutsByDate[stockOutDate]++;
    } else {
      stockOutsByDate[stockOutDate] = 1;
    }
  });

  const consignmentBarData = {
    labels: Object.keys(consignmentsByDate),
    datasets: [
      {
        label: 'Consignments',
        data: Object.values(consignmentsByDate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const stockInBarData = {
    labels: Object.keys(stockInsByDate),
    datasets: [
      {
        label: 'StockIns',
        data: Object.values(stockInsByDate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  }

  const stockOutBarData = {
    labels: Object.keys(stockOutsByDate),
    datasets: [
      {
        label: 'StockOuts',
        data: Object.values(stockOutsByDate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  }

  const totalAmount = filteredConsignments.reduce((acc, consignment) => acc + consignment.totalAmount, 0);
  const totalQuantity = filteredConsignments.reduce((acc, consignment) => acc + consignment.commodity.reduce((sum, item) => sum + item.totalQuantity, 0), 0);
  const totalBags = filteredConsignments.reduce((acc, consignment) => acc + consignment.commodity.reduce((sum, item) => sum + item.bags.reduce((count, bag) => count + bag.noOfBags, 0), 0), 0);
  const totalDepotCashs = filteredDepotCash.reduce((total, item) => total + item.closingAmount, 0);
  const totalCommodities = commodities.length;
  const roundedTotalAmount = totalAmounts.toFixed(2);
  const totalDepotCash = totalDepotCashs.toFixed(2);

  const totalQuantityByDate = filteredConsignments.reduce((acc, consignment) => {
    const date = moment(consignment.createdAt).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + consignment.commodity.reduce((sum, item) => sum + item.totalQuantity, 0);
    return acc;
  }, {});

  const totalBagsByDate = filteredConsignments.reduce((acc, consignment) => {
    const date = moment(consignment.createdAt).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + consignment.commodity.reduce((sum, item) => sum + item.bags.reduce((count, bag) => count + bag.noOfBags, 0), 0);
    return acc;
  }, {});

  const totalAmountByDate = filteredConsignments.reduce((acc, consignment) => {
    const date = moment(consignment.createdAt).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + consignment.totalAmount;
    return acc;
  }, {});

  const totalQuantityLineData = {
    labels: Object.keys(totalQuantityByDate),
    datasets: [
      {
        label: 'Total Quantity',
        data: Object.values(totalQuantityByDate),
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Light blue fill color
        borderColor: 'rgba(54, 162, 235, 1)',       // Darker blue border color
        tension: 0.1,
      },
    ],
  };

  const totalBagsLineData = {
    labels: Object.keys(totalBagsByDate),
    datasets: [
      {
        label: 'Total Number of Bags',
        data: Object.values(totalBagsByDate),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Light teal fill color
        borderColor: 'rgba(75, 192, 192, 1)',       // Darker teal border color
        tension: 0.1,
      },
    ],
  };

  const totalAmountLineData = {
    labels: Object.keys(totalAmountByDate),
    datasets: [
      {
        label: 'Total Amount',
        data: Object.values(totalAmountByDate),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  const consignment = {
    consignmentCount: filteredConsignments.length,
    totalStockIns: totalStockInQuantity,
    totalBags: totalBags,
    totalDepotCash: totalDepotCash,
    totalAmount: roundedTotalAmount,
    name: name,
    role: role
  }

  const controlStyle = {
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  return (
    <>
      <div className="dashboard-page">
        <div className="top-right-controls">
          <Space direction="horizontal" size="small" style={{ width: '100%', justifyContent: 'end' }}>
            <RangePicker
              className="custom-range-picker"
              onChange={(dates) => setDateRange(dates)}
              value={dateRange}
              suffixIcon={<CalendarOutlined />}
              placeholder={['Start Date', 'End Date']}
              style={{
                ...controlStyle,
                padding: '4px 8px',
                width: '300px',
                borderRadius: '4px',
                border: '1px solid #d9d9d9',
              }}
              inputReadOnly={true}
              format="YYYY-MM-DD"
            />

            <Select
              mode="multiple"
              value={selectedCommodities}
              onChange={handleCommoditiesChange}
              style={controlStyle}
              suffixIcon={<AppstoreOutlined />}
              bordered={true}
              placeholder="Select Commodities"
              maxTagCount={2}
              maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
            >
              <Option value="All Commodities" style={{ fontWeight: 'bold' }}>All Commodities</Option>
              {commodities.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>

            <Select
              mode="multiple"
              value={selectedWarehouses}
              onChange={handleWarehouseChange}
              style={controlStyle}
              suffixIcon={<EnvironmentOutlined />}
              bordered={true}
              placeholder="Select Warehouses"
              maxTagCount={2}
              maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
            >
              <Option value="All Warehouses">All Warehouses</Option>
              {warehouses.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Space>
        </div>

        <div>
          <DashboardCard consignment={consignment} />
        </div>

        <div className='line-chart-card'>
          <div className='line-chart-container'>
            <div className='line-chart'>
              <h2>ConsignmentIn Stats (Per Day)</h2>
              <BarChart data={consignmentBarData} />
            </div>

            <div className='line-chart'>
              <h2>StockOut Stats (Per Day)</h2>
              <BarChart data={stockOutBarData} />
            </div>

            <div className="line-chart" style={{ margin: "90px 90px 90px 120px" }}>
              <h2>StockIn Commodity Stats (In Kgs)</h2>
              <DoughnutChart data={commodityData} />
            </div>

            <div className="line-chart" style={{ margin: "90px 90px 90px 120px" }}>
              <h2>StockIn Warehouse-Wise Stats (In Kgs)</h2>
              <DoughnutChart data={warehouseData} />
            </div>
          </div>
        </div>

        <div className='line-chart-card'>
          {dashboardData && (
            <Row gutter={[16, 16]} style={{ marginTop: "40px" }}>
              <Col xs={24} sm={12} md={6}>
                <Card className="dashboard-card card-blue">
                  <Statistic
                    title="Total Commodities"
                    value={totalCommodities}
                    valueStyle={{ fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="dashboard-card card-green">
                  <Statistic
                    title="Total Farmers"
                    value={dashboardData.totalFarmersCount}
                    valueStyle={{ fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="dashboard-card card-orange">
                  <Statistic
                    title="Total Transporters"
                    value={dashboardData.totalTransportersCount}
                    valueStyle={{ fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="dashboard-card card-green2">
                  <Statistic
                    title="Total Customers"
                    value={dashboardData.totalCustomersCount}
                    valueStyle={{ fontSize: '2rem' }}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </div>

        <div className='line-chart-card'>
          <div className='line-chart-container'>
            <div className='line-chart'>
              <h2>ConsignmentIn Quantity (Per Day)</h2>
              <BarChart data={totalQuantityLineData} />
            </div>

            <div className='line-chart'>
              <h2>ConsignmentIn Amount (Per Day)</h2>
              <BarChart data={totalAmountLineData} />
            </div>

            <div className='line-chart'>
              <h2>ConsignmentIn Bags (Per Day)</h2>
              <BarChart data={totalBagsLineData} />
            </div>

            <div className="line-chart" style={{ margin: "90px 90px 90px 120px" }}>
              <h2>DepotCash Warehouse-Wise Stats</h2>
              <DoughnutChart data={depotCashData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DoughnutChart = ({ data }) => {
  const options = {
    maintainAspectRatio: false,
    responsive: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

const BarChart = ({ data }) => {
  const options = {
    maintainAspectRatio: false,
    responsive: false,
    plugins: {
      legend: {
        position: false,
      },
    },
  };

  return <Bar data={data} options={options} height={400} width={550} />;
};

export default DashboardPage;
