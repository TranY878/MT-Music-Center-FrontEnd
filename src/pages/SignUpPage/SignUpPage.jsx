import React, { useEffect } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import imageLogo from '../../assets/images/logoMT.jpg'
import { Image } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/MessageComponent/Message'
import bg from '../../assets/images/bg.jpg';


const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowCofirmPassword, setIsShowCofirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [isHovered, setIsHovered] = useState(false);
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
    )

    const { data, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') { // Kiểm tra trạng thái 'OK'
            message.success('Đăng ký thành công!') // Thông báo thành công
            handleNavigateSignIn()
        } else if (isError || (isSuccess && data?.status === 'ERR')) {
            // Nếu có lỗi hoặc trạng thái là 'ERR', hiển thị thông báo lỗi
            message.error(data?.message || 'Đăng ký thất bại, vui lòng thử lại!')
        }
    }, [isSuccess, isError, data?.status])


    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const handleSignUp = () => {
        mutation.mutate({ email, password, confirmPassword })
    }

    const navigate = useNavigate()
    const handleNavigateSignIn = () => {
        navigate('/sign-in')
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
            <div style={{ width: '800px', height: '445px', borderRadius: '20px', background: '#E1C78F', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1 style={{ color: '#493628' }}>Đăng ký tài khoản mới</h1>
                    <p>Vui lòng nhập thông tin</p>
                    <InputForm style={{ marginBottom: '5px' }} placeholder="Email" value={email} onChange={handleOnchangeEmail} />
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
                        <InputForm placeholder="Mật khẩu" style={{ marginBottom: '5px' }} type={isShowPassword ? "text" : "password"}
                            value={password} onChange={handleOnchangePassword} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowCofirmPassword(!isShowCofirmPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px',
                            }}
                        >{
                                isShowCofirmPassword ? (
                                    <EyeOutlined />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        </span>
                        <InputForm placeholder="Nhập lại mật khẩu" style={{ marginBottom: '5px' }} type={isShowPassword ? "text" : "password"}
                            value={confirmPassword} onChange={handleOnchangeConfirmPassword} />
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <ButtonComponent
                        disabled={!email.length || !password.length || !confirmPassword.length}
                        onClick={handleSignUp}
                        size={40}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        styleButton={{
                            color: '#fff',
                            background: isHovered ? '#8C6B53' : '#994D1C',
                            height: '42px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '16px 0 10px'
                        }}
                        textbutton={'Đăng ký'}
                        styletextbutton={{ color: '#E48F45', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                    <p>Đã có tài khoản?<WrapperTextLight onClick={handleNavigateSignIn}> Quay lại đăng nhập</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight style={{ borderBottomRightRadius: '20px', borderTopRightRadius: '20px' }}>
                    <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
                    <h4>Học nhạc cụ tại MT Center</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignUpPage