import React, { useMemo } from "react"
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperItemLabelTotal, WrapperItemTotal, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent, WrapperTitle } from "./style"
import * as OrderService from '../../services/OrderService'
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { orderContant } from "../../contant"
import { convertPrice } from "../../utils"
import { useLocation, useParams } from "react-router-dom"
import Loading from "../../components/LoadingComponent/Loading"
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent"

const CheckMyOrder = () => {
    const params = useParams()
    const location = useLocation()
    const { state } = location
    const { id } = params
    const user = useSelector(state => state.user);


    const fetchMyOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token);
        return res.data;
    };

    const { isLoading, error, data } = useQuery({
        queryKey: ['orders-details'],
        queryFn: fetchMyOrder,
        enabled: !!id && !!state?.token,
    });

    const { shippingAddress = '', orderItems = [], shippingPrice = '', paymentMethod = '', delivery = '', isPaid = false, totalPrice = '' } = data || {};

    const priceMemo = useMemo(() => {
        const result = data?.orderItems.reduce((total, cur) => {
            return total + (cur.price * cur.amount);
        }, 0);
        return result;
    }, [data]);

    return (
        <Loading isLoading={isLoading}>
            <HeaderComponent isHiddenSearch />
            <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5fa' }}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto', paddingTop: '10px' }}>
                    <div style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'center', paddingBottom: '20px' }}>Chi tiết đơn hàng</div>
                    <WrapperHeaderUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Địa chỉ nhận hàng</WrapperLabel>
                            <WrapperContentInfo>
                                <WrapperTitle className='name-info'>Tên người nhận: {shippingAddress?.fullName}</WrapperTitle>
                                <WrapperTitle className='address-info'><span>Địa chỉ: </span><span>{shippingAddress?.address}, {shippingAddress?.ward}, {shippingAddress?.district}, {shippingAddress?.city}</span></WrapperTitle>
                                <WrapperTitle className='phone-info'><span>Điện thoại: </span>{shippingAddress?.phone}</WrapperTitle>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
                            <WrapperContentInfo>
                                <WrapperTitle className='payment-info'>{orderContant.payment[data?.paymentMethod]}</WrapperTitle>
                                <WrapperTitle className='status-payment'>Trạng thái: {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</WrapperTitle>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                    </WrapperHeaderUser>
                    <div style={{ height: '20px' }} />
                    <WrapperStyleContent>
                        <div style={{ flex: 1 }}>
                            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Thông tin đơn hàng</div>
                            <WrapperProduct>
                                <WrapperItem style={{ paddingLeft: '100px', width: '500px', textAlign: 'left' }}>Tên sản phẩm</WrapperItem>
                                <WrapperItem>Số lượng </WrapperItem>
                                <WrapperItem>Giảm giá(%)</WrapperItem>
                                <WrapperItem>Đơn giá</WrapperItem>
                                <WrapperItem>Thành tiền</WrapperItem>
                            </WrapperProduct>
                            {orderItems?.map((order) => {
                                return (
                                    <WrapperProduct>
                                        <WrapperNameProduct>
                                            <img src={order?.image}
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    objectFit: 'cover',
                                                    border: '1px solid #fff',
                                                    padding: '2px'
                                                }}
                                            />
                                        </WrapperNameProduct>
                                        <WrapperItem style={{ width: '500px', textAlign: 'left' }}>{order?.name}</WrapperItem>
                                        <WrapperItem>{order?.amount}</WrapperItem>
                                        <WrapperItem>{order?.discount ? ((order?.discount)) : '0'}%</WrapperItem>
                                        <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                                        <WrapperItem>{convertPrice((order?.price * order?.amount) - ((order?.price * (order?.discount / 100)) * order?.amount))}</WrapperItem>
                                    </WrapperProduct>
                                )
                            })}
                            <WrapperAllPrice>
                                <WrapperItemLabelTotal>Tạm tính</WrapperItemLabelTotal>
                                <WrapperItemTotal>{convertPrice(priceMemo)}</WrapperItemTotal>
                            </WrapperAllPrice>
                            <WrapperAllPrice>
                                <WrapperItemLabelTotal>Phí vận chuyển</WrapperItemLabelTotal>
                                <WrapperItemTotal >{shippingPrice ? convertPrice(shippingPrice) : '0 VNĐ'}</WrapperItemTotal>
                            </WrapperAllPrice>
                            <WrapperAllPrice>
                                <WrapperItemLabelTotal>Tổng cộng</WrapperItemLabelTotal>
                                <WrapperItemTotal style={{ color: '#0057A1', fontSize: '20px' }}>{convertPrice(totalPrice)}</WrapperItemTotal>
                            </WrapperAllPrice>
                        </div>
                    </WrapperStyleContent>
                </div>
            </div>
        </Loading>
    )
}

export default CheckMyOrder