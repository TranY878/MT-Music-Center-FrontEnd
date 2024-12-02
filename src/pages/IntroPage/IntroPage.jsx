import React, { useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import video from '../../assets/videos/guitar.mp4'
import productIntro from '../../assets/images/productintro.jpg'
import { Image } from 'antd';


const IntroPage = () => {
    const [loading, setLoading] = useState(false);


    return (
        <div className='body' style={{ width: '100%', height: '100%', backgroundColor: '#f5f5fa' }}>
            <HeaderComponent isHiddenSearch />
            <Loading isLoading={loading}>
                <div id="container" style={{ width: '1270px', height: '100%', margin: '0 auto', backgroundColor: '#fff', justifyContent: 'center' }}>
                    <div style={{
                        fontWeight: 'bold', fontSize: '24px', padding: '10px 0px 10px', justifyContent: 'center',
                        textAlign: 'center', color: '#0057A1'
                    }}>
                        Giới thiệu
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '720px', paddingLeft: '20px' }}>
                            <div style={{ paddingTop: '20px', paddingBottom: '10px', textAlign: 'center', color: '#493628', fontWeight: 'bold', fontSize: '20px', }}>
                                Về MT Music Center
                            </div>
                            <div style={{ paddingBottom: '10px' }}>• MT Music Center là trung tâm âm nhạc được thành lập từ năm 2019,
                                với sứ mệnh truyền cảm hứng và khơi dậy niềm đam mê âm nhạc cho
                                mọi lứa tuổi.</div>
                            <div style={{ paddingBottom: '10px' }}>• Tại MT Music Center, đội ngũ giáo viên trẻ, năng
                                động và nhiệt huyết luôn đồng hành cùng học viên trên hành trình
                                khám phá và phát triển tài năng.</div>
                            <div style={{ paddingBottom: '10px' }}>• Với chương trình đào tạo chuyên
                                nghiệp, trung tâm không chỉ chú trọng vào kiến thức nền tảng mà
                                còn tạo môi trường sáng tạo để học viên tự tin thể hiện bản thân
                                và nuôi dưỡng tình yêu âm nhạc.</div>

                        </div>
                        <div style={{ width: '600px', paddingLeft: '20px' }}>
                            <video width="540px" height="360px" controls autoPlay>
                                <source src={video} type="video/mp4" />
                            </video>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '600px', paddingLeft: '20px' }}>
                            <Image src={productIntro} alt="image" preview={true} with="100%" height="100%" />
                        </div>
                        <div style={{ width: '720px', paddingLeft: '20px' }}>
                            <div style={{ paddingTop: '20px', paddingBottom: '10px', textAlign: 'center', color: '#493628', fontWeight: 'bold', fontSize: '20px', }}>
                                Guitar Trần
                            </div>
                        </div>
                    </div>
                </div>
            </Loading>
        </div>
    );
};

export default IntroPage;
