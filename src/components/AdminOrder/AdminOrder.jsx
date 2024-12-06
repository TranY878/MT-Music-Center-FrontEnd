import React, { useEffect, useState } from "react";
import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, DatePicker, Modal, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { convertPrice } from "../../utils";
import * as OrderService from '../../services/OrderService'
import * as message from '../../components/MessageComponent/Message'
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loading from "../LoadingComponent/Loading";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import { WrapperHeader } from "../AdminCourse/style";

const AdminOrder = () => {
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state?.user)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDelivered, setIsDelivered] = useState(false); // Thêm state để kiểm soát giao hàng đã xác nhận hay chưa
    const [isCompleted, setIsCompleted] = useState(false); // Thêm state để kiểm soát hoàn tất đơn hàng
    const [showBlacklist, setShowBlacklist] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
    const [isDateSelectionModalOpen, setIsDateSelectionModalOpen] = useState(false);
    const [revenueData, setRevenueData] = useState({
        revenue: 0,
        productsSold: []
    });



    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
    }

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder

    useEffect(() => {
        if (!orders) return;  // Kiểm tra xem orders đã có giá trị hay chưa

        // Lấy danh sách các đơn hàng mới đã được thông báo trước đó từ localStorage
        const notifiedNewOrders = JSON.parse(localStorage.getItem('notifiedNewOrders')) || [];

        // Tìm các đơn hàng mới (status = 'Mới')
        const newOrders = orders.data.filter(order => order.status === 'Mới!');

        // Tìm những đơn hàng mới mà chưa được thông báo
        const newUnnotifiedOrders = newOrders.filter(order => !notifiedNewOrders.includes(order._id));

        console.log('Đơn hàng mới chưa thông báo:', newUnnotifiedOrders);

        if (newUnnotifiedOrders.length > 0) {
            // Nếu có đơn hàng mới chưa được thông báo, hiển thị thông báo
            message.warning('Có đơn hàng mới!');

            // Cập nhật danh sách các đơn hàng đã thông báo vào localStorage
            const updatedNotifiedOrders = [...notifiedNewOrders, ...newUnnotifiedOrders.map(order => order._id)];
            localStorage.setItem('notifiedNewOrders', JSON.stringify(updatedNotifiedOrders));
        }
    }, [orders]);

    useEffect(() => {
        // Lấy danh sách các đơn hàng hủy đã được thông báo trước đó từ localStorage
        const notifiedCancelledOrders = JSON.parse(localStorage.getItem('notifiedCancelledOrders')) || [];

        // Tìm các đơn hàng bị hủy hiện tại
        const cancelledOrders = orders?.data?.filter(order => order.status === 'Đã hủy') || [];

        // Tìm những đơn hàng bị hủy mà chưa được thông báo
        const newCancelledOrders = cancelledOrders.filter(order => !notifiedCancelledOrders.includes(order._id));

        if (newCancelledOrders.length > 0) {
            // Nếu có đơn hàng mới bị hủy, hiển thị thông báo
            message.warning('Có đơn hàng vừa hủy!');

            // Cập nhật danh sách các đơn hàng đã thông báo vào localStorage
            const updatedNotifiedOrders = [...notifiedCancelledOrders, ...newCancelledOrders.map(order => order._id)];
            localStorage.setItem('notifiedCancelledOrders', JSON.stringify(updatedNotifiedOrders));
        }
    }, [orders]);


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    // ref={searchInput}
                    placeholder={`Từ khóa `}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        // onClick={() => clearFilters && handleReset(clearFilters)}
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
                // setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const showOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        setIsDelivered(order.isDelivered); // Cập nhật trạng thái của đơn hàng khi mở modal
        setIsCompleted(order.status === 'Đã hoàn tất'); // Kiểm tra nếu đơn hàng đã hoàn tất
    };

    const columns = [
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            defaultSortOrder: 'descend',
            render: (text) => new Date(text).toLocaleString('vi-VN'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone'),
            render: (text) => {
                return text.startsWith('0') ? text : `0${text}`; // Đảm bảo hiển thị số 0 ở đầu
            },
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'city',
            sorter: (a, b) => a.city.length - b.city.length,
            ...getColumnSearchProps('city'),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'itemsPrice',
            sorter: (a, b) => a.itemsPrice.length - b.itemsPrice.length,
            ...getColumnSearchProps('itemsPrice'),
        },
        {
            title: 'Thanh toán',
            dataIndex: 'isPaid',
            sorter: (a, b) => a.isPaid.length - b.isPaid.length,
            ...getColumnSearchProps('isPaid'),
        },
        {
            title: 'Giao hàng',
            dataIndex: 'shippingStatus',
            sorter: (a, b) => a.shippingStatus.length - b.shippingStatus.length,
            ...getColumnSearchProps('isDelivered'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',  // Thêm cột trạng thái
            sorter: (a, b) => a.status.length - b.status.length,
            render: (status) => {
                let color = '';
                if (status === 'Đã hủy') {
                    color = 'red'; // Màu đỏ cho đơn đã hủy
                } else if (status === 'Mới!') {
                    color = '#0ADB00'; // Màu xanh lá cho đơn hàng mới
                } else if (status === 'Đang xử lý') {
                    color = '#004B8D'; // Màu xanh cho đơn hàng đang xử lý
                }

                return <span style={{ color }}>{status}</span>;
            }
        },
        {
            title: 'Cập nhật',
            render: (_, order) => (
                <Button type="link" onClick={() => showOrderDetails(order)}>
                    <EyeOutlined />
                </Button>
            ),
        },
    ];

    const confirmDelivery = async (order) => {
        setLoading(true);
        try {
            const rawItemsPrice = order.itemsPrice || '0';
            const itemsPrice = parseFloat(rawItemsPrice.replace(/\./g, '').replace(' VNĐ', '').trim()) || 0;

            const updatedOrder = {
                ...order,
                isDelivered: true,  // Chỉ cập nhật isDelivered thành true
                isPaid: order.isPaid === 'Đã thanh toán',  // Chuyển đổi isPaid về dạng Boolean
                shippingStatus: 'Đang vận chuyển',
                status: 'Đang xử lý',
                itemsPrice,
                paymentMethod: orderContant.payment[order?.paymentMethod]  // Giữ nguyên giá trị paymentMethod
            };

            await OrderService.updateOrderStatus(order._id, updatedOrder, user?.access_token);

            message.success("Đã cập nhật thành 'Đang vận chuyển'!");
            setIsModalOpen(false);
            queryOrder.refetch();
            setIsDelivered(true); // Đánh dấu rằng đơn hàng đã được giao
        } catch (error) {
            message.error("Cập nhật trạng thái đơn hàng thất bại!");
        } finally {
            setLoading(false);
        }
    };

    // Hàm hoàn tất đơn hàng
    const confirmComplete = async (order) => {
        setLoading(true);
        try {
            // Loại bỏ 'VNĐ' và dấu '.' khỏi chuỗi để chuyển đổi thành số
            const rawItemsPrice = order.itemsPrice || '0';
            const itemsPrice = parseFloat(rawItemsPrice.replace(/\./g, '').replace(' VNĐ', '').trim()) || 0;

            const updatedOrder = {
                ...order,
                shippingStatus: 'Đã giao',
                status: 'Đã hoàn tất', // Cập nhật trạng thái thành "Đã hoàn tất"
                isPaid: true, // Đánh dấu đơn hàng đã thanh toán
                itemsPrice, // Cập nhật lại itemsPrice đã chuyển đổi
                isDelivered: true, // Đảm bảo giá trị isDelivered được set về Boolean true
                paymentMethod: orderContant.payment[order?.paymentMethod]  // Giữ nguyên giá trị paymentMethod
            };

            await OrderService.updateOrderStatus(order._id, updatedOrder, user?.access_token);

            message.success("Đã hoàn tất đơn hàng!");
            setIsModalOpen(false);
            queryOrder.refetch();
            setIsCompleted(true); // Đánh dấu đơn hàng đã hoàn tất
        } catch (error) {
            message.error("Hoàn tất đơn hàng thất bại!");
        } finally {
            setLoading(false);
        }
    };

    // Hàm cập nhật trạng thái thanh toán
    const handleConfirmPaid = async (order) => {
        setLoading(true);
        try {
            // Chuyển đổi itemsPrice từ chuỗi định dạng tiền tệ sang số
            const rawItemsPrice = order.itemsPrice || '0';
            const itemsPrice = parseFloat(rawItemsPrice.replace(/\./g, '').replace(' VNĐ', '').trim()) || 0;

            // Chuyển đổi isDelivered thành Boolean
            const isDelivered = order.isDelivered === 'Đã giao hàng'; // true nếu đã giao hàng, false nếu chưa

            // Đối tượng cập nhật
            const updatedOrder = {
                ...order,
                isPaid: true, // Đánh dấu thanh toán
                itemsPrice, // Đảm bảo itemsPrice là số
                isDelivered, // Đảm bảo isDelivered là Boolean
                paymentMethod: orderContant.payment[order?.paymentMethod]
            };

            // Gửi API cập nhật trạng thái
            const response = await OrderService.updateOrderStatus(order._id, updatedOrder, user?.access_token);

            // Đồng bộ lại state selectedOrder
            setSelectedOrder((prevOrder) => ({
                ...prevOrder,
                isPaid: true, // Cập nhật trạng thái thanh toán
                paymentMethod: prevOrder.paymentMethod || order.paymentMethod, // Đảm bảo giữ nguyên paymentMethod
            }));

            message.success("Đã xác nhận thanh toán chuyển khoản thành công!");
            setIsModalOpen(false); // Đóng modal
            queryOrder.refetch(); // Làm mới danh sách đơn hàng
        } catch (error) {
            console.error(error);
            message.error("Xác nhận thanh toán thất bại!");
        } finally {
            setLoading(false);
        }
    };



    const dataTable = orders?.data?.length && orders?.data?.map((order) => {
        return {
            ...order,
            key: order._id,
            userName: order.shippingAddress?.fullName,
            phone: order.shippingAddress?.phone ? order.shippingAddress.phone.toString() : '',
            address: order?.shippingAddress?.address,
            city: order?.shippingAddress?.city,
            email: order?.shippingAddress?.email,
            itemsPrice: convertPrice(order?.itemsPrice, true), // Hiển thị định dạng chuỗi "VNĐ" khi cần
            isDelivered: order.isDelivered === 'Đang giao hàng' ? 'Đang giao hàng' : order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng',
            isPaid: order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
            status: order.status,  // Thêm trường status để hiển thị trạng thái
            paymentMethod: orderContant.payment[order?.paymentMethod]
        }
    });

    const calculateRevenue = () => {
        if (!orders || !orders.data) return 0;

        return orders.data.reduce((total, order) => {
            if (order.isPaid || order.status === 'Đã hoàn tất') {
                // Lấy giá trị itemsPrice và đảm bảo là một chuỗi
                const rawItemsPrice = order.itemsPrice || '0'; // Mặc định là '0' nếu không có giá trị
                let price;

                // Kiểm tra nếu rawItemsPrice là string
                if (typeof rawItemsPrice === 'string') {
                    price = parseFloat(rawItemsPrice.replace(/\./g, '').replace(' VNĐ', '').trim());
                } else if (typeof rawItemsPrice === 'number') {
                    price = rawItemsPrice; // Nếu là số, không cần xử lý thêm
                } else {
                    price = 0; // Nếu không phải string hay number
                }

                return total + (price || 0);  // Đảm bảo giá trị cộng lại là hợp lệ
            }
            return total;
        }, 0);
    };

    const calculateCashRevenue = () => {
        if (!orders || !orders.data) return 0;

        return orders.data.reduce((total, order) => {
            if (order.paymentMethod === 'later_money' && order.status === 'Đã hoàn tất') {
                const rawItemsPrice = order.itemsPrice || '0';
                let price;

                if (typeof rawItemsPrice === 'string') {
                    price = parseFloat(rawItemsPrice.replace(/\./g, '').replace(' VNĐ', '').trim());
                } else if (typeof rawItemsPrice === 'number') {
                    price = rawItemsPrice;
                } else {
                    price = 0;
                }
                return total + (price || 0);
            }
            return total;
        }, 0);
    };

    const calculateTransferRevenue = () => {
        if (!orders || !orders.data) return 0;

        return orders.data.reduce((total, order) => {
            if (order.paymentMethod === 'paypal' || order.paymentMethod === 'bank_transfer' && order.isPaid) {
                const rawItemsPrice = order.itemsPrice || '0';
                let price;

                if (typeof rawItemsPrice === 'string') {
                    price = parseFloat(rawItemsPrice.replace(/\./g, '').replace(' VNĐ', '').trim());
                } else if (typeof rawItemsPrice === 'number') {
                    price = rawItemsPrice;
                } else {
                    price = 0;
                }
                return total + (price || 0);
            }
            return total;
        }, 0);
    };

    const toggleBlacklist = () => {
        setShowBlacklist(prev => !prev);
    };

    const getBlackListEmails = () => {
        const emailCount = {};

        // Duyệt qua từng đơn hàng và đếm số lần email bị hủy
        orders?.data.forEach(order => {
            if (order.status === 'Đã hủy' && order?.shippingAddress?.email) { // Chắc chắn rằng email tồn tại
                const email = order.shippingAddress.email;
                emailCount[email] = (emailCount[email] || 0) + 1;
            }
        });

        // Lọc ra các email có số lượng đơn hàng bị hủy lớn hơn hoặc bằng 3
        return Object.entries(emailCount)
            .filter(([_, count]) => count >= 3)
            .map(([email]) => email);
    };

    // Gọi hàm này và hiển thị danh sách đen
    const blackListEmails = getBlackListEmails();

    const calculateRevenueByDate = () => {
        if (!startDate || !endDate) {
            message.warning("Vui lòng chọn khoảng thời gian trước khi lọc doanh thu.");
            return;
        }

        if (!orders || !orders.data) return;

        let revenue = 0;
        const productsCount = {};

        orders.data.forEach(order => {
            const orderDate = new Date(order.createdAt);

            // Áp dụng điều kiện lọc ngày và trạng thái
            if (
                (order.isPaid || order.status === 'Đã hoàn tất') &&
                orderDate >= new Date(startDate) &&
                orderDate <= new Date(endDate)
            ) {
                const rawItemsPrice = order.itemsPrice || '0';
                let price;

                if (typeof rawItemsPrice === 'string') {
                    price = parseFloat(rawItemsPrice.replace(/\./g, '').replace(' VNĐ', '').trim());
                } else if (typeof rawItemsPrice === 'number') {
                    price = rawItemsPrice;
                } else {
                    price = 0;
                }

                revenue += price || 0;

                // Đếm số lượng sản phẩm bán ra
                order.orderItems.forEach(item => {
                    if (productsCount[item.name]) {
                        productsCount[item.name] += item.amount;
                    } else {
                        productsCount[item.name] = item.amount;
                    }
                });
            }
        });

        // Tạo danh sách sản phẩm và sắp xếp theo số lượng bán giảm dần
        const productsSold = Object.entries(productsCount)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount); // Sắp xếp giảm dần theo `amount`

        setRevenueData({ revenue, productsSold });
        setIsRevenueModalOpen(true); // Mở Modal doanh thu sau khi tính toán
    };



    return (
        <div>
            <Loading isLoading={isLoadingOrders || loading}>
                <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
                <div style={{ marginTop: '20px' }}>
                    <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} showSelection={false} />
                </div>
                <Modal
                    title="Chi tiết đơn hàng"
                    open={isModalOpen}
                    onOk={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                >
                    {selectedOrder && (
                        <div>
                            <p><strong>Tên khách hàng:</strong> {selectedOrder.userName}</p>
                            <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
                            <p><strong>Email:</strong> {selectedOrder.email}</p>
                            <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                            <p><strong>Thành phố (Tỉnh):</strong> {selectedOrder.city}</p>
                            <p><strong>Thành tiền:</strong> {selectedOrder.itemsPrice}</p>
                            <p><strong>Phí giao hàng:</strong> {convertPrice(selectedOrder.shippingPrice)}</p>
                            <p><strong >Tổng hóa đơn:</strong><span style={{ color: '#0057A1', fontWeight: 'bold' }}> {convertPrice(selectedOrder.totalPrice)}</span></p>
                            <p><strong>Phương thức thanh toán:</strong> {[selectedOrder?.paymentMethod]}</p>

                            <h3 style={{ fontWeight: 'bold', color: '#cc6600' }}>Sản phẩm trong đơn hàng:</h3>
                            {selectedOrder.orderItems?.map((item, index) => (
                                <div key={index}>
                                    <p><strong>Tên sản phẩm:</strong> {item.name}</p>
                                    <p><strong>Số lượng:</strong> {item.amount}</p>
                                    <img src={item.image} alt={item.name} width={100} />
                                </div>
                            ))}
                            {/* Nút "Đã chuyển khoản" */}
                            {selectedOrder?.status === 'Mới!' &&
                                selectedOrder?.paymentMethod === 'Thanh toán bằng chuyển khoản ngân hàng' &&
                                selectedOrder?.isPaid === 'Chưa thanh toán' && (
                                    <Button
                                        type="primary"
                                        onClick={() => handleConfirmPaid(selectedOrder)}
                                        style={{ marginTop: '20px', backgroundColor: '#28a745', borderColor: '#28a745' }}
                                    >
                                        Đã chuyển khoản
                                    </Button>
                                )}
                            {/* Hiển thị nút "Xác nhận giao hàng" nếu status là "Mới!" */}
                            {selectedOrder?.status === 'Mới!' && (
                                <Button type="primary" onClick={() => confirmDelivery(selectedOrder)}>
                                    Xác nhận giao hàng
                                </Button>
                            )}

                            {/* Hiển thị nút "Hoàn tất" nếu status là "Đang xử lý" */}
                            {selectedOrder?.status === 'Đang xử lý' && (
                                <Button type="primary" onClick={() => confirmComplete(selectedOrder)}>
                                    Hoàn tất
                                </Button>
                            )}
                        </div>
                    )}
                </Modal>
                <WrapperHeader>Thống kê tổng doanh thu</WrapperHeader>

                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    Doanh thu: {convertPrice(calculateRevenue(), true)}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                    Tiền mặt: {convertPrice(calculateCashRevenue(), true)}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                    Chuyển khoản: {convertPrice(calculateTransferRevenue(), true)}
                </div>
                <Button onClick={() => setIsDateSelectionModalOpen(true)} style={{ marginTop: '20px' }}>
                    Doanh thu theo thời điểm
                </Button>
                <Modal
                    title="Chọn thời gian lọc doanh thu"
                    open={isDateSelectionModalOpen}
                    onOk={() => {
                        setIsDateSelectionModalOpen(false);
                        calculateRevenueByDate(); // Gọi hàm tính doanh thu và mở Modal hiển thị
                    }}
                    onCancel={() => setIsDateSelectionModalOpen(false)}
                >
                    <p>Thời gian bắt đầu:</p>
                    <DatePicker onChange={(date) => setStartDate(date)} />
                    <p>Thời gian kết thúc:</p>
                    <DatePicker onChange={(date) => setEndDate(date)} />
                </Modal>

                <Modal
                    title="Doanh thu theo thời điểm"
                    open={isRevenueModalOpen}
                    onOk={() => setIsRevenueModalOpen(false)}
                    onCancel={() => setIsRevenueModalOpen(false)}
                >
                    <p><strong>Doanh thu từ {startDate?.format('DD/MM/YYYY')} đến {endDate?.format('DD/MM/YYYY')}:</strong></p>
                    <div style={{ color: '#0057A1', fontWeight: 'bold', textAlign: 'center', fontSize: '24px' }}>{convertPrice(revenueData.revenue, true)}</div>
                    <div>
                        <span style={{ marginLeft: '40px', fontStyle: 'italic', fontWeight: 'bold' }}>Tên sản phẩm</span>
                        <span style={{ float: 'right', fontStyle: 'italic', fontWeight: 'bold' }}>Số lượng</span>
                    </div>
                    {revenueData.productsSold.length > 0 ? (
                        <ul>
                            {revenueData.productsSold.map((product, index) => (
                                <li key={index}>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ overflowX: 'hidden', overFlow: 'hidden', whiteSpace: 'nowrap', width: '600px', border: '1px solid #000' }}> {product.name}</div>
                                        <div style={{ width: '100px', border: '1px solid #000', textAlign: 'center' }}>{product.amount}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có sản phẩm nào được bán trong thời gian đã chọn.</p>
                    )}
                </Modal>
                <div style={{ height: '200px', width: '400px' }}>
                    <PieChartComponent data={orders?.data} />
                </div>
                <Button onClick={toggleBlacklist} style={{ marginTop: '20px', marginBottom: '10px' }}>
                    {showBlacklist ? "Ẩn Danh Sách Đen" : "Hiện Danh Sách Đen"}
                </Button>
                {showBlacklist && (
                    <div>
                        <h3>Danh sách đen (Email đã hủy 3 đơn hàng trở lên):</h3>
                        {blackListEmails.length > 0 ? (
                            <ul>
                                {blackListEmails.map((email, index) => (
                                    <li key={index}>{email}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Không có email nào trong danh sách đen.</p>
                        )}
                    </div>
                )}
            </Loading>
        </div>
    )
}

export default AdminOrder