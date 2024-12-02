import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 300px;
    position: relative;
    background: #D6C0B3;
    & img {
        height: 300px;  
        width: 200px;   
        object-fit: cover;
    }
`

//ten giao vien
export const StyleNameTeacher = styled.div`
    overflow-x: hidden;
    font-weight: bold;
    text-align: center;
    font-size: 22px;
    color: #36302d;
    over-flow: hidden;
    white-space: nowrap;
`

//nhac cu
export const WrapperMusicalText = styled.span`
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
    color: rgb(120, 120, 120);
    margin-right: 30px;
`

export const WrapperStyleTextExp = styled.span`
    font-size: 13px;
    font-weight: bold;
    line-height: 24px;
    color: #9E7540;
    margin-right: 30px;
`