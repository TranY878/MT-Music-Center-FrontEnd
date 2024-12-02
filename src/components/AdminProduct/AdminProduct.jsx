import React, { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Select, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../utils";
import { UploadOutlined } from '@ant-design/icons'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from '../../components/MessageComponent/Message'
import { useQuery } from "@tanstack/react-query";
import { convertPrice } from "../../utils";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";
import { WrapperHeader, WrapperUploadFile } from "../AdminCourse/style";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import style
import { debounce } from 'lodash';

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const inittial = () => ({
        name: '',
        price: '',
        description: '',
        image: '',
        type: '',
        countInStock: '',
        newType: '',
        discount: 0
    })

    const [stateProduct, setStateProduct] = useState(inittial())

    const [stateProductDetails, setStateProductDetails] = useState(inittial())

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const {
                name,
                price,
                description,
                image,
                type,
                countInStock,
                discount } = data
            const res = ProductService.createProduct({
                name,
                price,
                description,
                image,
                type,
                countInStock,
                discount
            })
            return res
        }
    )

    const mutationUpdated = useMutationHooks(
        (data) => {
            const {
                id,
                token,
                ...rests } = data
            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests }
            )
            return res
        }
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
                token
            } = data
            const res = ProductService.deleteProduct(
                id,
                token,
            )
            return res
        }
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids
            } = data
            const res = ProductService.deleteManyProduct(
                ids,
                token,
            )
            return res
        }
    )

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount
            })
        }
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateProductDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, stateProductDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const hanldeDeleteManyProducts = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const { data, isSuccess, isError } = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdated
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
    const { isLoading: isLoadingProducts, data: products } = queryProduct
    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ color: 'green', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
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
    });


    const columns = [
        {
            title: 'Ngày cập nhật',
            dataIndex: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            defaultSortOrder: 'descend',
            render: (text) => new Date(text).toLocaleString('vi-VN'),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'type',
            sorter: (a, b) => a.type.length - b.type.length,
            ...getColumnSearchProps('type'),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Tồn kho',
            dataIndex: 'countInStock',
            sorter: (a, b) => a.countInStock - b.countInStock,
            render: (countInStock) => {
                let color = '';
                if (countInStock < 10) {
                    color = 'red';
                }
                return <span style={{ color }}>{countInStock}</span>;
            }
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'discount',
            sorter: (a, b) => a.discount - b.discount,
            render: (discount) => {
                let color = '';
                if (discount > 0) {
                    color = '#00AF33';
                }
                return <span style={{ color }}>{discount}</span>;
            }
        },
        {
            title: 'Chỉnh sửa',
            dataIndex: 'action',
            render: renderAction
        }
    ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {
            ...product,
            price: convertPrice(product?.price),
            key: product._id
        }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Thêm sản phẩm thành công')
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success('Xóa các sản phẩm thành công')
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa sản phẩm thành công')
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            price: '',
            description: '',
            image: '',
            type: '',
            countInStock: ''
        })
        form.resetFields()
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật sản phẩm thành công!')
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            price: '',
            description: '',
            image: '',
            type: '',
            countInStock: '',
            discount: ''
        })
        form.resetFields()
    };

    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            image: stateProduct.image,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct.countInStock,
            discount: stateProduct.discount
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
        setIsModalOpen(false);
    }

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleUploadImage = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const handleUploadImageDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const onUpdateProduct = () => {
        mutationUpdated.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })
    }

    const handleOnChangeDescription = debounce((value) => {
        setStateProduct({ ...stateProduct, description: value });
    }, 300);


    return (
        <div>
            <Loading isLoading={isLoadingProducts || loading}>
                <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
                <div style={{ marginTop: '10px' }}>
                    <Button style={{ height: '50px', width: '50px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '30px' }} />  </Button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TableComponent hanldeDeleteMany={hanldeDeleteManyProducts} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        };
                    }} />
                </div>
                <ModalComponent forceRender title="Tạo sản phẩm mới " open={isModalOpen} onCancel={handleCancel} footer={null}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                        initialValues={{
                            discount: 0,
                        }}
                    >
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Loại sản phẩm"
                            name="type"
                            rules={[{ required: true, message: 'Nhập loại sản phẩm!' }]}
                        >
                            <Select
                                name="type"
                                value={stateProduct.type}
                                onChange={handleChangeSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' && (
                            <Form.Item
                                label='Thêm loại mới'
                                name="newType"
                                rules={[{ required: true, message: 'Nhập loại sản phẩm!' }]}
                            >
                                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Giá sản phẩm"
                            name="price"
                            rules={[{ required: true, message: 'Nhập giá sản phẩm!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Hàng sẵn kho"
                            name="countInStock"
                            rules={[{ required: true, message: 'Nhập số lượng!' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Thông tin sản phẩm"
                            name="description"
                            rules={[{ required: true, message: 'Nhập thông tin sản phẩm!' }]}
                        >

                            <ReactQuill
                                value={stateProduct.description}
                                onChange={handleOnChangeDescription}
                                placeholder="Nhập giới thiệu sản phẩm..."
                            />
                        </Form.Item>

                        <Form.Item
                            label="Khuyến mãi (%)"
                            name="discount"
                            rules={[{ required: true, message: 'Khuyến mãi!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Chèn hình ảnh!' }]}
                        >
                            <WrapperUploadFile onChange={handleUploadImage} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
                                        height: '80px',
                                        width: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '50px'
                                    }} alt="image" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </ModalComponent>

                <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={onUpdateProduct}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
                        >
                            <InputComponent value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Giá sản phẩm"
                            name="price"
                            rules={[{ required: true, message: 'Nhập giá sản phẩm!' }]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Hàng sẵn kho"
                            name="countInStock"
                            rules={[{ required: true, message: 'Nhập số lượng!' }]}
                        >
                            <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Thông tin sản phẩm"
                            rules={[{ required: true, message: 'Nhập thông tin sản phẩm!' }]}
                        >
                            <ReactQuill
                                value={stateProductDetails.description}
                                onChange={(value) =>
                                    setStateProductDetails({ ...stateProductDetails, description: value })
                                }
                                placeholder="Nhập giới thiệu sản phẩm..."
                            />
                        </Form.Item>

                        <Form.Item
                            label="Khuyến mãi (%)"
                            name="discount"
                            rules={[{ required: true, message: 'Khuyến mãi!' }]}
                        >
                            <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Chèn hình ảnh!' }]}
                        >
                            <WrapperUploadFile onChange={handleUploadImageDetails} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style={{
                                        height: '80px',
                                        width: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '50px'
                                    }} alt="image" />
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

                <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                    <div>Bạn chắc chắn xóa sản phẩm này?</div>
                </ModalComponent>
            </Loading>
        </div >
    )
}

export default AdminProduct