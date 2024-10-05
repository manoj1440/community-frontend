import React from 'react';
import { Table } from 'antd';


const GridTable = ({
    data,
    columns,
    pagination,
    fetchConsignments
}) => {


    return (
        <>
            <Table
                dataSource={data}
                columns={columns}
                pagination={{
                    ...pagination,
                    onChange: (page, pageSize) => {
                        fetchConsignments(page, pageSize); // Fetch consignments when page changes
                    }
                }}
            />
        </>
    );
};

export default GridTable;
