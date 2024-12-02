import React, { useEffect, useState } from 'react'
import { WrapperContent, WrapperLableText } from './style'
import * as ProductService from '../../services/ProductService'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { useNavigate } from 'react-router-dom'

const NavbarComponent = () => {
    const onChange = () => { }
    const navigate = useNavigate()
    const [typeProducts, setTypeProducts] = useState([])

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const handleNavigateProduct = () => {
        navigate('/product')
    }

    return (
        <div>
            <WrapperLableText
                onClick={handleNavigateProduct}
            >
                Tất cả
            </WrapperLableText>
            <WrapperContent>
                {typeProducts.map((item) => {
                    return (
                        <TypeProduct name={item} key={item} />
                    )
                })}
            </WrapperContent>
        </div>
    )
}

export default NavbarComponent