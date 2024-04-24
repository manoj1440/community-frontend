import React from 'react';
import { Button, message } from 'antd';
import * as XLSX from 'xlsx';
import { FileExcelOutlined } from '@ant-design/icons';


const ExcelExport = ({ data, buttonText, fileName }) => {
    const handleExportExcel = () => {
        if (data && data.length <= 0) {
            message.error('There is no data to export');
            return;
        }

        const excludedKeys = [];

        const tempRows = data.map((r) => {
            const rowObject = {};
            Object.keys(r).forEach((key) => {
                if (!excludedKeys.includes(key)) {
                    rowObject[key] = r[key];
                }
            });
            return rowObject;
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
                marginBottom: '10px'
            }}
            onClick={handleExportExcel} type="primary">
            {buttonText || 'Export'}
        </Button>
    );
};

export default ExcelExport;
