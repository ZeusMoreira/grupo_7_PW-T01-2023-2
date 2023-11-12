// Table.js
import React, { useEffect } from "react";
import { useTable } from "react-table";
import "./style.css"
import { isMobile } from 'react-device-detect';

function Tabela({ columns, data }) {
    const {
        getTableProps, // propriedades da tabela
        getTableBodyProps, // propriedades do corpo da tabela
        headerGroups, // os valores de agrupamento de tabela, caso sua tabela use
        rows, // linhas da tabela baseado nos dados e colunas
        prepareRow // Prepara a linha (Essa função deve ser chamada para cada linha)
    } = useTable({
        columns,
        data
    });

    useEffect(() => {
        if(isMobile){
            document.querySelector('tbody').style.width = 'auto'
            document.querySelector('.cont').style.width = 'auto'
            document.querySelector('.cont').style.padding = '1em'
        } else {
            document.querySelector('tbody').style.width = 'calc(100% + 1em)'
            document.querySelector('.cont').style.width = 'calc(100% - 2.5em)'
            document.querySelector('.cont').style.padding = 0
        }
    })

    return (
        <div className="cont">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                        })}
                        </tr>
                    );
                    })}
                </tbody>
            </table>
        </div>
        
    );
}
export default Tabela;