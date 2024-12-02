import { Table } from "antd";
import React, { useState } from "react";
import Loading from '../../components/LoadingComponent/Loading';
import { DeleteOutlined } from '@ant-design/icons'

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data: dataSource = [], isloading = false, columns = [], hanldeDeleteMany, showSelection = true } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const [loading, setLoading] = useState(false)
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
    };

    const handleDeleteAll = () => {
        setLoading(true)
        hanldeDeleteMany(rowSelectedKeys)
        setLoading(false)
    }

    return (
        <Loading isLoading={isloading || loading}>
            {rowSelectedKeys.length > 0 && (
                <button style={{
                    width: 'fit-content',
                    background: '#E5001B',
                    float: 'right',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '5px',
                    cursor: 'pointer',
                }}
                    onClick={handleDeleteAll}
                >
                    <DeleteOutlined />
                    Xóa các mục đã chọn
                </button>
            )}
            <Table
                // Chỉ truyền rowSelection nếu showSelection là true
                rowSelection={showSelection ? { type: selectionType, ...rowSelection } : null}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </Loading>
    )
}

export default TableComponent