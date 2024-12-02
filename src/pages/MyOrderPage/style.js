import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
    border: 1px solid #ccc;
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span{
        color: rgb(36, 36, 36);
        font-weight: 400;
    }
    width: 850px;
`

export const WrapperListOrder = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 20px;
`

export const WrapperStatus = styled.div`
    display: flex;
    align-item: flex-start;
    width: 100%;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgb(0, 0, 0);
    flex-direction: column;
`

export const WrapperHeaderItem = styled.div`
    width: 100%;
    display: flex;
    padding: 10px;
    align-items: center;
    border-bottom: 1px solid rgb(0, 0, 0);
`

export const WrapperFooter = styled.div`
    text-align: right;
    margin-top: 20px;
    float: right;
`


export const WrapperItemOrder = styled.div`
    padding: 10px 20px;
    border: 1px solid #000000;
    width: 100%;
    justify-content: center;
    border-radius: 10px;
    background: #E0E7FF;
    border-bottom: 1px solid rgb(0, 0, 0);
`

export const WrapperContainer = styled.div`
    height: 100%;
`

export const WrapperValue = styled.div`
    background: rgb(240, 248, 255);
    border: 1px solid rgb(0, 0, 0);
    padding: 10px;
    margin-top: 5px;
    border-radius: 6px;
    width: fit-content;
`

export const WrapperInfoAddress = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #ccc;
    border: 1px solid #ccc;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    width: 250px;
`

export const WrapperTotal = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 17px 20px;
    border: 1px solid #ccc;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    width: 250px;
`

export const Lable = styled.span`
    font-size: 14px;
    font-weight: bold;
    width: 250px;
`

export const WrapperPaymentMethod = styled.div`
    padding: 17px 20px;
    border-top: 1px solid #ccc;
    width: 100%;
`