import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({ name }) => {
    const navigate = useNavigate()
    const handleNavigateType = (type) => {
        const normalizedType = type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');
        navigate(`/product/${normalizedType}`, { state: type });
    };
    return (
        <div style={{ padding: '0 10px', cursor: 'pointer' }} onClick={() => handleNavigateType(name)}>{name}</div>
    )
}

export default TypeProduct