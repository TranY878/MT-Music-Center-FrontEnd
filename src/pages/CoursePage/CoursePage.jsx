import React, { useEffect, useState } from 'react';
import { WrapperCourses } from './style';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import Loading from '../../components/LoadingComponent/Loading';
import CourseCardComponent from '../../components/CourseCardComponent/CourseCardComponent';
import * as CourseService from '../../services/CourseService';

const CoursePage = () => {
    const searchCourse = useSelector((state) => state?.course?.search) || '';
    const searchDebounce = useDebounce(searchCourse, 500);
    const [typeCourses, setTypeCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('createdAt');
    const [courses, setCourses] = useState([]);

    const fetchCourseAll = async () => {
        setLoading(true);
        const res = await CourseService.getAllCourse();
        setLoading(false);

        if (res?.data) {
            // Lọc và sắp xếp giáo viên dựa trên sortOption
            let filteredCourses = res.data;
            if (sortOption === 'Guitar' || sortOption === 'Piano' || sortOption === 'Trống' || sortOption === 'Thanh nhạc') {
                filteredCourses = filteredCourses.filter((course) =>
                    course.subject.toLowerCase() === sortOption.toLowerCase()
                );
            }

            // Sắp xếp theo các tùy chọn khác
            if (sortOption === 'createdAt') {
                filteredCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortOption === 'level') {
                filteredCourses.sort((a, b) => new Date(a.level) - new Date(b.level));
            } else if (sortOption === 'priceU') {
                filteredCourses.sort((a, b) => new Date(a.price) - new Date(b.price));
            } else if (sortOption === 'priceD') {
                filteredCourses.sort((a, b) => new Date(b.price) - new Date(a.price));
            }
            setCourses(filteredCourses);
        }
    };

    const fetchAllCourseLevel = async () => {
        const res = await CourseService.getAllCourseLevel();
        if (res?.status === 'OK') {
            setTypeCourses(res?.data);
        }
    };

    const fetchAllCourseTye = async () => {
        const res = await CourseService.getAllCourseType();
        if (res?.status === 'OK') {
            setTypeCourses(res?.data);
        }
    };

    useEffect(() => {
        fetchCourseAll(); // Fetch tất cả khóa học khi component render
        fetchAllCourseLevel(); // Fetch tất cả cập độ khóa học
        fetchAllCourseTye(); // Fetch tất cả hình thức học
    }, [sortOption, searchDebounce]); // Cập nhật khi sortOption và searchDebounce thay đổi

    return (
        <div style={{ height: '100%', backgroundColor: '#f5f5fa' }}>
            <Loading isLoading={loading}>
                <div id="container" style={{ width: '1270px', height: '100%', margin: '0 auto', backgroundColor: '#fff' }}>
                    <div style={{
                        fontWeight: 'bold', fontSize: '24px', padding: '10px 0px 10px', justifyContent: 'center',
                        textAlign: 'center', color: '#0057A1'
                    }}>
                        TẤT CẢ KHÓA HỌC
                    </div>
                    <div style={{ width: '1250px', margin: '0 auto', marginLeft: '20px' }}>
                        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Sắp xếp theo:</label>
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="createdAt">Mới khai giảng</option>
                            <option value="level">Cấp đào tạo (Dễ - Khó)</option>
                            <option value="priceU">Giá tăng</option>
                            <option value="priceD">Giá giảm</option>
                            <option value="Guitar">Guitar</option>
                            <option value="Piano">Piano</option>
                            <option value="Trống">Trống</option>
                            <option value="Thanh nhạc">Thanh nhạc</option>
                        </select>
                    </div>
                    <WrapperCourses>
                        {courses?.filter((cou) => {
                            if (searchDebounce === '') {
                                return cou;
                            } else if (cou?.name?.toLowerCase()?.includes(searchDebounce.toLowerCase())) {
                                return cou;
                            }
                        })?.map((course) => {
                            return (
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
                            );
                        })}
                    </WrapperCourses>
                </div>
            </Loading>
        </div>
    );
};

export default CoursePage;
