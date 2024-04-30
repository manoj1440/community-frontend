import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import './DashboardPage.css';
import api from '../../utils/api';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [commodityStats, setCommodityStats] = useState([]);
  const [warehouseStats, setWarehouseStats] = useState([]);

  const fetchDashboard = async () => {
    try {
      const response = await api.request('get', '/api/dashboard');
      setDashboardData(response.data);
      setCommodityStats(response.data.stockInCommodityStats);
      setWarehouseStats(response.data.stockInWarehouseWiseStats);
    } catch (error) {
      console.error('Error fetching dashboardData:', error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);



  const commodityData = {
    labels: commodityStats.map(stat => stat._id),
    datasets: [
      {
        data: commodityStats.map(stat => stat.totalQuantity),
        backgroundColor: commodityStats.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      },
    ],
  };

  const warehouseData = {
    labels: warehouseStats.map(stat => `${stat._id.warehouseName} - ${stat._id.commodityName}`),
    datasets: [
      {
        data: warehouseStats.map(stat => stat.totalQuantity),
        backgroundColor: warehouseStats.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      },
    ],
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Statistics</h1>
      {dashboardData && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-blue">
              <Statistic
                title="Total Stock In (In Kgs)"
                value={dashboardData.totalStockInQuantity}
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

      <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', textAlign: 'center' }}>

        <div style={{ width: '450px' }}>
          <h2>StockIn Commodity Stats (In Kgs)</h2>
          <Doughnut data={commodityData} />
        </div>

        <div style={{ width: '450px' }}>
          <h2>StockIn Warehouse-Wise Stats  (In Kgs)</h2>
          <Doughnut data={warehouseData} />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
