import React from 'react'
import { WrapperInputStyle } from './style'

const InputForm = (progs) => {
    const { placeholder = 'Nhập thông tin', ...rests } = progs
    const handleOnchangeInput = (e) => {
        progs.onChange(e.target.value)
    }
    return (
        <WrapperInputStyle placeholder={placeholder} value={progs.value} {...rests} onChange={handleOnchangeInput} />
    )
}

export default InputForm