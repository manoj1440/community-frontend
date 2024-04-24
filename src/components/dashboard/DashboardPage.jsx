import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Progress } from 'antd';
import './DashboardPage.css';
import api from '../../utils/api';
import CustomTable from '../common/CustomTable';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [userOverviewDataSource, setUserOverviewDataSource] = useState([]);

  const fetchDashboard = async () => {
    try {
      const response = await api.request('get', '/api/dashboard');
      setDashboardData(response.data);
      const formattedUserOverview = response.data.userOverview.map(user => ({
        key: user._id,
        name: user.name,
        role: user.role,
        batchesCreated: user.numBatchesCreated,
        userBatches: user.userBatches,
      }));
      setUserOverviewDataSource(formattedUserOverview);
    } catch (error) {
      console.error('Error fetching dashboardData:', error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const userOverviewColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Batches Assigned',
      dataIndex: 'batchesCreated',
      key: 'batchesCreated',
    },
    {
      title: 'Total Panels',
      dataIndex: 'userBatches',
      key: 'userBatches',
      render: (userBatches) => userBatches && userBatches.length > 0 ? userBatches[0].panels && userBatches[0].panels.length : 'NA'
    },
    {
      title: 'Location',
      dataIndex: 'userBatches',
      key: 'userBatches',
      render: (userBatches) => userBatches && userBatches.length > 0 ? userBatches[0].DeliveryLocation : 'NA'
    },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Statistics</h1>
      {/* {dashboardData && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-blue">
              <Statistic
                title="Total Batches"
                value={dashboardData.totalBatches}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-green">
              <Statistic
                title="Total Panels"
                value={dashboardData.totalPanels}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-orange">
              <Statistic
                title="Total Panels In Batch"
                value={dashboardData.totalPanelsInBatch}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-green2">
              <Statistic
                title="Total Received Panels"
                value={dashboardData.totalReceivedPanels}
                valueStyle={{ fontSize: '2rem' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="dashboard-card card-purple">
              <div style={{
                marginTop: '-2rem',
                color: 'rgba(0, 0, 0, 0.45)'
              }}>Received/Sent Panels</div>
              <Progress
                type="dashboard"
                percent={(dashboardData.totalReceivedPanels / dashboardData.totalPanelsInBatch) * 100}
                format={() => (
                  <span>
                    {dashboardData.totalReceivedPanels} / {dashboardData.totalPanelsInBatch}
                  </span>
                )}
              />
            </Card>
          </Col>
        </Row>
      )} */}
      {/* {dashboardData && dashboardData.userOverview && dashboardData.userOverview.length > 0 && (
        <div className="user-overview-table">
          <h2>Customers Info </h2>
          <CustomTable
            downloadButtonText="Export"
            downloadFileName="Users"
            data={userOverviewDataSource}
            isFilter={false}
            columns={userOverviewColumns}
            pagination={{
              pageSize: 6,
              hideOnSinglePage: true,
            }}
          />
        </div>
      )} */}
    </div>
  );
};

export default DashboardPage;
