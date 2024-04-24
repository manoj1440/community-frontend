import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import api from '../../utils/api';

const UploadExcel = ({ endpoint, onSuccess, buttonText, dataKey }) => {
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            message.error('Please select a file to upload.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

            try {
                const response = await api.request('post', endpoint, { [dataKey]: jsonData });
                if (response.status) {
                    onSuccess();
                    setFile(null);
                    message.success('Bulk upload completed successfully.');
                } else {
                    message.error('An error occurred during bulk upload.');
                }

            } catch (error) {
                console.error('Error uploading users:', error);
                message.error('An error occurred during bulk upload.');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const beforeUpload = (file) => {
        setFile(file);
        return false; // Prevent automatic upload
    };

    return (
        <>
            <Upload
                style={{ marginLeft: 10 }}
                beforeUpload={beforeUpload} showUploadList={false}>
                <Button style={{ marginLeft: 10 }} icon={<UploadOutlined />}>{buttonText || 'Select File'}</Button>
            </Upload>
            <Button type="primary" onClick={handleUpload} style={{ marginLeft: 10 }}>
                Upload
            </Button>
        </>
    );
};

export default UploadExcel;
