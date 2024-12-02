import React, { useEffect, useState } from "react";
import { WrapperContentProflie, WrapperHeader, WrapperLabel, WrapperInput, WrapperUploadFile } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from '../../components/MessageComponent/Message'
import { updateUser } from "../../redux/slides/userSlide";
import { Button } from "antd";
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from "../../utils";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [name, setName] = useState(user?.name)
    const [email, setEmail] = useState(user?.email)
    const [phone, setPhone] = useState(user?.phone)
    const [address, setAddress] = useState(user?.address)
    const [avatar, setAvatar] = useState(user?.avatar)
    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )

    const dispatch = useDispatch()
    const { isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success('Cập nhật thông tin thành công!')
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeName = (value) => {
        setName(value)
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangePhone = (value) => {
        setPhone(value)

    }

    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })
    }
    return (
        <div style={{ width: '100%', height: '100vh', textAlign: 'center', backgroundColor: '#f5f5fa' }} >
            <HeaderComponent isHiddenSearch />
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <WrapperContentProflie>
                <WrapperInput>
                    <WrapperLabel htmlFor="name">Họ tên</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnchangeName} />
                    {/* <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            background: '#00B944',
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textbutton={'Cập nhật'}
                        styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent> */}
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="email">Email</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnchangeEmail} />
                    {/* <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            background: '#00B944',
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textbutton={'Cập nhật'}
                        styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent> */}
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="phone">Số điện thoại</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="phone" value={phone} onChange={handleOnchangePhone} />
                    {/* <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            background: '#00B944',
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textbutton={'Cập nhật'}
                        styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent> */}
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="address" value={address} onChange={handleOnchangeAddress} />
                    {/* <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            background: '#00B944',
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px'
                        }}
                        textbutton={'Cập nhật'}
                        styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent> */}
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                    <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </WrapperUploadFile>
                    {avatar && (
                        <img src={avatar} style={{
                            height: '60px',
                            width: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }} alt="avatar" />
                    )}
                    {/* <InputForm style={{ width: '300px' }} id="avatar" value={avatar} onChange={handleOnchangeAvatar} /> */}
                </WrapperInput>
                <ButtonComponent
                    onClick={handleUpdate}
                    size={40}
                    styleButton={{
                        background: '#00B944',
                        height: '30px',
                        width: 'fit-content',
                        borderRadius: '4px',
                        padding: '2px 6px 6px',
                    }}
                    textbutton={'Cập nhật'}
                    styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                ></ButtonComponent>
            </WrapperContentProflie>
        </div>
    )
}

export default ProfilePage