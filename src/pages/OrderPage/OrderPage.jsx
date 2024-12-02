import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, Form } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style'
import { WrapperCountOrder, WrapperInfo, WrapperInfoAddress, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDelivery, WrapperTotal } from './style'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as message from '../../components/MessageComponent/Message'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../../redux/slides/userSlide'
import StepComponent from '../../components/StepComponent/StepComponent'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'

const OrderPage = () => {
    const [isHovered, setIsHovered] = useState(false);
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const [listChecked, setListChecked] = useState([])
    const [delivery, setDelivery] = useState('ghtk')
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        email: ''
    })

    const navigate = useNavigate()
    const [form] = Form.useForm();

    const dispatch = useDispatch()
    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    }


    const handleChangeCount = (type, idProduct, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }))
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }))
            }
        }
    }

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))
    }

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }
    }

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }))
    }, [listChecked])

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
                email: user?.email,
            })
        }
    }, [isOpenModalUpdateInfo])

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
        const items = order?.orderItemsSelected;
        if (Array.isArray(items)) {
            const result = items.reduce((total, cur) => {
                return total + (cur.price * cur.amount);
            }, 0);
            return result;
        }
        return 0;
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        const items = order?.orderItemsSelected;
        if (Array.isArray(items)) {
            const result = items.reduce((total, cur) => {
                const totalDiscount = (cur.price * cur.discount / 100) ? (cur.price * cur.discount / 100) : 0
                return total + (totalDiscount * cur.amount);
            }, 0);
            if (Number(result)) {
                return result;
            }
        }
        return 0;
    }, [order]);

    const preTotalPriceMemo = useMemo(() => {
        return (Number(priceMemo) - Number(priceDiscountMemo))
    }, [priceMemo, priceDiscountMemo])

    const shippingPriceMemo = useMemo(() => {
        let shippingPrice = 0;
        if (preTotalPriceMemo >= 5000000 && preTotalPriceMemo < 10000000) {
            shippingPrice = 20000;
        } else if (preTotalPriceMemo >= 10000000) {
            shippingPrice = 50000;
        } else if (order?.orderItemsSelected?.length === 0) {
            shippingPrice = 0;
        } else if (preTotalPriceMemo > 0 && preTotalPriceMemo < 2000000) {
            shippingPrice = 0;
        } else if (preTotalPriceMemo >= 2000000 && preTotalPriceMemo < 5000000) {
            shippingPrice = 30000;
        }
        return shippingPrice;
    }, [preTotalPriceMemo]);


    const totalPriceMemo = useMemo(() => {
        return (Number(priceMemo) + Number(shippingPriceMemo) - Number(priceDiscountMemo))
    }, [priceMemo, shippingPriceMemo, priceDiscountMemo])

    const handRemoveAllOrder = () => {
        if (listChecked?.length > 0) {
            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }

    const handleAddCard = () => {
        if (!order?.orderItemsSelected?.length) {
            message.error('Vui lòng chọn sản phẩm!')
        } else if (!user?.phone || !user.address || !user.name || !user.city || !user.email) {
            setIsOpenModalUpdateInfo(true)
        } else {
            navigate('/payment')
        }
    }

    const mutationUpdate = useMutationHooks(
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

    const { isLoading, data } = mutationUpdate

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            address: '',
            isAdmin: false
        })
        form.resetFields()
        setIsOpenModalUpdateInfo(false)
    }

    const handleUpdateInfo = () => {
        const { name, address, city, phone, email } = stateUserDetails
        if (name && address && city && phone && email) {
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, phone, email }))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleDilivery = (e) => {
        setDelivery(e.target.value)
    }

    const itemsDelivery = [
        {
            title: '-20K ',
            description: '2 triệu > 5 triệu',
        },
        {
            title: '-30K',
            description: '5 triệu > 10 triệu',
        },
        {
            title: 'FREE SHIP',
            description: 'Trên 10 triệu',
        },
    ]

    return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: '#f5f5fa' }}>
            <HeaderComponent isHiddenSearch />
            <div style={{ height: '100%', width: '1270px', margin: '0 auto', backgroundColor: '#fff' }}>
                <div style={{ padding: '10px 20px', fontWeight: 'bold' }}>Giỏ hàng</div>
                <div style={{ display: 'flex', justifyContent: 'content' }}>
                    <WrapperLeft>
                        <WrapperStyleHeaderDelivery>
                            <StepComponent
                                items={itemsDelivery}
                                current={
                                    shippingPriceMemo === 20000
                                        ? 2 : shippingPriceMemo === 30000
                                            ? 1 : order.orderItemsSelected?.length === 0
                                                ? 0 : shippingPriceMemo === 50000
                                                    ? 3 : shippingPriceMemo === 0
                                                        ? 0 : shippingPriceMemo
                                }
                            />
                        </WrapperStyleHeaderDelivery>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '200px', fontSize: '14px' }}>
                                <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                            </span>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                <span style={{ marginLeft: '175px' }}>Đơn giá</span>
                                <span style={{ marginLeft: '75px' }}>Số lượng</span>
                                <span style={{ marginLeft: '45px' }}>Giảm</span>
                                <span style={{ marginLeft: '50px' }}>Thành tiền</span>
                                <DeleteOutlined style={{ cursor: 'pointer', marginLeft: '62px' }} onClick={handRemoveAllOrder} />
                            </div>
                        </WrapperStyleHeader>
                        <div style={{ height: '10px' }}></div>
                        <WrapperListOrder >
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?.product}>
                                        <div style={{ width: '350px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                                            <img src={order?.image} style={{ width: '77px', height: '77px', objectFit: 'cover' }} />
                                            <div style={{
                                                width: 200,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{order?.name}</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>
                                                <span style={{ fontSize: '16px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                                            </span>
                                            <WrapperCountOrder>
                                                <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)} >
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size='small' min={1} max={order?.countInStock} />
                                                <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('increase', order?.product, order?.amount === order?.countInStock)}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                            </WrapperCountOrder>
                                            <span style={{ color: '#0057A1', fontSize: '16px', fontWeight: 500 }}>{order?.discount ? ((order?.discount)) : '0'}%</span>
                                            <span style={{ color: '#0057A1', fontSize: '16px', fontWeight: 500 }}>{convertPrice((order?.price * order?.amount) - ((order?.price * (order?.discount / 100)) * order?.amount))}</span>
                                            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfoAddress>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '5px' }}>
                                    <span style={{ color: '#cc6600' }}>Thông tin giao hàng:</span>
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                    <span>Tên người nhận: {`${user?.name}`}</span>
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                    <span>Địa chỉ: {`${user?.address} - ${user?.city}`}</span>
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                    <span>SĐT: {`${user?.phone}`}</span>
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                    <span>Email: {`${user?.email}`}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                                    <span onClick={handleChangeAddress} style={{ color: 'blue', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Đổi địa chỉ</span>
                                </div>
                            </WrapperInfoAddress>
                            <WrapperInfo>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                    <span style={{ fontSize: '14px' }}>Tổng tiền:</span>
                                    <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                                </div>
                                {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                    <span>Phí giao hàng:</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(shippingPriceMemo)}</span>
                                </div> */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                    <span style={{ fontSize: '14px' }}>Giảm giá:</span>
                                    <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span style={{ fontSize: '14px' }}>Tạm tính:</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#0057A1', fontSize: '16px', fontWeight: 'bold' }}>{convertPrice(preTotalPriceMemo)}</span>
                                    <span style={{ color: '#000', fontSize: '11px', textAlign: 'center' }}>(Giá đã bao gồm VAT)</span>
                                </span>
                            </WrapperTotal>
                        </div>
                        <div style={{ width: '100%' }}>
                            <ButtonComponent
                                onClick={() => handleAddCard()}
                                size={40}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                styleButton={{
                                    background: isHovered ? '#8C6B53' : '#AB886D', // màu đổi khi hover
                                    height: '50px',
                                    width: '291px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    transition: 'background 0.3s', // hiệu ứng chuyển đổi
                                }}
                                textbutton={'Mua hàng'}
                                styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}
                            ></ButtonComponent>
                        </div>
                    </WrapperRight>
                </div>
            </div>
            <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfo}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    // onFinish={onUpdateUser}
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
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
                    >
                        <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                    </Form.Item>
                    <Form.Item
                        label="Thành phố (Tỉnh)"
                        name="city"
                        rules={[{ required: true, message: 'Nhập thành phố!' }]}
                    >
                        <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Nhập địa chỉ!' }]}
                    >
                        <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Nhập email!' }]}
                    >
                        <InputComponent value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" />
                    </Form.Item>
                </Form>
            </ModalComponent>
        </div >
    )
}

export default OrderPage