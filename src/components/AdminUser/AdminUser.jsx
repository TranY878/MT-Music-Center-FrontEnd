import React, { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperUploadFile } from "../AdminCourse/style";
import { Button, Form, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64 } from "../../utils";
import { UploadOutlined } from '@ant-design/icons'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from '../../components/MessageComponent/Message'
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
        address: '',
        isAdmin: false
    })

    const [form] = Form.useForm();

    const mutationUpdated = useMutationHooks(
        (data) => {
            const {
                id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,
                { ...rests },
                token
            )
            return res
        }
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids
            } = data
            const res = UserService.deleteManyUser(
                ids,
                token,
            )
            return res
        }
    )

    const hanldeDeleteManyUsers = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
                token
            } = data
            const res = UserService.deleteUser(
                id,
                token,
            )
            return res
        }
    )

    const getAllUser = async () => {
        const res = await UserService.getAllUser(user?.access_token)
        return res
    }

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                address: res?.data?.address,
                avatar: res?.data?.avatar,
                isAdmin: res?.data?.isAdmin
            })
        }
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsUser = () => {
        setLoading(true)
        setIsOpenDrawer(true)
        setLoading(false)
    }

    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdated
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUser })
    const { isLoading: isLoadingUsers, data: users } = queryUser
    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ color: 'green', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsUser} />
                <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
            </div>
        )
    }

    const handleSearch = (
        selectedKeys,
        confirm,
        dataIndex
    ) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    ref={searchInput}
                    placeholder={`Từ khóa `}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Làm mới
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     // <Highlighter
        //     //   highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //     //   searchWords={[searchText]}
        //     //   autoEscape
        //     //   textToHighlight={text ? text.toString() : ''}
        //     // />
        //   ) : (
        //     text
        //   ),
    });


    const columns = [
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            defaultSortOrder: 'descend',
            render: (text) => new Date(text).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Phân quyền',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'Admin',
                    value: 'true',
                },
                {
                    text: 'Người dùng',
                    value: 'false',
                }
            ],
            onFilter: (value, record) => {
                if (value === 'true') {
                    return record.isAdmin == 'true'
                } else if (value === 'false') {
                    return record.isAdmin == 'false'
                }
            }
        },
        {
            title: 'Chỉnh sửa',
            dataIndex: 'action',
            render: renderAction
        }
    ];

    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id, isAdmin: user.isAdmin ? 'Admin' : 'Người dùng' }
    })

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa người dùng thành công!')
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success('Xóa người dùng thành công!')
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            address: '',
            isAdmin: false
        })
        form.resetFields()
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật người dùng thành công!')
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleUploadAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }

    const onUpdateUser = () => {
        mutationUpdated.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    return (
        <div>
            <Loading isLoading={isLoadingUsers || loading}>
                <WrapperHeader>Quản lý người dùng</WrapperHeader>
                <div style={{ marginTop: '20px' }}>
                    <TableComponent hanldeDeleteMany={hanldeDeleteManyUsers} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        };
                    }} />
                </div>

                <DrawerComponent forceRender title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={onUpdateUser}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Tên người dùng"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên người dùng!' }]}
                        >
                            <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Nhập email!' }]}
                        >
                            <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                        >
                            <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                        >
                            <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="avatar"
                            rules={[{ required: true, message: 'Chèn hình ảnh!' }]}
                        >
                            <WrapperUploadFile onChange={handleUploadAvatarDetails} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style={{
                                        height: '80px',
                                        width: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '50px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </DrawerComponent>

                <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                    <div>Bạn chắc chắn xóa tài khoản này?</div>
                </ModalComponent>
            </Loading>
        </div>
    )
}

export default AdminUser