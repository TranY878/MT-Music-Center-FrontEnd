import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
    border: 1px solid #AB886D;
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

export const WrapperStyleHeaderDelivery = styled.div`
    border: 1px solid #AB886D;
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span{
        color: rgb(36, 36, 36);
        font-weight: 400;
    }
    width: 850px;
    margin-bottom: 4px;
`

export const WrapperListOrder = styled.div`
    border-radius: 4px;
    align-items: center;
    width: 883px;
    border: 1px solid #AB886D;
`

export const WrapperLeft = styled.div`
    width: 910px;
    padding-left: 20px;
`
export const WrapperRight = styled.div`
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 2px;
    border-bottom: 1px solid #AB886D;
`

export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 75px;
    border: 1px solid #AB886D;
    border-radius: 4px;
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