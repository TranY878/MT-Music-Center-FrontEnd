import { Radio } from "antd";
import styled from "styled-components";

export const WrapperLeft = styled.div`
    width: 910px;
`
export const WrapperRight = styled.div`
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`

export const WrapperInfo = styled.div`
    padding: 17px 20px;
    border: 1px solid #AB886D;
    width: 250px;
`

export const WrapperInfoAddress = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #AB886D;
    border: 1px solid #AB886D;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    width: 250px;
`

export const WrapperTotal = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 17px 20px;
    border: 1px solid #AB886D;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    width: 250px;
`

export const WrapperRadio = styled(Radio.Group)`
    margin-top: 6px;
    font-size: 14px;
    border: 1px solid #AB886D;
    border-radius: 6px;
    width: 500px;
    background: #efefef;
    height: 100px;
    padding: 16px;
    font-weight: normal;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
`

export const Lable = styled.span`
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 10px;
    width: 250px;
`

export const WrapperPaymentMethod = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #AB886D;
    border: 1px solid #AB886D;
    border-radius: 6px;
    width: 842px;
`
//Lable,  WrapperInfo, WrapperInfoAddress, WrapperLeft,WrapperPaymentMethod, WrapperRadio, WrapperRight,WrapperTotal