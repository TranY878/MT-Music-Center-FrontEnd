import React from 'react'
import { StyleNameTeacher, WrapperCardStyle, WrapperStyleTextExp, WrapperMusicalText } from './style'
import { useNavigate } from 'react-router-dom'

const TeacherCardComponent = (props) => {
    const { name, image, musicalInstrument, experience, id } = props
    const navigate = useNavigate()
    const handleDetailsTeacher = (id) => {
        navigate(`/teacher-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            cover={<img alt="image" src={image} style={{ width: '290px', height: '290px', padding: '5px' }} />}
            onClick={() => handleDetailsTeacher(id)}
        >
            <StyleNameTeacher>{name}</StyleNameTeacher>
            <div style={{ display: 'flex' }}>
                <WrapperMusicalText> Bộ môn: {musicalInstrument}</WrapperMusicalText>
            </div>
            <WrapperStyleTextExp> Kinh nghiệm giảng dạy hơn {experience} năm</WrapperStyleTextExp>
        </WrapperCardStyle>
    )
}

export default TeacherCardComponent