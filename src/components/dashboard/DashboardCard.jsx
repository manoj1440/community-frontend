import React from 'react';
import { Card, Row, Col, Avatar, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const DashboardCard = ({
    consignment
}) => {

    return (
        <div style={{ background: '#fff' }}>
            <Card

                bordered={false}
                headStyle={{
                    background: 'linear-gradient(to right, #F1C9CF, #a5709c)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',

                }}
                bodyStyle={{
                    background: 'linear-gradient(to right, #f1c9cf, #a5709c)',
                    color: '#fff',
                }}
                style={{ marginBottom: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            >

                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1, textAlign: 'left', padding: '20px' }}>
                        <h2 style={{ fontSize: '34px', fontWeight: 'bold', margin: 0 }}>Welcome Back!</h2>
                        {/* <h5 style={{ fontSize: '18px', margin: '5px 0' }}>{consignment.name}</h5> */}
                        <h5 style={{ fontSize: '20px', margin: 0 }}>{consignment.role}</h5>
                    </div>

                    <div style={{ flex: 1, textAlign: 'right' }}>
                        <img src='/32.png' width={400} height={300} style={{ alignItems: 'end' }} />
                    </div>
                </div>

                <div style={{ height: '0.1px', background: '#fff', margin: '0px 0px' }} />

                <Row align="middle" style={{ margin: '0px 0px 5px 95px', marginLeft: '130px' }}>
                    <Col span={4} style={{ textAlign: 'center', fontSize: '24px', margin: '0', padding: '0' }}>
                        <h3>{consignment.consignmentCount}</h3>
                        <p style={{ fontSize: '16px', margin: '0', padding: '0', fontWeight: 900 }}>Consignments</p>
                    </Col>

                    <Col span={5} style={{ textAlign: 'center', fontSize: '24px', margin: '0', padding: '0' }}>
                        <h3>{consignment.totalStockIns}</h3>
                        <p style={{ fontSize: '16px', margin: '0', padding: '0', fontWeight: "900" }}>Total Stock In (In Kgs)</p>
                    </Col>

                    <Col span={4} style={{ textAlign: 'center', fontSize: '24px', margin: '0', padding: '0' }}>
                        <h3>{consignment.totalBags}</h3>
                        <p style={{ fontSize: '16px', margin: '0', padding: '0', fontWeight: 900 }}>Total Bags</p>
                    </Col>

                    <Col span={4} style={{ textAlign: 'center', fontSize: '24px', margin: '0', padding: '0' }}>
                        <h3>{consignment.totalDepotCash}</h3>
                        <p style={{ fontSize: '16px', margin: '0', padding: '0', fontWeight: 900 }}>Total DepotCash</p>
                    </Col>

                    <Col span={4} style={{ textAlign: 'center', fontSize: '24px', margin: '0', padding: '0' }}>
                        <h3>{consignment.totalAmount}</h3>
                        <p style={{ fontSize: '16px', margin: '0', padding: '0', fontWeight: 900 }}>Total Amount</p>
                    </Col>
                </Row>


            </Card>
        </div>
    );
};

export default DashboardCard;
