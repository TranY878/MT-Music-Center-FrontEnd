import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 300px;
    position: relative;
    background: #BC9F8B;
    & img {
        height: 300px;  
        width: 200px;   
        object-fit: cover;
    }
`

//ten san pham
export const StyleNameTeacher = styled.div`
    overflow-x: hidden;
    font-weight: bold;
    font-size: 18px;
    color: rgb(56, 56, 61);
    over-flow: hidden;
    white-space: nowrap;
`
//gia
export const WrapperPriceText = styled.div`
    color: #242020;
    font-size: 14px;
    font-weight: bold;
`

//thong ke
export const WrapperStyleType = styled.span`
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    color: #493628;
    margin-right: 30px;
`