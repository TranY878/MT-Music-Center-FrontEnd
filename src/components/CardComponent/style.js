import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img {
        height: 300px;
        width: 200px;
    },
    position: relative;
    background: #fff;
`

//ten san pham
export const StyleNameProduct = styled.div`
    overflow-x: hidden;
    font-weight: bold;
    font-size: 18px;
    color: rgb(56, 56, 61);
    over-flow: hidden;
    white-space: nowrap;
`
//so sao, luong ban
export const WrapperReporText = styled.div`
    font-size: 12px;
    color: rgb(128, 128, 61);
    display: flex;
    align-items: center;
    margin: 6px 0 0px;
`
//gia
export const WrapperPriceText = styled.div`
font-size: 12px;
font-weight: 500;
text-decoration-line: line-through;
color: rgb(255, 66, 78);
`

export const WrapperPriceSaleText = styled.div`
color: #CA965C;
font-size: 24px;
font-weight: bold;
    text-align: center;
    `

//giam gia
export const WrapperDiscountText = styled.span`
font-size: 12px;
font-weight: 500;
color: green;
`

//thong ke
export const WrapperStyleTextSell = styled.span`
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
    color: rgb(120, 120, 120);
    margin-right: 30px;
`