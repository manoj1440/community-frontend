import React, { useState } from 'react';
import { Table, Button, Checkbox, Divider } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import ExcelExport from './ExcelExport';

const CustomTable = ({
    data,
    columns,
    downloadButtonText,
    downloadFileName,
    pagination,
    isFilter = false,
    fetchData,
    totalRecords
}) => {
    console.log("DATA", data)
    const [columnFilters, setColumnFilters] = useState({});
    const [currentPagination, setCurrentPagination] = useState(pagination || {});

    const onChangePagination = (pagination, filters) => {
        setCurrentPagination(pagination);
        if (fetchData) {
            fetchData(pagination.current, pagination.pageSize)
        }
        setColumnFilters({ ...filters });
    };
    
    const applyFilters = (data, filters) => {
        return data.filter((record) => {
            return Object.keys(filters).every((key) => {
                const filterValues = filters[key];
                if (!filterValues || filterValues.length === 0) return true; // No filter, include the record

                const recordValue = record[key];

                if (Array.isArray(recordValue)) {
                    return recordValue.some((value) => filterValues.includes(value));
                }

                return filterValues.includes(recordValue);
            });
        });
    };

    const clearFilter = (dataIndex) => {
        const updatedColumnFilters = { ...columnFilters };
        delete updatedColumnFilters[dataIndex];
        setColumnFilters(updatedColumnFilters);
        const filteredData = applyFilters(data, updatedColumnFilters);
        // Update the table data
        onChangePagination(currentPagination, updatedColumnFilters);
    };

    const isFiltered = (dataIndex) => {
        return columnFilters.hasOwnProperty(dataIndex) && columnFilters[dataIndex].length > 0;
    };

    const generateColumnFilter = (dataIndex, tableData) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys }) => {
            // Extract unique values for the specific column from tableData
            const columnValues = Array.from(
                new Set(tableData.map((record) => record && record[dataIndex] && record[dataIndex]))
            ).filter((value) => value !== null);

            const handleCheckboxChange = (values) => {
                setSelectedKeys(values);
                // Convert string values back to booleans and null if necessary
                const selectedValues = values.map((value) =>
                    value === 'null' ? null : value === 'true' ? true : value === 'false' ? false : value
                );
                // Update the filter with the selected values
                setColumnFilters((prevFilters) => ({
                    ...prevFilters,
                    [dataIndex]: selectedValues,
                }));
            };

            return (
                <div style={{ padding: 8 }}>
                    <Checkbox.Group
                        style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
                        options={columnValues.map((value) => value && value.toString())}
                        value={selectedKeys}
                        onChange={handleCheckboxChange}
                    />
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                        type="default"
                        onClick={() => {
                            setSelectedKeys([]); // Clear selected keys (checkboxes)
                            clearFilter(dataIndex); // Clear the filter
                        }}
                        size="small"
                        style={{ width: '100%', marginRight: 8 }}
                    >
                        Clear Filter
                    </Button>
                </div>
            );
        },
        filterIcon: (filtered) => (
            <FilterOutlined
                style={{ color: isFiltered(dataIndex) ? '#1890ff' : undefined }}
            />
        ),
    });



    const enhancedColumns = columns.map((column) =>
        column.key === 'actions'
            ? column
            : {
                ...column,
                ...generateColumnFilter(column.dataIndex, data),
            }
    );

    const filteredData = applyFilters(data, columnFilters);

    return (
        <>
            <ExcelExport
                data={filteredData}
                buttonText={downloadButtonText}
                fileName={downloadFileName}
            />
            <Table
                dataSource={isFilter ? [...filteredData] : data}
                columns={isFilter ? enhancedColumns : columns}
                pagination={{ ...currentPagination, ...(totalRecords && { total: totalRecords }) }}
                onChange={(pagination, filters) => {
                    onChangePagination(pagination, filters);
                }}
            />
        </>
    );
};

export default CustomTable;
