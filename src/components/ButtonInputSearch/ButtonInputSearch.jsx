import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const {
        size, placeholder, textbutton,
        bordered, backgroundColorInput = '#fff',
        backgroundColorButton = '#ccc',
        colorButton = '#fff',
    } = props

    return (
        <div style={{ display: 'flex', backgroundColor: '#fff' }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{
                    backgroundColor: backgroundColorInput,
                    border: bordered ? '1px solid #d9d9d9' : 'none'
                }}
                {...props}
            />
        </div>
    )
}

export default ButtonInputSearch
