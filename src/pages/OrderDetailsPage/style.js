import { Radio } from "antd";
import styled from "styled-components";
//Lable, WrapperContainer,  WrapperItemOrder, WrapperItemOrderInfo, WrapperPaymentMethod,  WrapperValue 

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding-left: 200px;
    margin-top: 2px;
    width: 850px;
    justify-content: center;
`

export const WrapperItemOrderInfo = styled.div`
    padding: 17px 20px;
    border-top: 1px solid #493628;
    width: 1230px;
    justify-content: center;
`

export const WrapperContainer = styled.div`
    width: 100%;
`

export const WrapperValue = styled.div`
    background: #D6C0B3;
    padding: 10px;
    margin-top: 5px;
    border-radius: 6px;
    width: fit-content;
`

export const Lable = styled.span`
    font-size: 14px;
    font-weight: bold;
    width: 250px;
`

export const WrapperPaymentMethod = styled.div`
    padding: 17px 20px;
    border-top: 1px solid #493628;
    width: 1230px;
`