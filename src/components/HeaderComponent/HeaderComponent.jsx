import { Badge, Col, Image, message, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperMenuHeader, WrapperTextHeader, WrapperTextHeaderSmall, WrapperTextMenu } from './style'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading'
import imageLogo from '../../assets/images/logoMT.jpg'
import { searchProduct } from '../../redux/slides/productSlide';
import { searchTeacher } from '../../redux/slides/teacherSlide';
import { searchCourse } from '../../redux/slides/courseSlide';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false, isHiddenMenuHeader = false }) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const [userName, setUserName] = useState('')
    const [search, setSearch] = useState('')
    const order = useSelector((state) => state.order)
    const [userAvatar, setUserAvatar] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }

    const handleNavigateHome = () => {
        navigate('/')
    }

    const handleNavigateProduct = () => {
        navigate('/product')
    }

    const handleNavigateTeacher = () => {
        navigate('/teacher')
    }

    const handleNavigateCourse = () => {
        navigate('/course')
    }

    const handleNavigateIntro = () => {
        navigate('/intro')
    }

    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
        handleNavigateHome()
        message.success('Đã đăng xuất tài khoản!')
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lý hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate('/profile-user')
        } else if (type === 'admin') {
            navigate('/system/admin')
        } else if (type === 'my-order') {
            navigate('/my-order', {
                state: {
                    id: user?.id,
                    token: user?.access_token
                }
            })
        } else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
        dispatch(searchTeacher(e.target.value))
        dispatch(searchCourse(e.target.value))
    }

    return (
        <>
            <div style={{ width: '100%', background: '#A79277', display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
                <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
                    <Col span={5}>
                        <Image onClick={handleNavigateHome} style={{ cursor: 'pointer' }} src={imageLogo} preview={false} alt="image-logo" height="30px" width="30px" />
                        <WrapperTextHeader onClick={handleNavigateHome} style={{ cursor: 'pointer' }}> MT Music Center</WrapperTextHeader>
                    </Col>
                    {!isHiddenMenuHeader && (
                        <WrapperMenuHeader style={{ justifyContent: isHiddenMenuHeader ? 'space-between' : 'unset' }}>
                            <Col span={2} />
                            <Col>
                                <WrapperTextMenu
                                    onClick={handleNavigateIntro}
                                    style={{ cursor: 'pointer' }}
                                >
                                    GIỚI THIỆU
                                </WrapperTextMenu>
                            </Col>
                            <Col>
                                <WrapperTextMenu
                                    onClick={handleNavigateProduct}
                                    style={{ cursor: 'pointer' }}
                                >
                                    SẢN PHẨM
                                </WrapperTextMenu>
                            </Col>
                            <Col>
                                <WrapperTextMenu
                                    onClick={handleNavigateTeacher}
                                    style={{ cursor: 'pointer' }}
                                >
                                    GIÁO VIÊN
                                </WrapperTextMenu>
                            </Col>
                            <Col>
                                <WrapperTextMenu
                                    onClick={handleNavigateCourse}
                                    style={{ cursor: 'pointer' }}
                                >
                                    KHÓA HỌC
                                </WrapperTextMenu>
                            </Col>
                            <Col>
                                <WrapperTextMenu
                                    onClick={handleNavigateHome}
                                    style={{ cursor: 'pointer' }}
                                >
                                    ƯU ĐÃI
                                </WrapperTextMenu>
                            </Col>
                            <Col>
                                <WrapperTextMenu
                                    onClick={handleNavigateHome}
                                    style={{ cursor: 'pointer' }}
                                >
                                    TÀI LIỆU
                                </WrapperTextMenu>
                            </Col>
                        </WrapperMenuHeader>
                    )}
                    <Col span={5} style={{ display: 'flex', gap: '54px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Loading isLoading={loading}>
                            <WrapperHeaderAccount>
                                {userAvatar ? (
                                    <img src={userAvatar} alt="avatar" style={{
                                        height: '30px',
                                        width: '30px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }} />
                                ) : (
                                    <UserOutlined style={{ fontSize: '30px' }} />
                                )}
                                {user?.access_token ? (
                                    <>
                                        <Popover content={content} trigger="click" open={isOpenPopup}>
                                            <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)} >{userName?.length ? userName : user?.email}</div>
                                        </Popover>
                                    </>
                                ) : (
                                    <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                        <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                        <div>
                                            <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                            <CaretDownOutlined />
                                        </div>
                                    </div>
                                )}
                            </WrapperHeaderAccount>
                        </Loading>
                        {!isHiddenCart && (
                            <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                                <Badge count={order?.orderItems?.length} size="small">
                                    <ShoppingCartOutlined style={{ fontSize: '40px', color: '#fff' }} />
                                </Badge>
                                <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                            </div>
                        )}
                    </Col>
                </WrapperHeader>
            </div>
            <div style={{ backgroundColor: '#D6C0B3' }}>
                <div style={{ width: '1270px', height: '30px', display: 'flex', justifyContent: 'flex-start', paddingTop: '5px', margin: '0 auto' }}>
                    <Col span={5}>
                        <div style={{ color: '#484040', fontWeight: 'bold' }}><MailOutlined /> mtmusiccenter@gmail.com</div>
                    </Col>
                    <Col span={16}>
                        <div style={{ color: '#484040', fontWeight: 'bold' }}><PhoneOutlined /> 0947992325</div>
                    </Col>
                    {!isHiddenSearch && (
                        <Col span={3}>
                            <ButtonInputSearch
                                size="small"
                                bordered={false}
                                placeholder="Nhập từ khóa..."
                                onChange={onSearch}
                            />
                        </Col>
                    )}
                </div>
            </div >
        </>
    )
}

export default HeaderComponent