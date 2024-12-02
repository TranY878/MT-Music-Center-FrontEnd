import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Col } from "antd";

export const WrapperTypeProduct = styled.div`
    align-items: center;
    gap: 20px;
    height: 20px;
    flex-wrap: nowrap;
    padding-bottom: 15px;
    display: flex;
`

export const WrapperButtonMore = styled(ButtonComponent)`
    width: 100%;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`

export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    padding: 14px;
`

export const WrapperNavbar = styled(Col)`
    align-items: center;
    gap: 20px;
    height: 1px;
    flex-wrap: wrap;
    padding: 5px 5px;
`