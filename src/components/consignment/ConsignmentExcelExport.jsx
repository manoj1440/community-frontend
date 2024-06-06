import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import * as XLSX from 'xlsx';
import { FileExcelOutlined } from '@ant-design/icons';
import { readableDate } from '../../utils/config';

const ExcelExport = ({ data, buttonText, fileName, prices }) => {


    const getRateForCommodity = (commodityName, warehouseName) => {
        const commodityPrice = prices.find((price) => {
            const priceCommodityName = price.commodityId?.name;
            const priceWarehouseName = price.warehouseId?.name;

            return priceCommodityName === commodityName && priceWarehouseName === warehouseName;
        });
        return commodityPrice ? commodityPrice.historicalPrices.slice(-1)[0].price : 0; // Get the latest price
    };

    const handleExportExcel = () => {
        if (!data || data.length <= 0) {
            message.error('There is no data to export');
            return;
        }

        const runningTotals = {};

        const tempRows = data.flatMap((r) => {
            const commodityDetails = r.commodity.map((c) => ({
                commodityName: c.commodityId ? c.commodityId.name : '',
                noOfBags: c.bags ? c.bags[0].noOfBags : 0,
                weight: c.bags ? c.bags[0].weight : 0,
                quantity: c.bags ? c.bags[0].quantity : 0,
                amount: c.amount || 0,
                warehouseName: r.warehouseId ? r.warehouseId.name : ''
            }));

            return commodityDetails.map((detail) => {
                const { commodityName, noOfBags, weight, amount, warehouseName } = detail;

                if (!runningTotals[commodityName]) {
                    runningTotals[commodityName] = { bags: 0, kgs: 0 };
                }

                const openingStockBags = runningTotals[commodityName].bags;
                const openingStockKgs = runningTotals[commodityName].kgs;

                runningTotals[commodityName].bags += noOfBags;
                runningTotals[commodityName].kgs += weight;

                return {
                    "Date": readableDate(r.createdAt),
                    "Farmer Name": r.farmerId ? r.farmerId.name : '',
                    "Warehouse Name": warehouseName,
                    "Transporter Name": r.transporterId ? r.transporterId.driverName : '',
                    "Item": commodityName,
                    'Opening Stock (Bags)': openingStockBags,
                    'Opening Stock (Kgs)': openingStockKgs,
                    'No of Bags': noOfBags,
                    'Kgs': weight,
                    'Price Paid to Farmer': amount,
                    'Rate as per Calculation': getRateForCommodity(commodityName, warehouseName),
                    'Transferred': r.transferred,
                    'consignmentId': r.consignmentId,
                };
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(tempRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName || 'data');
        XLSX.writeFile(workbook, `${fileName || 'data'}.xlsx`, { compression: true });
    };

    return (
        <Button
            icon={<FileExcelOutlined />}
            style={{
                float: 'right',
                marginBottom: '10px',
            }}
            onClick={handleExportExcel}
            type="primary"
        >
            {buttonText || 'Export'}
        </Button>
    );
};

export default ExcelExport;
