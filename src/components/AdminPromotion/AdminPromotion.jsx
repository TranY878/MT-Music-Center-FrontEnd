import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import axios from 'axios'; // Đừng quên import axios
import * as ProductService from '../../services/ProductService';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

const AdminPromotion = () => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Fetch products
    const fetchProducts = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`);
        return response.data;
    };

    const { data: fetchedProducts, error, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    const addDiscount = useMutation((discount) => {
        return ProductService.addDiscount(discount, user?.access_token); // Passing access token if needed
    });

    const onFinish = (values) => {
        const discountPayload = {
            products: selectedProducts,
            discount: values.discount,
            startDate: values.startDate.format(),
            endDate: values.endDate.format(),
        };

        addDiscount.mutate(discountPayload, {
            onSuccess: () => {
                message.success('Thêm chương trình khuyến mãi thành công!');
                form.resetFields();
                setSelectedProducts([]);
            },
            onError: () => {
                message.error('Có lỗi xảy ra khi thêm chương trình khuyến mãi.');
            },
        });
    };

    const handleSelectChange = (value) => {
        setSelectedProducts(value);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <div>
            <h1>Quản lý chương trình khuyến mãi</h1>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                    label="Giá trị giảm giá"
                    name="discount"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá!' }]}
                >
                    <Input type="number" placeholder="Nhập giá trị giảm giá (%)" />
                </Form.Item>

                <Form.Item
                    label="Ngày bắt đầu"
                    name="startDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    label="Ngày kết thúc"
                    name="endDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    label="Chọn sản phẩm"
                    name="products"
                    rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        onChange={handleSelectChange}
                        placeholder="Chọn sản phẩm"
                        options={fetchedProducts?.data?.map(product => ({ label: product.name, value: product._id }))}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo chương trình khuyến mãi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AdminPromotion;
