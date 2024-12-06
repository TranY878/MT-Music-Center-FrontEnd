import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import { convertPrice } from "../../utils"; // Đảm bảo đường dẫn chính xác

const RevenueByMonth = ({ orders }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [year, setYear] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);

    const calculateRevenueByMonth = (selectedYear) => {
        if (!orders || !orders.data) return;

        const revenueByMonth = Array(12).fill(0);

        orders.data.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const orderYear = orderDate.getFullYear();
            const orderMonth = orderDate.getMonth();

            if (
                orderYear === selectedYear &&
                (order.isPaid || order.status === "Đã hoàn tất")
            ) {
                const rawItemsPrice = order.itemsPrice || 0;
                const price =
                    typeof rawItemsPrice === "string"
                        ? parseFloat(rawItemsPrice.replace(/\./g, "").replace(" VNĐ", "").trim())
                        : typeof rawItemsPrice === "number"
                            ? rawItemsPrice
                            : 0;

                revenueByMonth[orderMonth] += price;
            }
        });

        const formattedData = revenueByMonth.map((revenue, index) => ({
            month: `Tháng ${index + 1}`,
            revenue,
            formattedRevenue: convertPrice(revenue, true), // Chuẩn bị dữ liệu định dạng
        }));

        setMonthlyRevenue(formattedData);
    };

    const handleShowModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        if (!year || isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
            message.warning("Vui lòng nhập năm hợp lệ!");
            return;
        }
        calculateRevenueByMonth(parseInt(year));
        setIsModalOpen(false);
    };

    return (
        <div>
            <Button onClick={handleShowModal} style={{ marginTop: "20px" }}>
                Doanh thu theo tháng
            </Button>
            <Modal
                title="Nhập năm để thống kê doanh thu"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Input
                    type="number"
                    placeholder="Nhập năm (e.g., 2023)"
                    onChange={(e) => setYear(e.target.value)}
                />
            </Modal>
            {monthlyRevenue.length > 0 && (
                <ResponsiveContainer width="100%" height={400} style={{ marginTop: "20px" }}>
                    <BarChart
                        data={monthlyRevenue}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => convertPrice(value, true)} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#0057A1" name="Doanh thu">
                            <LabelList
                                dataKey="formattedRevenue"
                                position="top"
                                style={{ fill: "#000", fontSize: '12px' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default RevenueByMonth;
