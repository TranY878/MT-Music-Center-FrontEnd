import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TeacherDetailsComponent from '../../components/TeacherDetailsComponent/TeacherDetailsComponent'
import CourseCardComponent from '../../components/CourseCardComponent/CourseCardComponent'
import * as TeacherService from '../../services/TeacherService';
import * as CourseService from '../../services/CourseService';
import * as ProductService from '../../services/ProductService';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import CardComponent from '../../components/CardComponent/CardComponent';

const TeacherDetailsPage = () => {
    const { id } = useParams()
    const [teacher, setTeacher] = useState(null);
    const [products, setProducts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [matchingCourses, setMatchingCourses] = useState([]);
    const [matchingProducts, setMatchingProducts] = useState([]);

    // Fetch chi tiết sản phẩm
    const fetchTeacherDetails = async (teacherId) => {
        try {
            const res = await TeacherService.getDetailsTeacher(teacherId);
            setTeacher(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết giáo viên:', error);
        }
    };

    // Fetch tất cả giáo viên
    const fetchCourses = async () => {
        try {
            const res = await CourseService.getAllCourse();
            setCourses(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách khóa học:', error);
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

    // Lọc giáo viên dựa trên musicalInstrument của sản phẩm, nếu không có, lấy giáo viên từ tất cả giáo viên và sắp xếp theo kinh nghiệm
    const findMatchingCourses = () => {
        if (teacher && teacher.musicalInstrument) {
            // Lọc giáo viên có nhạc cụ trùng với loại sản phẩm
            const matched = courses.filter(course => course.subject === teacher.musicalInstrument);

            // Nếu có giáo viên trùng loại nhạc cụ, sắp xếp theo kinh nghiệm
            if (matched.length > 0) {
                const sortedMatched = matched.sort((a, b) => a.level - b.level);
                setMatchingCourses(sortedMatched.slice(0, 4)); // Lấy 4 giáo viên đầu tiên
            } else {
                // Nếu không có giáo viên trùng khớp, sắp xếp tất cả giáo viên theo kinh nghiệm
                const sortedAllCourses = courses.sort((a, b) => a.level - b.level);
                setMatchingCourses(sortedAllCourses.slice(0, 4)); // Lấy 4 giáo viên có kinh nghiệm cao nhất
            }
        }
    };

    const findMatchingProducts = () => {
        if (teacher && teacher.musicalInstrument) {
            // Lọc sản phẩm có nhạc cụ trùng với loại khóa học
            const matched = products.filter(product => product.type === teacher.musicalInstrument);

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
        fetchTeacherDetails(id); // Lấy chi tiết sản phẩm dựa trên id từ URL
        fetchCourses(); // Lấy tất cả giáo viên
        fetchProducts(); // Lấy tất cả sản phẩm
    }, [id]);

    useEffect(() => {
        findMatchingCourses(); // Lọc khóa học khi giáo viên và khóa học đã được tải
    }, [teacher, courses]);

    useEffect(() => {
        findMatchingProducts(); // Lọc sản phẩm khi khóa học và sản phẩm đã được tải
    }, [teacher, products]);

    return (
        <div style={{ backgroundColor: '#f5f5fa' }}>
            <HeaderComponent isHiddenSearch />
            <div style={{ width: '1270px', height: '100%', margin: '0 auto', backgroundColor: '#fff' }}>
                <div style={{ width: '1270px', height: '100%', margin: '0 auto', paddingLeft: '10px', backgroundColor: '#E4E0E1' }}>
                    <TeacherDetailsComponent idTeacher={id} />
                    <div style={{ borderBottom: '2px dashed #000', paddingTop: '10px', width: '1220px', alignItems: 'center', margin: '0 auto' }}></div>
                    {/* Hiển thị 4 CourseCardComponent nếu có khóa học trùng khớp */}
                    {matchingCourses.length > 0 && (
                        <div style={{ marginTop: '10px', paddingLeft: '10px', paddingBottom: '10px' }}>
                            <h3>Khóa học đề xuất:</h3>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                {matchingCourses.map((course) => (
                                    <CourseCardComponent
                                        key={course._id}
                                        subject={course.subject}
                                        description={course.description}
                                        image={course.image}
                                        name={course.name}
                                        price={course.price}
                                        type={course.type}
                                        level={course.level}
                                        id={course._id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
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

export default TeacherDetailsPage