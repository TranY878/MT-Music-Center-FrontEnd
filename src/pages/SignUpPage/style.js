import styled from "styled-components";

//vung trai
export const WrapperContainerLeft = styled.div`
    flex: 1;
    padding: 40px 45px 24px;
    display: flex;
    flex-direction: column;
`

//vung phai
export const WrapperContainerRight = styled.div`
    width: 300px;
    background: linear-gradient(136deg, rgb(255, 255, 255) -1%, rgb(255, 255,255) 85%);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 4px;
`

//nut bam hyper-links
export const WrapperTextLight = styled.span`
    color: #6B240C;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
`