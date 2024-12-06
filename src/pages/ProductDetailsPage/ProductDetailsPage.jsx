import React, { useState, useEffect } from 'react';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';
import { useParams } from 'react-router-dom';
import TeacherCardComponent from '../../components/TeacherCardComponent/TeacherCardComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import * as ProductService from '../../services/ProductService';
import * as TeacherService from '../../services/TeacherService';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [matchingTeachers, setMatchingTeachers] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Fetch chi tiết sản phẩm
    const fetchProductDetails = async (productId) => {
        try {
            const res = await ProductService.getDetailsProduct(productId);
            setProduct(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        }
    };

    // Fetch tất cả giáo viên
    const fetchTeachers = async () => {
        try {
            const res = await TeacherService.getAllTeacher();
            setTeachers(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách giáo viên:', error);
        }
    };


    // Lấy danh sách sản phẩm liên quan
    const findRelatedProducts = async () => {
        try {
            if (product && product.type) {
                const res = await ProductService.getAllProduct(); // Lấy tất cả sản phẩm
                const matchedProducts = res.data.filter(p => p.type === product.type && p._id !== product._id); // Lọc sản phẩm trùng loại và khác ID
                setRelatedProducts(matchedProducts.slice(0, 4)); // Lấy tối đa 4 sản phẩm
            }
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm liên quan:', error);
        }
    };


    // Lọc giáo viên dựa trên type của sản phẩm, nếu không có, lấy giáo viên từ tất cả giáo viên và sắp xếp theo kinh nghiệm
    const findMatchingTeachers = () => {
        if (product && product.type) {
            // Lọc giáo viên có nhạc cụ trùng với loại sản phẩm
            const matched = teachers.filter(teacher => teacher.musicalInstrument === product.type);

            // Nếu có giáo viên trùng loại nhạc cụ, sắp xếp theo kinh nghiệm
            if (matched.length > 0) {
                const sortedMatched = matched.sort((a, b) => b.experience - a.experience);
                setMatchingTeachers(sortedMatched.slice(0, 4)); // Lấy 4 giáo viên đầu tiên
            } else {
                // Nếu không có giáo viên trùng khớp, sắp xếp tất cả giáo viên theo kinh nghiệm
                const sortedAllTeachers = teachers.sort((a, b) => b.experience - a.experience);
                setMatchingTeachers(sortedAllTeachers.slice(0, 4)); // Lấy 4 giáo viên có kinh nghiệm cao nhất
            }
        }
    };
    useEffect(() => {
        fetchProductDetails(id); // Lấy chi tiết sản phẩm dựa trên id từ URL
        fetchTeachers(); // Lấy tất cả giáo viên
    }, [id]);

    useEffect(() => {
        findMatchingTeachers(); // Lọc giáo viên khi sản phẩm và giáo viên đã được tải
    }, [product, teachers]);

    useEffect(() => {
        findRelatedProducts();
    }, [product]);


    return (
        <div style={{ height: '100%', width: '100%', backgroundColor: '#f5f5fa' }}>
            <HeaderComponent isHiddenSearch />
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                <div style={{ width: '1270px', height: '100%', margin: '0 auto', paddingLeft: '10px', backgroundColor: '#E4E0E1' }}>
                    <ProductDetailsComponent idProduct={id} />
                    <div style={{ borderBottom: '2px dashed #000', paddingTop: '10px', width: '1250px', alignItems: 'center', margin: '0 auto' }}></div>
                    {/* Hiển thị 4 TeacherCardComponent nếu có giáo viên trùng khớp */}
                    {matchingTeachers.length > 0 && (
                        <div style={{ marginTop: '10px', paddingLeft: '10px', paddingBottom: '10px' }}>
                            <h3>Giáo viên liên quan:</h3>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {matchingTeachers.map((teacher) => (
                                    <TeacherCardComponent
                                        key={teacher._id}
                                        musicalInstrument={teacher.musicalInstrument}
                                        description={teacher.description}
                                        image={teacher.image}
                                        name={teacher.name}
                                        experience={teacher.experience}
                                        address={teacher.address}
                                        phone={teacher.phone}
                                        facebook={teacher.facebook}
                                        intro={teacher.intro}
                                        id={teacher._id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div style={{ borderBottom: '2px dashed #000', paddingTop: '10px', width: '1250px', alignItems: 'center', margin: '0 auto' }}></div>
                    {relatedProducts.length > 0 && (
                        <div style={{ marginTop: '20px', paddingLeft: '10px', paddingBottom: '10px' }}>
                            <h3>Sản phẩm liên quan:</h3>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {relatedProducts.map((relatedProduct) => (
                                    <CardComponent
                                        key={product._id}
                                        type={product.type}
                                        description={product.description}
                                        price={product.price}
                                        image={product.image}
                                        name={product.name}
                                        discount={product.discount}
                                        selled={product.selled}
                                        countInStock={product.countInStock}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
