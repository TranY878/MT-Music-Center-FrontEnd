import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from "../../utils";
import { FormOutlined, IdcardOutlined, ShoppingCartOutlined, ShoppingOutlined, TagOutlined, TeamOutlined } from '@ant-design/icons';
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminTeacher from "../../components/AdminTeacher/AdminTeacher";
import AdminCourse from "../../components/AdminCourse/AdminCourse";
// import AdminPromotion from "../../components/AdminPromotion/AdminPromotion";

const AdminPage = () => {
    const items = [
        getItem(' Người dùng', 'user', <TeamOutlined />),
        getItem(' Sản phẩm', 'product', <ShoppingOutlined />),
        // getItem(' Khuyến mãi', 'promotion', <TagOutlined />),
        getItem(' Giáo viên', 'teacher', <IdcardOutlined />),
        getItem(' Khóa học', 'course', <FormOutlined />),
        getItem(' Đơn hàng', 'order', <ShoppingCartOutlined />)
    ];

    const [keySelected, setKeySelected] = useState('');

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'product':
                return (
                    <AdminProduct />
                )
            // case 'promotion':
            //     return (
            //         <AdminPromotion />
            //     )
            case 'teacher':
                return (
                    <AdminTeacher />
                )
            case 'course':
                return (
                    <AdminCourse />
                )
            case 'order':
                return (
                    <AdminOrder />
                )
            default:
                return <></>
        }
    }

    const handleOnClick = ({ key }) => {
        setKeySelected(key)
    }

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart isHiddenMenuHeader />
            <div style={{ display: 'flex', overflowX: 'hidden' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '200vh'
                    }}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ flex: 1, padding: '15px 0 15px 15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    )
}

export default AdminPage