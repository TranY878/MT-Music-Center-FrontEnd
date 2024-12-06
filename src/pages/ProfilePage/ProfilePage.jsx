import React, { useEffect, useState } from "react";
import {
    WrapperContentProflie,
    WrapperHeader,
    WrapperLabel,
    WrapperInput,
    WrapperUploadFile,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/Message";
import { updateUser } from "../../redux/slides/userSlide";
import { Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

const { Option } = Select;

const ProfilePage = () => {
    const user = useSelector((state) => state.user);
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [city, setCity] = useState(user?.city);
    const [district, setDistrict] = useState(user?.district);
    const [ward, setWard] = useState(user?.ward);
    const [address, setAddress] = useState(user?.address);
    const [avatar, setAvatar] = useState(user?.avatar);

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const dispatch = useDispatch();
    const mutation = useMutationHooks((data) => {
        const { id, access_token, ...rests } = data;
        UserService.updateUser(id, rests, access_token);
    });

    const { isSuccess, isError } = mutation;

    useEffect(() => {
        // Initialize user data
        setEmail(user?.email);
        setName(user?.name);
        setPhone(user?.phone);
        setCity(user?.city);
        setDistrict(user?.district);
        setWard(user?.ward);
        setAddress(user?.address);
        setAvatar(user?.avatar);
    }, [user]);

    useEffect(() => {
        // Notify user on success or error
        if (isSuccess) {
            message.success("Cập nhật thông tin thành công!");
            handleGetDetailsUser(user?.id, user?.access_token);
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

    useEffect(() => {
        // Fetch cities
        fetch("https://provinces.open-api.vn/api/?depth=1")
            .then((response) => response.json())
            .then((data) => setCities(data))
            .catch((error) => console.error("Failed to fetch cities:", error));
    }, []);

    useEffect(() => {
        // Fetch districts when city changes
        if (city) {
            const selectedCity = cities.find((c) => c.name === city);
            fetch(`https://provinces.open-api.vn/api/p/${selectedCity?.code}?depth=2`)
                .then((response) => response.json())
                .then((data) => setDistricts(data.districts))
                .catch((error) => console.error("Failed to fetch districts:", error));
        }
    }, [city, cities]);

    useEffect(() => {
        // Fetch wards when district changes
        if (district) {
            const selectedDistrict = districts.find((d) => d.name === district);
            fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict?.code}?depth=2`)
                .then((response) => response.json())
                .then((data) => setWards(data.wards))
                .catch((error) => console.error("Failed to fetch wards:", error));
        }
    }, [district, districts]);

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    };

    const handleUpdate = () => {
        // Prepare data with names instead of codes
        const cityName = cities.find((c) => c.name === city)?.name || city;
        const districtName = districts.find((d) => d.name === district)?.name || district;
        const wardName = wards.find((w) => w.name === ward)?.name || ward;

        mutation.mutate({
            id: user?.id,
            email,
            name,
            phone,
            address,
            city: cityName,
            district: districtName,
            ward: wardName,
            avatar,
            access_token: user?.access_token,
        });
    };

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview);
    };

    return (
        <div style={{ width: "100%", height: "100vh", textAlign: "center", backgroundColor: "#f5f5fa" }}>
            <HeaderComponent isHiddenSearch />
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <WrapperContentProflie>
                <WrapperInput>
                    <WrapperLabel htmlFor="name">Họ tên</WrapperLabel>
                    <InputForm style={{ width: "300px" }} id="name" value={name} onChange={setName} />
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="email">Email</WrapperLabel>
                    <InputForm style={{ width: "300px" }} id="email" value={email} onChange={setEmail} />
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="phone">Số điện thoại</WrapperLabel>
                    <InputForm style={{ width: "300px" }} id="phone" value={phone} onChange={setPhone} />
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="city">Tỉnh (Thành phố)</WrapperLabel>
                    <Select style={{ width: "300px" }} value={city} onChange={(value) => setCity(value)}>
                        {cities.map((c) => (
                            <Option key={c.code} value={c.name}>
                                {c.name}
                            </Option>
                        ))}
                    </Select>
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="district">Quận/Huyện</WrapperLabel>
                    <Select
                        style={{ width: "300px" }}
                        value={district}
                        onChange={(value) => setDistrict(value)}
                        disabled={!districts.length}
                    >
                        {districts.map((d) => (
                            <Option key={d.code} value={d.name}>
                                {d.name}
                            </Option>
                        ))}
                    </Select>
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="ward">Phường/Xã</WrapperLabel>
                    <Select
                        style={{ width: "300px" }}
                        value={ward}
                        onChange={(value) => setWard(value)}
                        disabled={!wards.length}
                    >
                        {wards.map((w) => (
                            <Option key={w.code} value={w.name}>
                                {w.name}
                            </Option>
                        ))}
                    </Select>
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
                    <InputForm style={{ width: "300px" }} id="address" value={address} onChange={setAddress} />
                </WrapperInput>

                <WrapperInput>
                    <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                    <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </WrapperUploadFile>
                    {avatar && (
                        <img
                            src={avatar}
                            style={{
                                height: "60px",
                                width: "60px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                            alt="avatar"
                        />
                    )}
                </WrapperInput>
                <ButtonComponent
                    onClick={handleUpdate}
                    size={40}
                    styleButton={{
                        background: "#00B944",
                        height: "30px",
                        width: "fit-content",
                        borderRadius: "4px",
                        padding: "2px 6px 6px",
                    }}
                    textbutton={"Cập nhật"}
                    styletextbutton={{ color: "#fff", fontSize: "15px", fontWeight: "700" }}
                />
            </WrapperContentProflie>
        </div>
    );
};

export default ProfilePage;
