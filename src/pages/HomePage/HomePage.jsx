import React, { useState } from 'react'
import { WrapperButtonMore, WrapperProducts, WrapperShowProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.png'
import slider2 from '../../assets/images/slider2.png'
import slider3 from '../../assets/images/slider3.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import * as ProductService from '../../services/ProductService'
import * as TeacherService from '../../services/TeacherService'
import * as CourseService from '../../services/CourseService'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import Loading from '../../components/LoadingComponent/Loading'
import TeacherCardComponent from '../../components/TeacherCardComponent/TeacherCardComponent'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import CourseCardComponent from '../../components/CourseCardComponent/CourseCardComponent'

const HomePage = () => {
    const navigate = useNavigate()
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [loading, setLoading] = useState(false)

    const fetchCourse = async () => {
        setLoading(true)
        const res = await CourseService.getAllCourse(searchDebounce)
        if (res?.data) {
            const courseAll = res.data.filter(course => course.createdAt !== undefined && course.createdAt !== null)
            courseAll.sort((a, b) => b.createdAt - a.createdAt)
            setLoading(false)
            return courseAll.slice(0, 4)
        }
        return []
    }

    const fetchNewProducts = async () => {
        setLoading(true);
        const res = await ProductService.getAllProduct(); // Bỏ searchDebounce nếu không cần thiết
        if (res?.data) {
            const productsNew = res.data
                .filter(product => product.createdAt !== undefined && product.createdAt !== null)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo thời gian tạo
            setLoading(false);
            return productsNew.slice(0, 4); // Lấy 4 sản phẩm mới nhất
        }
        setLoading(false);
        return [];
    };

    const fetchTopTeacher = async () => {
        setLoading(true)
        const res = await TeacherService.getAllTeacher(searchDebounce)
        if (res?.data) {
            const teachersTop = res.data.filter(teacher => teacher.experience !== undefined && teacher.experience !== null)
            teachersTop.sort((a, b) => b.experience - a.experience)
            setLoading(false)
            return teachersTop.slice(0, 4) // Lấy 4 giáo viên kinh nghiệm nhất
        }

        return []
    }

    const { data: courseAll } = useQuery({
        queryKey: ['courseAll', searchDebounce],
        queryFn: fetchCourse,
        placeholderData: []
    })

    const { data: newProducts } = useQuery({
        queryKey: ['newProducts', searchDebounce],
        queryFn: fetchNewProducts,
        placeholderData: []
    })

    const { data: topTeacher } = useQuery({
        queryKey: ['topTeacher', searchDebounce],
        queryFn: fetchTopTeacher,
        placeholderData: []
    })

    const handleNavigateProduct = () => {
        navigate('/product')
    }

    const handleNavigateTeacher = () => {
        navigate('/teacher')
    }

    const handleNavigateCourse = () => {
        navigate('/course')
    }

    return (
        <>
            <HeaderComponent isHiddenSearch />
            <div className='body' style={{ width: '100%', height: '275vh', backgroundColor: '#f5f5fa' }}>
                <Loading isLoading={loading}>
                    <div style={{ width: '1519px', margin: '0 auto' }}>
                        <SliderComponent arrImages={[slider1, slider2, slider3]} />
                    </div>
                    <div id="container" style={{ width: '1270px', height: '1000px', margin: '0 auto', backgroundColor: '#fff' }}>
                        <div style={{ height: '10px', backgroundColor: '#f5f5fa' }}></div>
                        <WrapperShowProduct>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                padding: '10px 0px 0px 20px',
                                cursor: 'pointer',
                                width: '250px',
                            }}
                                onClick={handleNavigateProduct}
                            >
                                SẢN PHẨM MỚI
                            </div>
                            <WrapperProducts>
                                {newProducts?.map((product) => (
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
                        </WrapperShowProduct>
                        <div style={{ height: '10px', backgroundColor: '#f5f5fa' }}></div>
                        <WrapperShowProduct>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                padding: '10px 0px 0px 20px',
                                cursor: 'pointer',
                                width: '250px',
                            }}
                                onClick={handleNavigateTeacher}
                            >
                                GIÁO VIÊN TIÊU BIỂU
                            </div>
                            <WrapperProducts>
                                {topTeacher?.map((teacher) => (
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
                            </WrapperProducts>
                        </WrapperShowProduct>
                        <div style={{ height: '10px', backgroundColor: '#f5f5fa' }}></div>
                        <WrapperShowProduct>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                padding: '10px 0px 0px 20px',
                                cursor: 'pointer',
                                width: '330px',
                            }}
                                onClick={handleNavigateCourse}
                            >
                                KHÓA HỌC MỚI KHAI GIẢNG
                            </div>
                            <WrapperProducts>
                                {courseAll?.map((course) => (
                                    <CourseCardComponent
                                        key={course._id}
                                        subject={course.subject}
                                        price={course.price}
                                        image={course.image}
                                        name={course.name}
                                        description={course.description}
                                        type={course.type}
                                        level={course.level}
                                        id={course._id}
                                    />
                                ))}
                            </WrapperProducts>
                        </WrapperShowProduct>
                    </div>
                </Loading>
            </div>
        </>
    )
}

export default HomePage