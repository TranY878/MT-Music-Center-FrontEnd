import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #0057A1;
    font-size: 30px;
    font-weight: bold;
`

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        align-items: center;
    }
    & .ant-upload-list-item-container {
        display: none
    }
`