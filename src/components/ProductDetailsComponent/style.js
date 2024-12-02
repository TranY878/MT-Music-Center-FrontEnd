import { InputNumber } from "antd";
import styled from "styled-components";

//ten san pham
export const WrapperStyleNameProduct = styled.h1`
    color: #67584c;
    font-size: 24px;
    font-weight: bold;
`

export const WrapperControl = styled.span`
    color: #A79277;
    font-size: 12px;
    cursor: pointer;
`

//thong ke
export const WrapperStyleTextSell = styled.span`
    font-size: 18px;
    padding-top: 10px;
    font-weight: bold;
    line-height: 24px;
    color: rgb(120, 120, 120);
`

export const WrapperPriceProduct = styled.div`
    border-radius: 4px;
`

//gia san pham
export const WrapperPriceTextProduct = styled.h1`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: bold;
    margin-top: 10px;
    color: #A47E3B;
`

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 80px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 30px;
        border-top: none;
        border-bottom: none;
        &.ant-input-number-handler-wrap{
            display: none;
    }
`

export const WrapperPriceSaleText = styled.div`
    color: green;
    font-size: 12px;
    font-weight: 500;
    text-decoration-line: line-through;
`