import React, { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperUploadFile } from "../AdminCourse/style";
import { Button, Form, Select, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptionsMusical } from "../../utils";
import { UploadOutlined } from '@ant-design/icons'
import * as TeacherService from '../../services/TeacherService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from '../MessageComponent/Message'
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import style

const AdminTeacher = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const inittial = () => ({
        name: '',
        image: '',
        musicalInstrument: '',
        experience: '',
        address: '',
        phone: '',
        facebook: '',
        intro: '',
        newMusicalInstrument: ''
    })

    const [stateTeacher, setStateTeacher] = useState(inittial())

    const [stateTeacherDetails, setStateTeacherDetails] = useState(inittial())

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const {
                name,
                image,
                musicalInstrument,
                experience,
                address,
                phone,
                facebook,
                intro } = data
            const res = TeacherService.createTeacher({
                name,
                image,
                musicalInstrument,
                experience,
                address,
                phone,
                facebook,
                intro
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
            const res = TeacherService.updateTeacher(
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
            const res = TeacherService.deleteTeacher(
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
            const res = TeacherService.deleteManyTeacher(
                ids,
                token,
            )
            return res
        }
    )

    const getAllTeacher = async () => {
        const res = await TeacherService.getAllTeacher()
        return res
    }

    const fetchGetDetailsTeacher = async (rowSelected) => {
        const res = await TeacherService.getDetailsTeacher(rowSelected)
        if (res?.data) {
            setStateTeacherDetails({
                name: res?.data?.name,
                image: res?.data?.image,
                musicalInstrument: res?.data?.musicalInstrument,
                experience: res?.data?.experience,
                address: res?.data?.address,
                phone: res?.data?.phone,
                facebook: res?.data?.facebook,
                intro: res?.data?.intro
            })
        }
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateTeacherDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, stateTeacherDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetDetailsTeacher(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsTeacher = () => {
        setIsOpenDrawer(true)
    }

    const hanldeDeleteManyTeachers = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryTeacher.refetch()
            }
        })
    }

    const fetchAllMainMusicalInstrument = async () => {
        const res = await TeacherService.getAllMusicalInstrument()
        return res
    }

    const { data, isSuccess, isError } = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdated
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const queryTeacher = useQuery({ queryKey: ['teachers'], queryFn: getAllTeacher })
    const mainMusicalInstrument = useQuery({ queryKey: ['main-musicalInstrument'], queryFn: fetchAllMainMusicalInstrument })
    const { isLoading: isLoadingTeachers, data: teachers } = queryTeacher
    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ color: 'green', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsTeacher} />
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
            title: 'Tên giáo viên',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Bộ môn',
            dataIndex: 'musicalInstrument',
            sorter: (a, b) => a.musicalInstrument.length - b.musicalInstrument.length,
            ...getColumnSearchProps('musicalInstrument'),
        },
        {
            title: 'Kinh nghiệm (Năm)',
            dataIndex: 'experience',
            sorter: (a, b) => a.experience - b.experience,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone
        },
        {
            title: 'Chỉnh sửa',
            dataIndex: 'action',
            render: renderAction
        }
    ];

    const dataTable = teachers?.data?.length && teachers?.data?.map((teacher) => {
        return { ...teacher, key: teacher._id }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Thêm giáo viên thành công')
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success('Xóa các giáo viên thành công')
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa giáo viên thành công')
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateTeacherDetails({
            name: '',
            image: '',
            musicalInstrument: '',
            experience: '',
            address: '',
            phone: '',
            facebook: '',
            intro: '',
        })
        form.resetFields()
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật giáo viên thành công!')
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteTeacher = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryTeacher.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateTeacher({
            name: '',
            image: '',
            musicalInstrument: '',
            experience: '',
            address: '',
            phone: '',
            facebook: '',
            intro: '',
        })
        form.resetFields()
    };

    const onFinish = () => {
        const params = {
            name: stateTeacher.name,
            image: stateTeacher.image,
            phone: stateTeacher.phone,
            experience: stateTeacher.experience,
            address: stateTeacher.address,
            musicalInstrument: stateTeacher.musicalInstrument === 'add_musicalInstrument' ? stateTeacher.newMusicalInstrument : stateTeacher.musicalInstrument,
            facebook: stateTeacher.facebook,
            intro: stateTeacher.intro,
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryTeacher.refetch()
            }
        })
        setIsModalOpen(false);
    }

    const handleOnchange = (e) => {
        setStateTeacher({
            ...stateTeacher,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateTeacherDetails({
            ...stateTeacherDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleUploadImage = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateTeacher({
            ...stateTeacher,
            image: file.preview
        })
    }

    const handleUploadImageDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateTeacherDetails({
            ...stateTeacherDetails,
            image: file.preview
        })
    }

    const onUpdateTeacher = () => {
        mutationUpdated.mutate({ id: rowSelected, token: user?.access_token, ...stateTeacherDetails }, {
            onSettled: () => {
                queryTeacher.refetch()
            }
        })
    }

    const handleChangeSelect = (value) => {
        setStateTeacher({
            ...stateTeacher,
            musicalInstrument: value
        })
    }

    const handleOnChangeIntro = (value) => {
        setStateTeacher({ ...stateTeacher, intro: value });
    };

    return (
        <div>
            <Loading isLoading={isLoadingTeachers || loading}>
                <WrapperHeader>Quản lý giáo viên</WrapperHeader>
                <div style={{ marginTop: '10px' }}>
                    <Button style={{ height: '50px', width: '50px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '30px' }} />  </Button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TableComponent hanldeDeleteMany={hanldeDeleteManyTeachers} columns={columns} isLoading={isLoadingTeachers} data={dataTable} onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        };
                    }} />
                </div>
                <ModalComponent forceRender title="Tạo giáo viên mới " open={isModalOpen} onCancel={handleCancel} footer={null}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Tên giáo viên"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên giáo viên!' }]}
                        >
                            <InputComponent value={stateTeacher.name} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Bộ môn"
                            name="musicalInstrument"
                            rules={[{ required: true, message: 'Nhập bộ môn!' }]}
                        >
                            <Select
                                name="musicalInstrument"
                                value={stateTeacher.musicalInstrument}
                                onChange={handleChangeSelect}
                                options={renderOptionsMusical(mainMusicalInstrument?.data?.data)}
                            />
                        </Form.Item>
                        {stateTeacher.musicalInstrument === 'add_musicalInstrument' && (
                            <Form.Item
                                label='Thêm bộ môn mới'
                                name="newMusicalInstrument"
                                rules={[{ required: true, message: 'Nhập bộ môn mới!' }]}
                            >
                                <InputComponent value={stateTeacher.newMusicalInstrument} onChange={handleOnchange} name="newMusicalInstrument" />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Kinh nghiệm (năm)"
                            name="experience"
                            rules={[{ required: true, message: 'Nhập kinh nghiệm!' }]}
                        >
                            <InputComponent value={stateTeacher.experience} onChange={handleOnchange} name="experience" />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                        >
                            <InputComponent value={stateTeacher.address} onChange={handleOnchange} name="address" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                        >
                            <InputComponent value={stateTeacher.phone} onChange={handleOnchange} name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="Link Facebook"
                            name="facebook"
                            rules={[{ required: true, message: 'Gắn link Facebook!' }]}
                        >
                            <InputComponent value={stateTeacher.facebook} onChange={handleOnchange} name="facebook" />
                        </Form.Item>

                        <Form.Item
                            label="Giới thiệu giáo viên"
                            name="intro"
                            rules={[{ required: true, message: 'Vui lòng giới thiệu!' }]}
                        >
                            <ReactQuill
                                value={stateTeacher.intro}
                                onChange={handleOnChangeIntro}
                                placeholder="Nhập giới thiệu giáo viên..."
                            />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Chèn hình ảnh!' }]}
                        >
                            <WrapperUploadFile onChange={handleUploadImage} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                {stateTeacher?.image && (
                                    <img src={stateTeacher?.image} style={{
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

                <DrawerComponent title='Thông tin giáo viên' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={onUpdateTeacher}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Tên giáo viên"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
                        >
                            <InputComponent value={stateTeacherDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Kinh nghiệm (năm)"
                            name="experience"
                            rules={[{ required: true, message: 'Nhập số năm kinh nghiệm!' }]}
                        >
                            <InputComponent value={stateTeacherDetails.experience} onChange={handleOnchangeDetails} name="experience" />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                        >
                            <InputComponent value={stateTeacherDetails.address} onChange={handleOnchangeDetails} name="address" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                        >
                            <InputComponent value={stateTeacherDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="Link Facebook"
                            name="facebook"
                            rules={[{ required: true, message: 'Gắn link Facebook!' }]}
                        >
                            <InputComponent value={stateTeacherDetails.facebook} onChange={handleOnchangeDetails} name="facebook" />
                        </Form.Item>

                        <Form.Item
                            label="Giới thiệu"
                            name="intro"
                            rules={[{ required: true, message: 'Vui lòng giới thiệu!' }]}
                        >
                            <ReactQuill
                                value={stateTeacherDetails.intro}
                                onChange={(value) => setStateTeacherDetails({ ...stateTeacherDetails, intro: value })}
                                placeholder="Nhập giới thiệu khóa học..."
                            />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Chèn hình ảnh!' }]}
                        >
                            <WrapperUploadFile onChange={handleUploadImageDetails} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                {stateTeacherDetails?.image && (
                                    <img src={stateTeacherDetails?.image} style={{
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

                <ModalComponent title="Xóa giáo viên" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteTeacher}>
                    <div>Bạn chắc chắn xóa giáo viên này?</div>
                </ModalComponent>
            </Loading>
        </div >
    )
}

export default AdminTeacher