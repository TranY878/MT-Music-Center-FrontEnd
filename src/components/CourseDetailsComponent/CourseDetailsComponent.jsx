import { Image } from 'antd'
import React, { useState } from 'react'
import { WrapperControl, WrapperCourseName, WrapperCourseNameDiv, WrapperCourseText } from './style'
import { FormOutlined, RightOutlined } from '@ant-design/icons'
import * as CourseService from '../../services/CourseService'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Loading from '../LoadingComponent/Loading'


const CourseDetailsComponent = ({ idCourse }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleClickNavigate = (type) => {
        if (type === 'course') {
            navigate('/course')
        } else {
            navigate('/')
        }
    }

    const fetchGetDetailsCourse = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await CourseService.getDetailsCourse(id)
            return res.data
        }
    }

    const { isLoading, data: courseDetails } = useQuery({ queryKey: ['course-details', idCourse], queryFn: fetchGetDetailsCourse, enabled: !!idCourse })

    const levelName = (level) => {
        switch (level) {
            case 1:
                return 'Căn bản';
            case 2:
                return 'Nâng cao';
            case 3:
                return 'Ôn thi - Biểu diễn';
            default:
                return level; // Or you can return a different default value
        }
    }

    return (
        <div>
            <Loading isLoading={isLoading || loading}>
                <div style={{ padding: '5px' }}>
                    <WrapperControl onClick={() => handleClickNavigate()}>Trang chủ</WrapperControl>
                    <span> <RightOutlined style={{ fontSize: '14px' }} /> </span>
                    <WrapperControl onClick={() => handleClickNavigate('course')}>Khóa học</WrapperControl>
                    <span> <RightOutlined style={{ fontSize: '14px' }} /> </span>
                    <span>{courseDetails?.name}</span>
                </div>
                <div style={{ paddingTop: '20px', width: '1270px', display: 'flex' }}>
                    <div >
                        <Image src={courseDetails?.image} preview={false} alt="image" height="450px" width="600px" />
                    </div>
                    <WrapperCourseNameDiv>
                        <WrapperCourseText
                            style={{
                                fontSize: '20px',
                                paddingLeft: '30px',
                                color: '#876445',
                                fontWeight: 'bold'
                            }}>
                            Khóa học
                        </WrapperCourseText>
                        <WrapperCourseName
                            style={{ textAlign: 'center', }}
                        >
                            {courseDetails?.name}
                        </WrapperCourseName>
                        <div style={{ fontSize: '20px', textAlign: 'center', width: '670px', paddingBottom: '20px' }}>Bộ môn: {courseDetails?.subject}</div>
                        <div style={{ fontSize: '20px', paddingBottom: '20px', textAlign: 'center' }}>Đào tạo cấp độ: {levelName(courseDetails?.level)}</div>
                        <div style={{ fontSize: '14px', paddingBottom: '10px', paddingRight: '50px', textAlign: 'right', color: '#59504b', fontWeight: 'bold' }}>
                            <a href='https://www.facebook.com/blogguitarMT/' target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                Đăng ký <FormOutlined />
                            </a>
                        </div>
                        <div style={{ fontSize: '20px' }}>Mục tiêu khóa học</div>
                        <div style={{ borderBottom: '2px solid #000', width: '163px', marginBottom: '10px' }}></div>
                        {/* Sử dụng dangerouslySetInnerHTML để hiển thị nội dung định dạng */}
                        <div style={{ fontSize: '20px', paddingLeft: '20px', width: '600px' }} dangerouslySetInnerHTML={{ __html: courseDetails?.description }} />
                    </WrapperCourseNameDiv>
                </div>
            </Loading>
        </div>
    )
}

export default CourseDetailsComponent