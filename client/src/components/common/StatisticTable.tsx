import React from "react";

import "../../assets/styles/components/StatisitcTable.scss";

type StatisticTableProps = {
  title: string;
  columnNames: { name: string }[];
  dataRows: { [key: string]: string }[];
  [key: string]: any;
};

const StatisticTable: React.FC = ({
  title,
  columnNames,
  dataRows,
}: StatisticTableProps) => {
  return (
    <div className="table-box">
      <h6>{title}</h6>

      <div className="table-outlier">
        <table>
          {
            <thead>
              <tr className="columns-title-box">
                {columnNames.map((col, index) => {
                  return (
                    <th className="column-title" key={index}>
                      {col.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
          }
          <tr className="line">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="3"
              width="100%"
              viewBox="0 0 320 2"
              fill="none"
            >
              <path
                d="M0.5 1L319.218 0.778839"
                stroke="#4B5563"
                strokeLinecap="square"
              />
            </svg>
          </tr>
          {
            <tbody className="columns-value-box">
              <div className="values">
                {dataRows.map((row, rowIndex) => (
                  // Map over rows
                  <tr key={rowIndex} className="single-row">
                    {Object.values(row).map((cell, cellIndex) => (
                      // Map over cells within each row
                      <td key={cellIndex} className="row-item">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </div>
            </tbody>
          }
        </table>
      </div>
    </div>
  );
};

export default StatisticTable;
