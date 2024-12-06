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

const FooterComponent = () => {
    const [loading, setLoading] = useState(false)

    return (
        <>
            <div style={{ width: '100%', background: '#A79277', display: 'flex', justifyContent: 'center', height: '150px', margin: '0 auto' }}>
                <WrapperHeader style={{ justifyContent: 'center' }}>
                    <Image style={{ cursor: 'pointer' }} src={imageLogo} preview={false} alt="image-logo" height="30px" width="30px" />
                </WrapperHeader>
            </div >
        </>
    )
}

export default FooterComponent