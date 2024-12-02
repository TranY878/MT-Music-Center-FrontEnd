import React from 'react'
import { Lable, WrapperContainer, WrapperItemOrder, WrapperItemOrderInfo, WrapperPaymentMethod, WrapperValue } from './style'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'

const OrderDetailsPage = () => {
    const order = useSelector((state) => state.order)
    const location = useLocation()
    const { state } = location

    return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: '#f5f5fa' }}>
            <HeaderComponent isHiddenSearch />
            <div style={{ height: '100%', width: '1270px', margin: '0 auto', backgroundColor: '#fff' }}>
                <div style={{ padding: '10px 20px', fontWeight: 'bold', color: '#493628', fontSize: '20px' }}>Đơn hàng đã đặt</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WrapperContainer>
                        <WrapperPaymentMethod>
                            <div>
                                <Lable>Phương thức giao hàng</Lable>
                                <WrapperValue>
                                    <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{orderContant.delivery[state?.delivery]}</span>
                                </WrapperValue>
                            </div>
                        </WrapperPaymentMethod>
                        <WrapperPaymentMethod>
                            <div>
                                <Lable>Phương thức thanh toán</Lable>
                                <WrapperValue>
                                    {orderContant.payment[state?.payment]}
                                </WrapperValue>
                            </div>
                        </WrapperPaymentMethod>
                        <WrapperItemOrderInfo>
                            {state.orders?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?.name}>
                                        <div style={{ width: '500px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <img src={order?.image} style={{ width: '77px', height: '77px', objectFit: 'cover' }} />
                                            <div style={{
                                                width: 200,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{order?.name}</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '40px' }}>
                                            <span>
                                                <span style={{ fontSize: '16px', color: '#242424' }}>Số lượng: {order?.amount}</span>
                                            </span>
                                            <span>
                                                <span style={{ fontSize: '16px', color: '#242424' }}>Đơn giá: {convertPrice(order?.price)}</span>
                                            </span>
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperItemOrderInfo>
                        <div>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#493628', float: 'right', paddingRight: '60px' }}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span>
                        </div>
                    </WrapperContainer>
                </div>
            </div>
        </div >
    )
}

export default OrderDetailsPage