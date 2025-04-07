import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Select, DatePicker, Space } from 'antd';
import './DashboardPage.css';
import api from '../../utils/api';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from 'chart.js';
import DashboardCard from './DashboardCard';
import { CalendarOutlined, AppstoreOutlined, EnvironmentOutlined } from '@ant-design/icons';

ChartJS.register(ArcElement, Tooltip, Legend, ...registerables);
const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardPage = () => {
  const [selectedCommodities, setSelectedCommodities] = useState(['All Commodities']);
  const [selectedWarehouses, setSelectedWarehouses] = useState(['All Warehouses']);
  const [dateRange, setDateRange] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [dashboardStaticValueData, setDashboardStaticValueData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [stockOutBarData, setStockOutBarData] = useState([]);
  const [stockInCommodityStats, setStockInCommodityStats] = useState([]);
  const [stockInWarehouseData, setStockInWarehouseData] = useState([]);
  const [totalQuantityLineData, setTotalQuantityLineData] = useState({});
  const [depotCashData, setDepotCashData] = useState({});
  const [totalBagsLineData, setTotalBagsLineData] = useState({});
  const [totalAmountLineData, setTotalAmountLineData] = useState({});
  const [staticValues, setStaticValues] = useState({});
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('2025-2026');

  let userData = { user: { name: "", email: "", contact: "", location: "", role: "" } };
  try {
    userData = JSON.parse(localStorage.getItem('user')) || { user: { name: "", email: "", contact: "", location: "", role: "" } };
  } catch (error) {

  }
  const { name, role } = userData.user;

  useEffect(() => {
    const fetchWarehousesAndCommodities = async () => {
      try {
        const [warehousesResponse, commoditiesResponse] = await Promise.all([
          api.request('get', '/api/warehouse'),
          api.request('get', '/api/commodity'),
        ]);

        setWarehouses(warehousesResponse.data);
        setCommodities(commoditiesResponse.data);
      } catch (error) {
        console.error('Error fetching warehouses and commodities:', error);
      }
    };

    fetchWarehousesAndCommodities();
  }, []);

  useEffect(() => {
    const fetchStaticValues = async () => {
      try {
        const staticValueResponse = await api.request('get', `/api/dashboard/dashboard-static-values`);
        setStaticValues(staticValueResponse.data);
      } catch (error) {
        console.error('Error fetching static values:', error);
      }
    };

    fetchStaticValues();
  }, []);

  useEffect(() => {
    const fetchDashboardGraphs = async () => {
      try {

        let startDate = '';
        let endDate = '';

        if (selectedFinancialYear) {
          const selectedYear = financialYears.find(y => y.value === selectedFinancialYear);
          if (selectedYear) {
            startDate = selectedYear.startDate;
            endDate = selectedYear.endDate;
          }
        } else if (dateRange) {
          startDate = dateRange[0]?.format('YYYY-MM-DD');
          endDate = dateRange[1]?.format('YYYY-MM-DD');
        }


        const serializedWarehouses = selectedWarehouses.includes('All Warehouses')
          ? ''
          : selectedWarehouses.join(',');

        const serializedCommodities = selectedCommodities.includes('All Commodities')
          ? ''
          : selectedCommodities.join(',');

        const [dashboardGraphsResponse, dashboardGraphsSecondSetResponse] = await Promise.all([
          api.request('get', `/api/dashboard/dashboard-graphs?warehouses=${serializedWarehouses}&commodities=${serializedCommodities}&startDate=${startDate}&endDate=${endDate}`),
          api.request('get', `/api/dashboard/dashboard-graphs-secondset?warehouses=${serializedWarehouses}&commodities=${serializedCommodities}&startDate=${startDate}&endDate=${endDate}`)
        ]);

        setBarChartData(dashboardGraphsResponse.data.barChartData);
        setStockOutBarData(dashboardGraphsResponse.data.stockOutBarData);
        setStockInCommodityStats(dashboardGraphsResponse.data.stockInCommodityStats);
        setStockInWarehouseData(dashboardGraphsResponse.data.StockInWarehouseData);

        setTotalQuantityLineData(dashboardGraphsSecondSetResponse.data.totalQuantityLineData);
        setDepotCashData(dashboardGraphsSecondSetResponse.data.depotCashData);
        setTotalBagsLineData(dashboardGraphsSecondSetResponse.data.totalBagsLineData);
        setTotalAmountLineData(dashboardGraphsSecondSetResponse.data.totalAmountLineData);
      } catch (error) {
        console.error('Error fetching dashboard graphs:', error);
      }
    };

    fetchDashboardGraphs();
  }, [selectedCommodities, selectedWarehouses, dateRange, selectedFinancialYear]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {

        let startDate = '';
        let endDate = '';

        if (selectedFinancialYear) {
          const selectedYear = financialYears.find(y => y.value === selectedFinancialYear);
          if (selectedYear) {
            startDate = selectedYear.startDate;
            endDate = selectedYear.endDate;
          }
        } else if (dateRange) {
          startDate = dateRange[0]?.format('YYYY-MM-DD');
          endDate = dateRange[1]?.format('YYYY-MM-DD');
        }

        const serializedWarehouses = selectedWarehouses.includes('All Warehouses')
          ? ''
          : selectedWarehouses.join(',');

        const serializedCommodities = selectedCommodities.includes('All Commodities')
          ? ''
          : selectedCommodities.join(',');

        const formattedDateRange = dateRange
          ? `${dateRange[0].format('YYYY-MM-DD')},${dateRange[1].format('YYYY-MM-DD')}`
          : '';

        const dashboardStatsResponse = await api.request('get', `/api/dashboard/get-dashboard-stats?warehouses=${serializedWarehouses}&commodities=${serializedCommodities}&startDate=${startDate}&endDate=${endDate}`);
        setDashboardStaticValueData(dashboardStatsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, [selectedCommodities, selectedWarehouses, dateRange, selectedFinancialYear]);

  const consignmentBarData = {
    labels: barChartData.labels || [],
    datasets: [
      {
        label: 'Consignments',
        data: (barChartData.datasets && barChartData.datasets[0]?.data) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const stockOutData = {
    labels: stockOutBarData.labels || [],
    datasets: [
      {
        label: 'StockOuts',
        data: (stockOutBarData.datasets && stockOutBarData.datasets[0]?.data) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const commodityData = {
    labels: stockInCommodityStats.labels || [],
    datasets: [
      {
        data: (stockInCommodityStats.datasets && stockInCommodityStats.datasets[0]?.data) || [],
        backgroundColor: (stockInCommodityStats.datasets && stockInCommodityStats.datasets[0]?.backgroundColor) || [],
      },
    ],
  };

  const warehouseData = {
    labels: stockInWarehouseData.labels || [],
    datasets: [
      {
        data: (stockInWarehouseData.datasets && stockInWarehouseData.datasets[0]?.data) || [],
        backgroundColor: (stockInWarehouseData.datasets && stockInWarehouseData.datasets[0]?.backgroundColor) || [],
      },
    ],
  };

  const totalQuantityChartData = {
    labels: totalQuantityLineData.labels || [],
    datasets: [
      {
        label: 'Total Quantity',
        data: (totalQuantityLineData.datasets && totalQuantityLineData.datasets[0]?.data) || [],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
    ],
  };

  const totalAmountChartData = {
    labels: totalAmountLineData.labels || [],
    datasets: [
      {
        label: 'Total Amount',
        data: (totalAmountLineData.datasets && totalAmountLineData.datasets[0]?.data) || [],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  const totalBagsChartData = {
    labels: totalBagsLineData.labels || [],
    datasets: [
      {
        label: 'Total Number of Bags',
        data: (totalBagsLineData.datasets && totalBagsLineData.datasets[0]?.data) || [],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const depotCashChartData = {
    labels: depotCashData.labels || [],
    datasets: [
      {
        label: 'Depot Cash Amount',
        data: (depotCashData.datasets && depotCashData.datasets[0]?.data) || [],
        backgroundColor: depotCashData.datasets
          ? depotCashData.datasets[0].backgroundColor
          : [],
      },
    ],
  };

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

  const consignment = {
    consignmentCount: dashboardStaticValueData.consignmentCount,
    totalStockIns: dashboardStaticValueData.totalStockIn,
    totalBags: dashboardStaticValueData.totalBags,
    totalDepotCash: dashboardStaticValueData.totalDepotCash,
    totalAmount: dashboardStaticValueData.totalAmount,
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

  const financialYears = [
    { value: '2024-2025', label: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31' },
    { value: '2025-2026', label: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31' },
  ];

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);

    if (dates === null) {
      setSelectedFinancialYear("2025-2026");
    } else {
      setSelectedFinancialYear(null);
    }
  };

  const handleFinancialYearChange = (value) => {
    setSelectedFinancialYear(value);
    setDateRange(null);
  };

  return (
    <>
      <div className="dashboard-page">
        <div className="top-right-controls">
          <Space direction="horizontal" size="small" style={{ width: '100%', justifyContent: 'end' }}>

            <Select
              placeholder="Select Financial Year"
              style={{ width: 130, marginRight: 8 }}
              onChange={handleFinancialYearChange}
              value={selectedFinancialYear}
            >
              {financialYears.map(year => (
                <Option key={year.value} value={year.value}>{year.label}</Option>
              ))}
            </Select>

            <RangePicker
              className="custom-range-picker"
              onChange={handleDateRangeChange}
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
              <BarChart data={stockOutData} />
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
          {staticValues && staticValues.counts && (
            <Row gutter={[16, 16]} style={{ marginTop: "40px" }}>
              <Col xs={24} sm={12} md={6}>
                <Card className="dashboard-card card-blue">
                  <Statistic
                    title="Total Commodities"
                    value={staticValues.counts.commoditiesCount}
                    valueStyle={{ fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="dashboard-card card-green">
                  <Statistic
                    title="Total Farmers"
                    value={staticValues.counts.farmersCount}
                    valueStyle={{ fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="dashboard-card card-orange">
                  <Statistic
                    title="Total Transporters"
                    value={staticValues.counts.transportersCount}
                    valueStyle={{ fontSize: '2rem' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card className="dashboard-card card-green2">
                  <Statistic
                    title="Total Customers"
                    value={staticValues.counts.customersCount}
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
              <BarChart data={totalQuantityChartData} />
            </div>

            <div className='line-chart'>
              <h2>ConsignmentIn Amount (Per Day)</h2>
              <BarChart data={totalAmountChartData} />
            </div>

            <div className='line-chart'>
              <h2>ConsignmentIn Bags (Per Day)</h2>
              <BarChart data={totalBagsChartData} />
            </div>

            <div className="line-chart" style={{ margin: "90px 90px 90px 120px" }}>
              <h2>DepotCash Warehouse-Wise Stats</h2>
              <DoughnutChart data={depotCashChartData} />
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
