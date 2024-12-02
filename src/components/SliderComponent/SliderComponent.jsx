import React from 'react'
import { WrapperSliderStyle } from './style';
import { Image } from 'antd';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 8000
    };
    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((image) => {
                return (
                    <Image key={image} src={image} alt="slider" preview={true} with="100%" height="100%" />
                )
            })}
        </WrapperSliderStyle>
    )
}

export default SliderComponent