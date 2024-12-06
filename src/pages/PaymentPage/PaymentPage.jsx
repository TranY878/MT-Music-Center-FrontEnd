import React, { useEffect, useMemo, useState } from 'react'
import { Form, Modal, Radio } from 'antd'
import { Lable, WrapperInfo, WrapperInfoAddress, WrapperLeft, WrapperPaymentMethod, WrapperRadio, WrapperRight, WrapperTotal } from './style'
import { useDispatch, useSelector } from 'react-redux'
import { removeAllOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as PaymentService from '../../services/PaymentService'
import * as message from '../../components/MessageComponent/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import { PayPalButton } from 'react-paypal-button-v2'
import { WrapperStyleHeaderDelivery } from '../OrderPage/style'
import StepComponent from '../../components/StepComponent/StepComponent'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import Loading from '../../components/LoadingComponent/Loading'
import bankQr from '../../assets/images/bank-qr.png';

const PaymentPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const [isHovered, setIsHovered] = useState(false);
    const [delivery, setDelivery] = useState('ghtk')
    const [payment, setPayment] = useState('later_money')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [sdkReady, setSdkReady] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        ward: '',
        district: '',
        email: ''
    })

    const [form] = Form.useForm();

    const dispatch = useDispatch()

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                ward: user?.ward,
                district: user?.district,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
                email: user?.email,
            })
        }
    }, [isOpenModalUpdateInfo])

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])


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


    const minusShippingPrice = useMemo(() => {
        if (delivery === 'ghtk') {
            return 50000
        } else if (delivery === 'viettelpost') {
            return 70000
        }
    })

    const preTotalPriceMemo = useMemo(() => {
        return (Number(priceMemo) - Number(priceDiscountMemo))
    }, [priceMemo, priceDiscountMemo])

    const shippingPriceMemo = useMemo(() => {
        let shippingPrice = 0;
        if (delivery === 'ghtk') {
            if (preTotalPriceMemo >= 5000000 && preTotalPriceMemo < 10000000) {
                shippingPrice = 30000;
            } else if (preTotalPriceMemo >= 10000000) {
                shippingPrice = 50000;
            } else if (order?.orderItemsSelected?.length === 0) {
                shippingPrice = 0;
            } else if (preTotalPriceMemo < 2000000) {
                shippingPrice = 0;
            } else if (preTotalPriceMemo >= 2000000 && preTotalPriceMemo < 5000000) {
                shippingPrice = 20000;
            }
        }

        // Thêm 20,000 nếu phương thức giao hàng là "VIETTEL POST"
        else if (delivery === 'viettelpost') {
            if (preTotalPriceMemo >= 5000000 && preTotalPriceMemo < 10000000) {
                shippingPrice = 30000;
            } else if (preTotalPriceMemo >= 10000000) {
                shippingPrice = 70000;
            } else if (order?.orderItemsSelected?.length === 0) {
                shippingPrice = 0;
            } else if (preTotalPriceMemo >= 2000000 && preTotalPriceMemo < 5000000) {
                shippingPrice = 20000;
            }
        }
        return shippingPrice;
    }, [preTotalPriceMemo, delivery]);

    const lastShippingPrice = useMemo(() => {
        return (minusShippingPrice - shippingPriceMemo)
    })

    const totalPriceMemo = useMemo(() => {
        return Number(preTotalPriceMemo) + Number(lastShippingPrice)
    }, [preTotalPriceMemo, lastShippingPrice])

    const handleAddOrder = () => {
        if (loading) return; // Kiểm tra nếu đang loading thì không thực hiện thêm
        setLoading(true);
        if (user?.access_token && order?.orderItemsSelected && user?.name
            && user?.address && user?.phone && user?.city && user?.ward && user?.district && priceMemo && user?.id) {
            mutationAddOrder.mutate(
                {
                    token: user?.access_token,
                    orderItems: order?.orderItemsSelected,
                    fullName: user?.name,
                    address: user?.address,
                    phone: user?.phone,
                    city: user?.city,
                    ward: user?.ward,
                    district: user?.district,
                    paymentMethod: payment,
                    itemsPrice: priceMemo,
                    shippingPrice: lastShippingPrice,
                    totalPrice: totalPriceMemo,
                    user: user?.id,
                    email: user?.email,
                    delivery: order?.delivery
                },
                {
                    onSettled: () => setLoading(false) // Tắt loading sau khi hoàn tất
                }
            );
        } else {
            setLoading(false);
        }
    };

    const handleUpdateInfo = () => {
        const { name, address, city, ward, district, phone, email } = stateUserDetails
        if (name && address && city && ward && district && phone && email) {
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, ward, district, phone, email }))
                    setIsOpenModalUpdateInfo(false)
                }
            })
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

    const mutationAddOrder = useMutationHooks(
        (data) => {
            const {
                token,
                ...rests } = data
            const res = OrderService.createOrder(
                { ...rests }, token)
            return res
        }
    )

    const { isLoading, data } = mutationUpdate
    const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

    useEffect(() => {
        if (isSuccess && dataAdd?.status === 'OK') {
            const arrayOrdered = []
            order?.orderItemsSelected?.forEach(element => {
                arrayOrdered.push(element.product)
            });
            message.success('Đặt hàng thành công!')
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
            navigate('/order-details', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPriceMemo: totalPriceMemo
                }
            })
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            district: '',
            ward: '',
            isAdmin: false
        })
        form.resetFields()
        setIsOpenModalUpdateInfo(false)
    }

    const onSuccessPaypal = (details, data) => {
        mutationAddOrder.mutate(
            {
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                ward: user?.ward,
                district: user?.district,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: lastShippingPrice,
                totalPrice: totalPriceMemo,
                user: user?.id,
                isPaid: true,
                paidAt: details.update_time,
                email: user?.email,
                delivery: order?.delivery
            }
        )
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

    const handlePayment = (e) => {
        const selectedPayment = e.target.value;
        setPayment(selectedPayment);
        if (selectedPayment === 'bank_transfer') {
            setIsQrModalOpen(true); // Mở popup khi chọn bank_transfer
        }
    }

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig()
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
        script.async = true;
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript()
        } else {
            setSdkReady(true)
        }
    }, [])

    const closeQrModal = () => {
        setIsQrModalOpen(false);
    };

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
        <div style={{ width: '100%', height: '140vh', backgroundColor: '#f5f5fa' }}>
            <HeaderComponent isHiddenSearch />
            <Loading isLoading={loading}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto', backgroundColor: '#fff' }}>
                    <div style={{ padding: '10px 20px', fontWeight: 'bold', color: '#493628', fontSize: '20px' }}>Thanh toán</div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            <WrapperStyleHeaderDelivery>
                                <StepComponent
                                    items={itemsDelivery}
                                    current={
                                        shippingPriceMemo === 30000
                                            ? 2 : shippingPriceMemo === 20000
                                                ? 1 : order.orderItemsSelected?.length === 0
                                                    ? 0 : shippingPriceMemo === 50000
                                                        ? 3 : shippingPriceMemo === 0
                                                            ? 0 : shippingPriceMemo
                                    }
                                />
                            </WrapperStyleHeaderDelivery>
                            <WrapperPaymentMethod>
                                <div>
                                    <Lable>Chọn phương thức giao hàng</Lable>
                                    <WrapperRadio onChange={handleDilivery} value={delivery}>
                                        <Radio value="ghtk"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GHTK</span> Giao hàng tiết kiệm</Radio>
                                        <Radio value="viettelpost"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>VIETTEL POST</span> Giao hàng hoả tốc</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperPaymentMethod>
                            <WrapperPaymentMethod>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio onChange={handlePayment} value={payment}>
                                        <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                        <Radio value="paypal"> Thanh toán bằng PayPal</Radio>
                                        <Radio value="bank_transfer"> Thanh toán bằng chuyển khoản ngân hàng</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperPaymentMethod>
                            {payment === 'bank_transfer' && (
                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <p style={{ fontSize: '14px', color: '#C7001C' }}>
                                        <strong>Nội dung chuyển khoản: SĐT + Email</strong>
                                    </p>
                                    <div style={{ textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>(Khi nhận được tiền quản trị viên sẽ cập nhật đơn hàng đã thanh toán)</div>
                                    <img
                                        src={bankQr}
                                        alt="QR code ngân hàng"
                                        style={{ width: '400px', height: '400px', marginBottom: '10px' }}
                                    />
                                </div>
                            )}
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
                                        <span>Địa chỉ: {`${user?.address}, ${user?.ward}, ${user?.district}, ${user?.city}`}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                        <span>SĐT: {`${user?.phone}`}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                        <span>Email: {`${user?.email}`}</span>
                                    </div>
                                </WrapperInfoAddress>
                                <WrapperInfo>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '14px' }}>Tạm tính:</span>
                                        <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>{convertPrice(preTotalPriceMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px' }}>
                                        <span style={{ fontSize: '14px' }}>Phí giao hàng:</span>
                                        <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>
                                            {priceMemo >= 2000000 && (
                                                <div style={{ textDecorationLine: 'line-through', color: '#ccc' }}>
                                                    {convertPrice(minusShippingPrice)}
                                                </div>
                                            )}
                                            <div>{convertPrice(lastShippingPrice)}</div>
                                        </span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span style={{ fontSize: '14px' }}>Tổng tiền:</span>
                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: '#0057A1', fontSize: '16px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                        <span style={{ color: '#000', fontSize: '11px', textAlign: 'center' }}>(Giá đã bao gồm VAT)</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            <div style={{ width: '100%' }}>
                                {payment === 'paypal' && sdkReady ? (
                                    <div style={{ width: '291px' }}>
                                        <PayPalButton
                                            amount={Math.round(totalPriceMemo / 30000)}
                                            onSuccess={onSuccessPaypal}
                                            onError={() => {
                                                alert('Lỗi!')
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <ButtonComponent
                                        onClick={handleAddOrder}
                                        disabled={loading} // Vô hiệu hóa nút khi đang loading
                                        size={40}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        styleButton={{
                                            background: isHovered ? '#8C6B53' : '#493628',
                                            height: '50px',
                                            width: '291px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            transition: 'background 0.3s',
                                        }}
                                        textbutton={loading ? 'Đang xử lý...' : 'Đặt hàng'} // Thay đổi nội dung khi loading
                                        styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}
                                    ></ButtonComponent>

                                )}
                            </div>
                        </WrapperRight>
                    </div>
                </div>
                <Modal
                    title="Thông tin chuyển khoản ngân hàng"
                    open={isQrModalOpen}
                    onCancel={closeQrModal}
                    footer={null}
                >
                    <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#C7001C' }}>Nội dung chuyển khoản: SĐT + Email</p>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', fontStyle: 'italic' }}>(Khi nhận được tiền quản trị viên sẽ cập nhật đơn hàng đã thanh toán)</p>
                    <img
                        src={bankQr}
                        alt="QR code ngân hàng"
                        style={{ width: '100%', maxWidth: '400px', display: 'block', margin: '0 auto' }}
                    />
                </Modal>
            </Loading >
        </div >
    )
}

export default PaymentPage