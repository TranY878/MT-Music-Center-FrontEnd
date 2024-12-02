import { Col, Row, Image, Rate, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperControl, WrapperPriceProduct, WrapperPriceSaleText, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { PlusOutlined, MinusOutlined, RightOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice, initFacebookSDK } from '../../utils'
import Loading from '../LoadingComponent/Loading'
import * as message from '../MessageComponent/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'

const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const [isHoveredAdd, setIsHoveredAdd] = useState(false);
    const [isHoveredBuy, setIsHoveredBuy] = useState(false);
    const order = useSelector((state) => state.order)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleClickNavigate = (type) => {
        if (type === 'product') {
            navigate('/product')
        } else {
            navigate('/')
        }
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    useEffect(() => {
        initFacebookSDK()
    })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname });
        } else if (productDetails?.countInStock > 0) {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInStock: productDetails?.countInStock,
                },
            }));
            message.success('Đã thêm vào giỏ hàng!');
        } else {
            message.error('Sản phẩm đã hết hàng!');
        }
    };

    const handleBuyNow = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname });
        } else if (productDetails?.countInStock > 0) {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInStock: productDetails?.countInStock,
                },
            }));
            navigate('/order')
        } else {
            message.error('Sản phẩm đã hết hàng!');
        }
    }

    const handleQuantityChange = (type) => {
        if (type === 'increment' && numProduct < productDetails?.countInStock) {
            setNumProduct(numProduct + 1);
        } else if (type === 'decrement' && numProduct > 1) {
            setNumProduct(numProduct - 1);
        }
    };

    const { isLoading, data: productDetails } = useQuery({ queryKey: ['product-details', idProduct], queryFn: fetchGetDetailsProduct, enabled: !!idProduct })

    return (
        <>
            <Loading isLoading={isLoading || loading}>
                {/* <div style={{ width: '1270px', height: '100%', margin: '0 auto', paddingTop: '10px', justifyContent: 'center', backgroundColor: '#E4E0E1' }}> */}
                <div style={{ padding: '5px' }}>
                    <WrapperControl onClick={() => handleClickNavigate()}>Trang chủ</WrapperControl>
                    <span> <RightOutlined style={{ fontSize: '12px' }} /> </span>
                    <WrapperControl onClick={() => handleClickNavigate('product')}>Sản phẩm</WrapperControl>
                    <span> <RightOutlined style={{ fontSize: '12px' }} /> </span>
                    <span style={{ color: '#493628', fontSize: '12px' }}>{productDetails?.name}</span>
                </div>
                <Row style={{ padding: '10px', borderRadius: '4px' }}>
                    <Col span={10} style={{ borderRight: '1px solid #ccc', paddingRight: '8px' }}>
                        <Image src={productDetails?.image} alt="image product" preview={true}
                            style={{
                                height: '500px',
                                width: '500px'
                            }}
                        />
                    </Col>
                    <Col span={14} style={{ paddingLeft: '10px' }}>
                        <WrapperStyleNameProduct style={{ height: 'fit-content' }}>{productDetails?.name}</WrapperStyleNameProduct>
                        <div style={{ display: 'flex' }}>
                            <WrapperPriceSaleText>
                                {productDetails?.discount !== 0 && (
                                    <span style={{ marginRight: '8px' }}>{convertPrice(productDetails?.price)}</span>
                                )}
                            </WrapperPriceSaleText>
                            <div>
                                {productDetails?.discount !== 0 && (
                                    <span>- {productDetails?.discount || '0'}%</span>
                                )}
                            </div>
                        </div>
                        <WrapperPriceProduct>
                            <WrapperPriceTextProduct>{convertPrice(productDetails?.price - (productDetails?.price * (productDetails?.discount / 100)))}</WrapperPriceTextProduct>
                        </WrapperPriceProduct>
                        <div style={{ paddingTop: '10px' }}>
                            <WrapperStyleTextSell>Đã bán: {productDetails?.selled || '0'}</WrapperStyleTextSell>
                        </div>
                        <div style={{ paddingTop: '10px' }}>
                            <WrapperStyleTextSell>Số lượng còn lại: {productDetails?.countInStock}</WrapperStyleTextSell>
                        </div>
                        {/* <LikeButtonComponent
                                dataHref={process.env.REACT_APP_IS_LOCAL
                                    ? "https://developers.facebook.com/docs/plugins/"
                                    : window.location.href
                                }
                            /> */}
                        <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                            <div style={{ marginBottom: '10px' }}>Thông tin chi tiết</div>
                            {/* Sử dụng dangerouslySetInnerHTML để hiển thị nội dung định dạng */}
                            <div style={{ fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: productDetails?.description }} />
                        </div>
                        <WrapperQualityProduct>
                            <MinusOutlined onClick={() => handleQuantityChange('decrement')} style={{ color: '#000', fontSize: '20px', cursor: 'pointer' }} />
                            <InputNumber value={numProduct} size="small" min={1} max={productDetails?.countInStock} readOnly style={{ backgroundColor: '#E4E0E1' }} />
                            <PlusOutlined onClick={() => handleQuantityChange('increment')} style={{ color: '#000', fontSize: '20px', cursor: 'pointer' }} />
                        </WrapperQualityProduct>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '10px' }}>
                            <ButtonComponent
                                size={40}
                                onMouseEnter={() => setIsHoveredAdd(true)}
                                onMouseLeave={() => setIsHoveredAdd(false)}
                                styleButton={{
                                    background: isHoveredAdd ? '#DACC96' : '#B09B71',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '20px'
                                }}
                                onClick={handleAddOrderProduct}
                                textbutton={'Thêm vào giỏ hàng'}
                                styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}
                            ></ButtonComponent>
                            <ButtonComponent
                                size={40}
                                onMouseEnter={() => setIsHoveredBuy(true)}
                                onMouseLeave={() => setIsHoveredBuy(false)}
                                styleButton={{
                                    background: isHoveredBuy ? '#8C6B53' : '#362706',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '20px',
                                }}
                                onClick={handleBuyNow}
                                textbutton={'Mua ngay'}
                                styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}
                            ></ButtonComponent>
                        </div>
                    </Col>
                    <CommentComponent
                        dataHref={process.env.REACT_APP_IS_LOCAL
                            ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                            : window.location.href
                        }
                        width="1270px"
                    />
                </Row>
                {/* </div> */}
            </Loading>
        </>
    )
}

export default ProductDetailsComponent
