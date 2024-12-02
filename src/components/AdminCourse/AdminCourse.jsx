import React, { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Select, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { convertPrice, getBase64, renderOptionsSubject, renderOptionsTypeCourse } from "../../utils";
import { UploadOutlined } from '@ant-design/icons'
import * as CourseService from '../../services/CourseService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from '../MessageComponent/Message'
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponent/Loading";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import style

const AdminCourse = () => {
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
        subject: '',
        price: '',
        description: '',
        type: '',
        level: '',
        newType: '',
        newSubject: ''
    })

    const [stateCourse, setStateCourse] = useState(inittial())

    const [stateCourseDetails, setStateCourseDetails] = useState(inittial())

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const {
                name,
                image,
                subject,
                price,
                description,
                type,
                level } = data
            const res = CourseService.createCourse({
                name,
                image,
                subject,
                price,
                description,
                type,
                level
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
            const res = CourseService.updateCourse(
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
            const res = CourseService.deleteCourse(
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
            const res = CourseService.deleteManyCourse(
                ids,
                token,
            )
            return res
        }
    )

    const getAllCourse = async () => {
        const res = await CourseService.getAllCourse()
        return res
    }

    const fetchGetDetailsCourse = async (rowSelected) => {
        const res = await CourseService.getDetailsCourse(rowSelected)
        if (res?.data) {
            setStateCourseDetails({
                name: res?.data?.name,
                image: res?.data?.image,
                subject: res?.data?.subject,
                price: res?.data?.price,
                description: res?.data?.description,
                type: res?.data?.type,
                level: res?.data?.level
            })
        }
    }

    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateCourseDetails)
        } else {
            form.setFieldsValue(inittial())
        }
    }, [form, stateCourseDetails, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetDetailsCourse(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsCourse = () => {
        setIsOpenDrawer(true)
    }

    const hanldeDeleteManyCourses = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryCourse.refetch()
            }
        })
    }

    const fetchAllTypeOfCourse = async () => {
        const res = await CourseService.getAllCourseType()
        return res
    }

    const fetchAllSubjectOfCourse = async () => {
        const res = await CourseService.getAllCourseSubject()
        return res
    }

    const { data, isSuccess, isError } = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdated
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    const queryCourse = useQuery({ queryKey: ['courses'], queryFn: getAllCourse })
    const typeOfCourse = useQuery({ queryKey: ['type-Course'], queryFn: fetchAllTypeOfCourse })
    const subjectOfCourse = useQuery({ queryKey: ['subject-Course'], queryFn: fetchAllSubjectOfCourse })
    const { isLoading: isLoadingCourses, data: courses } = queryCourse
    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ color: 'green', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsCourse} />
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
            title: 'Tên khóa học',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Bộ môn',
            dataIndex: 'subject',
            sorter: (a, b) => a.subject.length - b.subject.length,
            ...getColumnSearchProps('subject'),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Hình thức',
            dataIndex: 'type',
            sorter: (a, b) => a.type - b.type
        },
        {
            title: 'Cấp độ',
            dataIndex: 'level',
            sorter: (a, b) => a.level - b.level,
            render: (text) => {
                switch (text) {
                    case 1:
                        return 'Căn bản';
                    case 2:
                        return 'Nâng cao';
                    case 3:
                        return 'Ôn thi - Biểu diễn';
                    default:
                        return text; // Hoặc bạn có thể trả về một giá trị mặc định khác
                }
            }
        },
        {
            title: 'Chỉnh sửa',
            dataIndex: 'action',
            render: renderAction
        }
    ];

    const dataTable = courses?.data?.length && courses?.data?.map((course) => {
        return {
            ...course,
            key: course._id,
            price: convertPrice(course.price)
        }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Thêm khóa học thành công')
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success('Xóa các khóa học thành công')
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa khóa học thành công')
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateCourseDetails({
            name: '',
            image: '',
            subject: '',
            price: '',
            description: '',
            type: '',
            level: ''
        })
        form.resetFields()
    };

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật khóa học thành công!')
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteCourse = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryCourse.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateCourse({
            name: '',
            image: '',
            subject: '',
            price: '',
            description: '',
            type: '',
            level: ''
        })
        form.resetFields()
    };

    const onFinish = () => {
        const params = {
            name: stateCourse.name,
            image: stateCourse.image,
            subject: stateCourse.subject === 'add_subject' ? stateCourse.newSubject : stateCourse.subject,
            price: stateCourse.price,
            description: stateCourse.description,
            type: stateCourse.type === 'add_type' ? stateCourse.newType : stateCourse.type,
            level: stateCourse.level
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryCourse.refetch()
            }
        })
        setIsModalOpen(false);
    }

    const handleOnchange = (e) => {
        setStateCourse({
            ...stateCourse,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateCourseDetails({
            ...stateCourseDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleUploadImage = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateCourse({
            ...stateCourse,
            image: file.preview
        })
    }

    const handleUploadImageDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateCourseDetails({
            ...stateCourseDetails,
            image: file.preview
        })
    }

    const onUpdateCourse = () => {
        mutationUpdated.mutate({ id: rowSelected, token: user?.access_token, ...stateCourseDetails }, {
            onSettled: () => {
                queryCourse.refetch()
            }
        })
    }

    const handleChangeSelectSubject = (value) => {
        setStateCourse({
            ...stateCourse,
            subject: value
        })
    }

    const handleChangeSelectType = (value) => {
        setStateCourse({
            ...stateCourse,
            type: value
        })
    }

    const handleOnChangeDescription = (value) => {
        setStateCourse({ ...stateCourse, description: value });
    };

    return (
        <div>
            <Loading isLoading={isLoadingCourses || loading}>
                <WrapperHeader>Quản lý khóa học</WrapperHeader>
                <div style={{ marginTop: '10px' }}>
                    <Button style={{ height: '50px', width: '50px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '30px' }} />  </Button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TableComponent hanldeDeleteMany={hanldeDeleteManyCourses} columns={columns} isLoading={isLoadingCourses} data={dataTable} onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        };
                    }} />
                </div>
                <ModalComponent forceRender title="Tạo khóa học mới " open={isModalOpen} onCancel={handleCancel} footer={null}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Tên khóa học"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên khóa học!' }]}
                        >
                            <InputComponent value={stateCourse.name} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Bộ môn"
                            name="subject"
                            rules={[{ required: true, message: 'Nhập bộ môn!' }]}
                        >
                            <Select
                                name="subject"
                                value={stateCourse.subject}
                                onChange={handleChangeSelectSubject}
                                options={renderOptionsSubject(subjectOfCourse?.data?.data)}
                            />
                        </Form.Item>
                        {stateCourse.subject === 'add_subject' && (
                            <Form.Item
                                label='Thêm bộ môn mới'
                                name="newSubject"
                                rules={[{ required: true, message: 'Nhập bộ môn mới!' }]}
                            >
                                <InputComponent value={stateCourse.newSubject} onChange={handleOnchange} name="newSubject" />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Hình thức"
                            name="type"
                            rules={[{ required: true, message: 'Nhập hình thức!' }]}
                        >
                            <Select
                                name="type"
                                value={stateCourse.type}
                                onChange={handleChangeSelectType}
                                options={renderOptionsTypeCourse(typeOfCourse?.data?.data)}
                            />
                        </Form.Item>
                        {stateCourse.type === 'add_type' && (
                            <Form.Item
                                label='Thêm hình thức mới'
                                name="newType"
                                rules={[{ required: true, message: 'Nhập hình thức mới!' }]}
                            >
                                <InputComponent value={stateCourse.newType} onChange={handleOnchange} name="newType" />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                        >
                            <InputComponent value={stateCourse.price} onChange={handleOnchange} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Cấp độ (1, 2, 3)"
                            name="level"
                            rules={[{ required: true, message: 'Nhập cấp độ!' }]}
                        >
                            <InputComponent value={stateCourse.level} onChange={handleOnchange} name="level" />
                        </Form.Item>

                        <Form.Item
                            label="Giới thiệu khóa học"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng giới thiệu!' }]}
                        >
                            <ReactQuill
                                value={stateCourse.description}
                                onChange={handleOnChangeDescription}
                                placeholder="Nhập giới thiệu khóa học..."
                            />
                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Chèn hình ảnh!' }]}
                        >
                            <WrapperUploadFile onChange={handleUploadImage} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                {stateCourse?.image && (
                                    <img src={stateCourse?.image} style={{
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

                <DrawerComponent title='Thông tin khóa học' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={onUpdateCourse}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Tên khóa học"
                            name="name"
                            rules={[{ required: true, message: 'Nhập tên khóa học!' }]}
                        >
                            <InputComponent value={stateCourseDetails['name']} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: 'Nhập giá!' }]}
                        >
                            <InputComponent value={stateCourseDetails.price} onChange={handleOnchangeDetails} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Giới thiệu"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng giới thiệu!' }]}
                        >
                            <ReactQuill
                                value={stateCourseDetails.description}
                                onChange={(value) => setStateCourseDetails({ ...stateCourseDetails, description: value })}
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
                                {stateCourseDetails?.image && (
                                    <img src={stateCourseDetails?.image} style={{
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

                <ModalComponent title="Xóa khóa học" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteCourse}>
                    <div>Bạn chắc chắn xóa khóa học này?</div>
                </ModalComponent>
            </Loading>
        </div >
    )
}

export default AdminCourse