import React, { useEffect, useState } from 'react';
import { WrapperButtonMore, WrapperNavbar, WrapperProducts } from './style';
import CardComponent from '../../components/CardComponent/CardComponent';
import * as ProductService from '../../services/ProductService';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import Loading from '../../components/LoadingComponent/Loading';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import { Pagination } from 'antd';

const ProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search) || '';
    const searchDebounce = useDebounce(searchProduct, 500);
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('createdAt');
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 8; // Số sản phẩm mỗi trang

    const fetchProductAll = async () => {
        setLoading(true);
        const res = await ProductService.getAllProduct();
        setLoading(false);
        if (res?.data) {
            if (sortOption === 'name') {
                res.data.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortOption === 'createdAt') {
                res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortOption === 'selled') {
                res.data.sort((a, b) => (b.selled || 0) - (a.selled || 0));
            } else if (sortOption === 'discount') {
                res.data.sort((a, b) => (b.discount || 0) - (a.discount || 0));
            } else if (sortOption === 'priceDown') {
                res.data.sort((a, b) => (a.price || 0) - (b.price || 0));
            } else if (sortOption === 'priceUp') {
                res.data.sort((a, b) => (b.price || 0) - (a.price || 0));
            }
            setProducts(res.data);
        }
    };

    useEffect(() => {
        fetchProductAll();
    }, [sortOption, searchDebounce]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Xác định sản phẩm cần hiển thị cho trang hiện tại
    const currentProducts = products
        ?.filter((pro) => {
            if (searchDebounce === '') {
                return pro;
            } else if (pro?.name?.toLowerCase()?.includes(searchDebounce.toLowerCase())) {
                return pro;
            }
        })
        ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ backgroundColor: '#f5f5fa' }}>
            <Loading isLoading={loading}>
                <WrapperNavbar style={{ margin: '0 auto', justifyContent: 'left' }}>
                    <NavbarComponent />
                </WrapperNavbar>
                <div id="container" style={{ width: '1270px', margin: '0 auto', backgroundColor: '#fff' }}>
                    <div style={{
                        fontWeight: 'bold', fontSize: '24px', padding: '10px 0px 10px', justifyContent: 'center',
                        textAlign: 'center', color: '#0057A1'
                    }}>
                        TẤT CẢ SẢN PHẨM
                    </div>
                    <div style={{ width: '1250px', margin: '0 auto', marginBottom: '20px' }}>
                        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Sắp xếp theo:</label>
                        <select onChange={handleSortChange} value={sortOption}>
                            <option value="createdAt">Sản phẩm mới nhất</option>
                            <option value="name">Tên sản phẩm (A-Z)</option>
                            <option value="priceDown">Giá tăng dần</option>
                            <option value="priceUp">Giá giảm dần</option>
                            <option value="selled">Bán chạy nhất</option>
                            <option value="discount">Khuyến mãi lớn nhất (%)</option>
                        </select>
                    </div>
                    <div className='body' style={{ width: '100%', height: '100%' }}>
                        <div id="container" style={{ width: '1270px', height: '1000px', margin: '0 auto' }}>
                            <WrapperProducts>
                                {currentProducts.map((product) => (
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
                                ))}
                            </WrapperProducts>
                            <Pagination
                                current={currentPage}
                                pageSize={itemsPerPage}
                                total={products.length}
                                onChange={handlePageChange}
                                style={{ textAlign: 'center', marginTop: '20px' }}
                            />
                        </div>
                    </div>
                </div>
            </Loading>
        </div>
    );
};

export default ProductPage;
