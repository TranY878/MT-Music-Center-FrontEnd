import React, { useEffect, useState } from 'react';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { WrapperStatus, WrapperHeaderItem, WrapperFooter, WrapperContainer, WrapperItemOrder, WrapperListOrder } from './style';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';

const MyOrderPage = () => {
    const location = useLocation();
    const { state } = location || {};
    const navigate = useNavigate();
    const [isHoveredSee, setIsHoveredSee] = useState(false);
    const [isHoveredCancel, setIsHoveredCancel] = useState(false);


    const [visibleOrders, setVisibleOrders] = useState([]); // State để quản lý các đơn hàng hiển thị

    const getCanceledOrdersFromStorage = () => {
        return JSON.parse(localStorage.getItem('canceledOrders')) || [];
    };

    const fetchMyOrder = async () => {
        if (!state?.id || !state?.token) {
            message.error('Không tìm thấy người dùng!');
            return [];
        }

        try {
            const res = await OrderService.getOrderbyUserId(state.id, state.token);
            if (res?.data) {
                res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                // Lấy các đơn hàng đã hủy từ localStorage và lọc chúng ra khỏi danh sách hiển thị
                const canceledOrders = getCanceledOrdersFromStorage();
                const filteredOrders = res.data.filter(order => !canceledOrders.includes(order._id));
                setVisibleOrders(filteredOrders); // Cập nhật lại danh sách đơn hàng hiển thị

                return filteredOrders;
            }
            return res.data;
        } catch (error) {
            message.error('Liệt kê đơn hàng thất bại!');
            throw new Error('Lỗi khi liệt kê đơn hàng');
        }
    };

    const { isLoading, data } = useQuery({
        queryKey: ['orders', state?.id],
        queryFn: fetchMyOrder,
        enabled: !!state?.id && !!state?.token,
    });

    useEffect(() => {
        if (data) {
            setVisibleOrders(data);
        }
    }, [data]);

    const handleDetailsOrder = (id) => {
        navigate(`/check-my-order/${id}`, {
            state: {
                token: state?.token
            }
        });
    };

    const renderProduct = (data) => {
        return data?.map((order) => (
            <WrapperHeaderItem key={order?._id}>
                <img
                    src={order?.image}
                    style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'cover',
                        border: '1px solid rgb(238, 238, 238)',
                        padding: '2px'
                    }}
                />
                <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginLeft: '10px',
                }}>{order?.name}</div>
                <span style={{ fontSize: '15px', color: '#242424', paddingLeft: '400px' }}>Số lượng: {(order?.amount)}</span>
                <span style={{ fontSize: '15px', color: '#242424', paddingLeft: '200px' }}>Đơn giá: {convertPrice(order?.price)}</span>
            </WrapperHeaderItem>
        ));
    };

    const handleCancelOrder = async (order) => {
        try {
            // Cập nhật trạng thái đơn hàng thành "Đã hủy"
            const updatedOrder = { ...order, status: 'Đã hủy' };
            await OrderService.updateOrderStatus(order._id, updatedOrder, state?.token);

            // Ẩn đơn hàng sau khi hủy và lưu vào localStorage
            setVisibleOrders(prevOrders => prevOrders.filter(o => o._id !== order._id));

            const canceledOrders = getCanceledOrdersFromStorage();
            localStorage.setItem('canceledOrders', JSON.stringify([...canceledOrders, order._id]));

            message.success('Đơn hàng đã được hủy!');
        } catch (error) {
            message.error('Hủy đơn hàng thất bại!');
        }
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <HeaderComponent isHiddenSearch />
            <Loading isLoading={isLoading}>
                <WrapperContainer>
                    <div style={{ height: '100vh', width: '1270px', margin: '0 auto' }}>
                        <h4>Đơn hàng của tôi</h4>
                        <WrapperListOrder>
                            {visibleOrders.map((order) => (
                                <WrapperItemOrder key={order?._id}>
                                    <WrapperStatus>
                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Trạng thái</span>
                                        <div>
                                            <span style={{ color: '#0057A1', fontWeight: 'bold' }}>Giao hàng: </span>
                                            {`${order.shippingStatus}`}
                                        </div>
                                        <div>
                                            <span>
                                                <span style={{ color: '#0057A1', fontWeight: 'bold' }}>Thanh toán: </span>
                                                {`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}
                                            </span>
                                        </div>
                                    </WrapperStatus>
                                    {renderProduct(order?.orderItems)}
                                    <WrapperFooter>
                                        <div>
                                            <span style={{ fontSize: '16px', color: '#0057A1', fontWeight: 'bold' }}>Tổng tiền: </span>
                                            <span style={{ fontSize: '16px', color: 'rgb(56, 56, 61)', fontWeight: 'bold' }}>{convertPrice(order?.totalPrice)}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <ButtonComponent
                                                onClick={() => handleDetailsOrder(order?._id)}
                                                size={40}
                                                onMouseEnter={() => setIsHoveredSee(true)}
                                                onMouseLeave={() => setIsHoveredSee(false)}
                                                styleButton={{
                                                    background: isHoveredSee ? '#0057A1' : '#00A9E5',
                                                    height: '40px',
                                                    borderRadius: '4px',
                                                }}
                                                textbutton={'Xem chi tiết'}
                                                styletextbutton={{ color: '#fff', fontSize: '15px' }}
                                            />
                                            {!order?.isPaid && !order?.isDelivered && ( // Chỉ hiển thị nếu chưa thanh toán và chưa giao hàng
                                                <ButtonComponent
                                                    onClick={() => handleCancelOrder(order)}
                                                    onMouseEnter={() => setIsHoveredCancel(true)}
                                                    onMouseLeave={() => setIsHoveredCancel(false)}
                                                    size={40}
                                                    styleButton={{
                                                        background: isHoveredCancel ? '#D50015' : '#FF0023',
                                                        height: '40px',
                                                        borderRadius: '4px',
                                                    }}
                                                    textbutton={'Hủy đơn hàng'}
                                                    styletextbutton={{ color: '#fff', fontSize: '15px' }}
                                                />
                                            )}
                                        </div>
                                    </WrapperFooter>
                                </WrapperItemOrder>
                            ))}
                        </WrapperListOrder>
                    </div>
                </WrapperContainer>
            </Loading>
        </div>
    );
}

export default MyOrderPage;
