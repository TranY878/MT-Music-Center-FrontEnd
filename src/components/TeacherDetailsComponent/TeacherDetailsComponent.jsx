import { Col, Row, Image, Rate } from 'antd'
import React, { useState } from 'react'
import { WrapperControl, WrapperTeacherName, WrapperTeacherNameDiv, WrapperTeacherText } from './style'
import { FacebookOutlined, RightOutlined } from '@ant-design/icons'
import * as TeacherService from '../../services/TeacherService'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Loading from '../LoadingComponent/Loading'


const TeacherDetailsComponent = ({ idTeacher }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleClickNavigate = (type) => {
        if (type === 'teacher') {
            navigate('/teacher')
        } else {
            navigate('/')
        }
    }

    const fetchGetDetailsTeacher = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await TeacherService.getDetailsTeacher(id)
            return res.data
        }
    }

    const { isLoading, data: teacherDetails } = useQuery({ queryKey: ['teacher-details', idTeacher], queryFn: fetchGetDetailsTeacher, enabled: !!idTeacher })

    return (
        <>
            <Loading isLoading={isLoading || loading}>
                <div style={{ padding: '5px' }}>
                    <WrapperControl onClick={() => handleClickNavigate()}>Trang chủ</WrapperControl>
                    <span> <RightOutlined style={{ fontSize: '12px' }} /> </span>
                    <WrapperControl onClick={() => handleClickNavigate('teacher')}>Giáo viên</WrapperControl>
                    <span> <RightOutlined style={{ fontSize: '12px' }} /> </span>
                    <span style={{ color: '#493628', fontSize: '12px' }}>{teacherDetails?.name}</span>
                </div>
                <Row style={{ padding: '10px' }}>
                    <div style={{ paddingTop: '10px', width: '1270px' }}>
                        <WrapperTeacherText style={{ fontSize: '30px', paddingLeft: '80px' }}>Giáo viên
                            <div style={{ float: 'right' }}>
                                <Image src={teacherDetails?.image} preview={false} alt="image" height="500px" width="400px" />
                            </div>
                        </WrapperTeacherText>
                        <WrapperTeacherNameDiv>
                            <WrapperTeacherName
                            >
                                {teacherDetails?.name}
                            </WrapperTeacherName>
                            <div style={{ fontSize: '20px', textAlign: 'center', width: '850px', paddingBottom: '20px' }}>Bộ môn: {teacherDetails?.musicalInstrument}</div>
                            <div style={{ fontSize: '20px', textAlign: 'center', width: '850px', paddingBottom: '20px' }}>Đã giảng dạy hơn {teacherDetails?.experience} năm</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Liên hệ</div>
                            <div style={{ borderBottom: '2px solid #000', width: '65px', marginBottom: '10px' }}></div>
                            <div style={{ fontSize: '20px', paddingBottom: '10px' }}>Số điện thoại: {teacherDetails?.phone}</div>
                            <div style={{ fontSize: '20px', paddingBottom: '10px' }}>
                                <a href={teacherDetails?.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    <FacebookOutlined style={{ color: '#493628' }} />
                                </a>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '20px' }}>Tự giới thiệu</div>
                            <div style={{ borderBottom: '2px solid #000', width: '171px', marginBottom: '10px' }}></div>
                            {/* Sử dụng dangerouslySetInnerHTML để hiển thị nội dung định dạng */}
                            <div style={{ fontSize: '20px', paddingLeft: '20px', width: '800px' }} dangerouslySetInnerHTML={{ __html: teacherDetails?.intro }} />
                        </WrapperTeacherNameDiv>
                    </div>
                </Row>
            </Loading>
        </>
    )
}

export default TeacherDetailsComponent