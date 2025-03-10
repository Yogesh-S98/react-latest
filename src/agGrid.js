import React, { useState } from "react";
import { Table } from "antd";

const TableComponent = ({ columns, data, handleTable, pagination }) => {
    
    const handleTableChange = (pagination) => {
      handleTable(pagination);
    };

    return (
    <div className="overflow-x-auto">
        <Table 
          rowKey="id"
          pagination={pagination}
          bordered
          onChange={handleTableChange}
          columns={columns} 
          dataSource={data}>
        </Table>
      {/* <table className="w-100 border border-gray-300 rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="py-2 px-4 border text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border hover:bg-gray-100">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-2 px-4 border">
                    { col.render ? col.render(row) : row[col.accessor] }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default TableComponent;
