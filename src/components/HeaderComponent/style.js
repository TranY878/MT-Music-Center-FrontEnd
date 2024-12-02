import { Row } from "antd";
import styled from "styled-components";

//banner header
export const WrapperHeader = styled(Row)`
    padding: 10px 0;
    width: 1270px;
    background-color: #A79277;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    margin: auto;
`
//Web name
export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold,
    text-align: left;
`
//Menu name
export const WrapperTextMenu = styled.span`
    padding: 10px 0;
    width: 1270px;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    font-size: 18px;
    color: #fff;
    font-weight: bold,
    text-align: left;
    &:hover{
        color: #0057A1;
    }
`
//User
export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
`
//login cart text
export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover{
        color: rgb(0, 143, 223);
    }
`

export const WrapperMenuHeader = styled(Row)`
    width: 1270px;
    align-items: center;
    flex-wrap: nowrap;
    gap: 20px;
    padding: 10px 0;
`