import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperButtonMore = styled(ButtonComponent)`
    width: 100%;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
`;

export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    padding: 14px;
    flex-wrap: wrap;
`;

export const WrapperShowProduct = styled.div`
    background-color: #fff;
`;
