import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import imageLogo from '../../assets/images/logoMT.jpg'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import * as message from '../../components/MessageComponent/Message'
import bg from '../../assets/images/bg.jpg';

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const location = useLocation()
    const [email, setEmail] = useState('')
    const [isHovered, setIsHovered] = useState(false);
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();

    const mutation = useMutationHooks(
        data => UserService.loginUser(data)
    )

    const { data, isSuccess } = mutation

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') { // Kiểm tra trạng thái 'OK'
            if (location?.state) {
                navigate(location?.state)
            } else {
                navigate('/')
                message.success('Đăng nhập thành công!')
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token)
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }
        } else if (isSuccess && data?.status === 'ERR') {
            // Nếu có lỗi, hiển thị thông báo lỗi
            message.error('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!')
        }
    }, [isSuccess, data?.status, data?.access_token])


    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }

    const navigate = useNavigate()
    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh'
        }}>
            <div style={{ width: '800px', height: '445px', borderRadius: '20px', background: '#BCA37F', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1 style={{ color: '#493628' }}>Xin chào,</h1>
                    <p style={{ color: '#493628' }}>Đăng nhập để trải nghiệm tốt hơn</p>
                    <InputForm
                        style={{ marginBottom: '10px' }}
                        placeholder="Tên tài khoản"
                        value={email}
                        onChange={handleOnchangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px',
                            }}
                        >{
                                isShowPassword ? (
                                    <EyeOutlined />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        </span>
                        <InputForm
                            placeholder="Mật khẩu"
                            type={isShowPassword ? "text" : "password"}
                            value={password}
                            onChange={handleOnchangePassword} />
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <ButtonComponent
                        disabled={!email.length || !password.length}
                        onClick={handleSignIn}
                        size={40}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        styleButton={{
                            color: '#fff',
                            background: isHovered ? '#E1C78F' : '#ECB159',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textbutton={'Đăng nhập'}
                        styletextbutton={{ color: '#6B240C', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                    <p>Chưa có tài khoản?<WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight style={{ borderBottomRightRadius: '20px', borderTopRightRadius: '20px' }}>
                    <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
                    <h4>Học nhạc cụ tại MT Center</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage