import React from 'react';
import { Button, message } from 'antd';
import * as XLSX from 'xlsx';
import { FileExcelOutlined } from '@ant-design/icons';

const TransactionExcelExport = ({ data, warehouses, buttonText = 'Export Transactions', fileName = 'Warehouse_Transactions' }) => {
    const handleExportExcel = () => {
        if (!data || data.length === 0) {
            message.error('There is no data to export');
            return;
        }

        // Create a map of warehouse IDs to warehouse names
        const warehouseMap = {};
        warehouses.forEach(warehouse => {
            warehouseMap[warehouse._id] = warehouse.name;
        });

        const tempRows = data.map((r, index) => {
            const rowObject = {
                'Serial No': index + 1,
                'Entity Name': r.entityId?.name || 'N/A',
                'Warehouse Name': warehouseMap[r.warehouseId] || 'N/A',
                'Date': new Date(r.date).toLocaleDateString(),
                'Amount': r.amount,
                'Type': r.type,
            };
            return rowObject;
        });

        const worksheet = XLSX.utils.json_to_sheet(tempRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
        XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
    };

    return (
        <Button
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
            type="primary"
        >
            {buttonText}
        </Button>
    );
};

export default TransactionExcelExport;
