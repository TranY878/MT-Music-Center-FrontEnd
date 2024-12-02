import React from 'react'
import { StyleNameTeacher, WrapperCardStyle, WrapperPriceText, WrapperStyleType } from './style'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'

const CourseCardComponent = (props) => {
    const { name, image, price, type, id } = props
    const navigate = useNavigate()
    const handleDetailsCourse = (id) => {
        navigate(`/course-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            cover={<img alt="image" src={image} style={{ width: '290px', height: '290px', padding: '5px' }} />}
            onClick={() => handleDetailsCourse(id)}
        >
            <StyleNameTeacher>{name}</StyleNameTeacher>
            <WrapperStyleType> Hình thức: {type}</WrapperStyleType>
            <WrapperPriceText>
                Học phí: {convertPrice(price)}/tháng
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CourseCardComponent