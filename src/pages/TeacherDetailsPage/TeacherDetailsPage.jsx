import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TeacherDetailsComponent from '../../components/TeacherDetailsComponent/TeacherDetailsComponent'
import CourseCardComponent from '../../components/CourseCardComponent/CourseCardComponent'
import * as TeacherService from '../../services/TeacherService';
import * as CourseService from '../../services/CourseService';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';

const TeacherDetailsPage = () => {
    const { id } = useParams()
    const [teacher, setTeacher] = useState(null);
    const [courses, setCourses] = useState([]);
    const [matchingCourses, setMatchingCourses] = useState([]);

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
    useEffect(() => {
        fetchTeacherDetails(id); // Lấy chi tiết sản phẩm dựa trên id từ URL
        fetchCourses(); // Lấy tất cả giáo viên
    }, [id]);

    useEffect(() => {
        findMatchingCourses(); // Lọc khóa học khi giáo viên và khóa học đã được tải
    }, [teacher, courses]);

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
                </div>
            </div>
        </div>
    )
}

export default TeacherDetailsPage