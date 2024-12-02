import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceSaleText, WrapperPriceText, WrapperReporText, WrapperStyleTextSell } from './style'
import logo from '../../assets/images/official.png'
import { useNavigate } from 'react-router-dom'
import { Rate } from 'antd'
import { convertPrice } from '../../utils'

const CardComponent = (props) => {
    const { image, name, price, discount, selled, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            style={{ width: '300px', border: '1px solid #A79277' }}
            cover={<img alt="image" src={image} style={{ width: '290px', height: '290px', padding: '5px' }} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <img
                src={logo}
                style={{
                    width: '90px',
                    height: '20px',
                    position: 'absolute',
                    top: 3, left: 3,
                    borderTopLeftRadius: '3px'
                }}
            />
            <StyleNameProduct>{name}</StyleNameProduct>
            <div style={{ display: 'flex' }}>
                <WrapperStyleTextSell> Đã bán: {selled || '0'}</WrapperStyleTextSell>
                <WrapperPriceText>
                    {discount !== 0 && (
                        <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
                    )
                    }
                </WrapperPriceText>
                <WrapperDiscountText>
                    {discount !== 0 && (
                        <span >- {discount || '0'}%</span>
                    )}
                </WrapperDiscountText>
            </div>
            <WrapperPriceSaleText>
                {convertPrice(price - (price * (discount / 100)))}
            </WrapperPriceSaleText>
        </WrapperCardStyle>
    )
}

export default CardComponent