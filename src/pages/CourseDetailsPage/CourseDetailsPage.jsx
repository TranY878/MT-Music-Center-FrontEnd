import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CourseDetailsComponent from '../../components/CourseDetailsComponent/CourseDetailsComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService';
import * as CourseService from '../../services/CourseService';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import TeacherCardComponent from '../../components/TeacherCardComponent/TeacherCardComponent';
import * as TeacherService from '../../services/TeacherService';

const CourseDetailsPage = () => {
    const { id } = useParams()
    const [course, setCourse] = useState(null);
    const [products, setProducts] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [matchingProducts, setMatchingProducts] = useState([]);
    const [matchingTeachers, setMatchingTeachers] = useState([]);

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

    // Fetch tất cả giáo viên
    const fetchTeachers = async () => {
        try {
            const res = await TeacherService.getAllTeacher();
            setTeachers(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách giáo viên:', error);
        }
    };

    const findMatchingTeachers = () => {
        if (course && course.subject) {
            // Lọc giáo viên có nhạc cụ trùng với loại sản phẩm
            const matched = teachers.filter(teacher => teacher.musicalInstrument === course.subject);

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
        fetchTeachers(); // Lấy tất cả giáo viên
    }, [id]);

    useEffect(() => {
        findMatchingProducts(); // Lọc sản phẩm khi khóa học và sản phẩm đã được tải
    }, [course, products]);

    useEffect(() => {
        findMatchingTeachers(); // Lọc giáo viên khi sản phẩm và giáo viên đã được tải
    }, [products, teachers]);

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
                </div>

            </div>
        </div>
    )
}

export default CourseDetailsPage