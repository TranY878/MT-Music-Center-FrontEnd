import React, { useEffect, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { WrapperNavbar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })
    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            setLoading(false)
            setProducts(res?.data)
            setPanigate({ ...panigate, total: res?.totalPage })
        } else {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])

    const onChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize })
    }

    return (
        <div style={{ height: '100%', backgroundColor: '#f5f5fa' }} >
            <WrapperNavbar style={{ margin: '0 auto', justifyContent: 'left' }}>
                <NavbarComponent />
            </WrapperNavbar>
            <div id="container" style={{ width: '1270px', margin: '0 auto', backgroundColor: '#fff' }}>
                <Loading isLoading={loading}>
                    <div style={{
                        fontWeight: 'bold', fontSize: '24px', padding: '10px 0px 10px', justifyContent: 'center',
                        textAlign: 'center', color: '#7BC5C1'
                    }}>
                        Phân loại: {state || 'Tất cả sản phẩm'}
                    </div>
                    <div style={{ width: '1510px', margin: '0 auto', justifyContent: 'left' }}>
                    </div>
                    <div className='body' style={{ height: '100%', justifyContent: 'right', paddingBottom: '30px' }}>
                        <div id="container" style={{ width: '1270px', height: '100%', margin: '0 auto' }}>
                            <WrapperProducts>
                                {products?.filter((pro) => {
                                    if (searchDebounce === '') {
                                        return pro
                                    } else if (pro?.name?.toLowerCase()?.includes(searchDebounce.toLowerCase())) {
                                        return pro
                                    }
                                })?.map((product) => {
                                    return (
                                        <CardComponent
                                            key={product._id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            type={product.type}
                                            discount={product.discount}
                                            selled={product.selled}
                                            id={product._id}
                                        />
                                    )
                                })}
                            </WrapperProducts>
                        </div>
                    </div>
                </Loading>
            </div >
        </div >
    )
}

export default TypeProductPage