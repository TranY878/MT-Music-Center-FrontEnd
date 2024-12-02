import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CourseDetailsComponent from '../../components/CourseDetailsComponent/CourseDetailsComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService';
import * as CourseService from '../../services/CourseService';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';

const CourseDetailsPage = () => {
    const { id } = useParams()
    const [course, setCourse] = useState(null);
    const [products, setProducts] = useState([]);
    const [matchingProducts, setMatchingProducts] = useState([]);

    // Fetch chi tiết khóa học
    const fetchCourseDetails = async (courseId) => {
        try {
            const res = await CourseService.getDetailsCourse(courseId);
            setCourse(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết khóa học:', error);
        }
    };

    // Fetch tất cả sản phẩm
    const fetchProducts = async () => {
        try {
            const res = await ProductService.getAllProduct();
            setProducts(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        }
    };

    // Lọc sản phẩm dựa trên type của khóa học, nếu không có, lấy sản phẩm từ tất cả sản phẩm và sắp xếp theo kinh nghiệm
    const findMatchingProducts = () => {
        if (course && course.subject) {
            // Lọc sản phẩm có nhạc cụ trùng với loại khóa học
            const matched = products.filter(product => product.type === course.subject);

            // Nếu có sản phẩm trùng loại nhạc cụ, sắp xếp theo giá tăng dần
            if (matched.length > 0) {
                const sortedMatched = matched.sort((a, b) => a.price - b.price);
                setMatchingProducts(sortedMatched.slice(0, 4)); // Lấy 4 sản phẩm đầu tiên
            } else {
                // Nếu không có sản phẩm trùng khớp, sắp xếp tất cả sản phẩm theo mới nhất
                const sortedAllProducts = products.sort((a, b) => b.createdAt - a.createdAt);
                setMatchingProducts(sortedAllProducts.slice(0, 4)); // Lấy 4 sản phẩm có mới nhất
            }
        }
    };
    useEffect(() => {
        fetchCourseDetails(id); // Lấy chi tiết khóa học dựa trên id từ URL
        fetchProducts(); // Lấy tất cả sản phẩm
    }, [id]);

    useEffect(() => {
        findMatchingProducts(); // Lọc sản phẩm khi khóa học và sản phẩm đã được tải
    }, [course, products]);


    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5fa' }}>
            <HeaderComponent isHiddenSearch />
            <div style={{ width: '1270px', height: '100%', margin: '0 auto' }}>
                <div style={{ width: '1270px', height: '100%', margin: '0 auto', paddingLeft: '10px', backgroundColor: '#E4E0E1' }}>
                    <CourseDetailsComponent idCourse={id} />
                    <div style={{ borderBottom: '2px dashed #000', paddingTop: '10px', width: '1220px', alignItems: 'center', margin: '0 auto' }}></div>
                    {/* Hiển thị 4 CardComponent nếu có khóa học trùng khớp */}
                    {matchingProducts.length > 0 && (
                        <div style={{ marginTop: '10px', paddingLeft: '10px', paddingBottom: '10px' }}>
                            <h3>Tham khảo nhạc cụ:</h3>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {matchingProducts.map((product) => (
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
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CourseDetailsPage