import React, { useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import hssv from '../../assets/images/hssv.jpg'
import backbuy from '../../assets/images/backbuy.jpg'
import { Image } from 'antd';


const GiftPage = () => {
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
                        Ưu đãi
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '720px', paddingLeft: '20px' }}>
                            <div style={{ paddingTop: '20px', paddingBottom: '10px', textAlign: 'center', color: '#493628', fontWeight: 'bold', fontSize: '20px', }}>
                                Khuyến khích học sinh - sinh viên học tập
                            </div>
                            <div style={{ paddingBottom: '10px' }}>
                                Chương trình "Ưu đãi học sinh - sinh viên" tại trung tâm là cơ hội tuyệt
                                vời dành cho các bạn trẻ đam mê âm nhạc. Khi đến mua nhạc cụ trực tiếp
                                tại trung tâm, các bạn học sinh, sinh viên sẽ được hưởng những ưu đãi đặc biệt như:</div>
                            <div style={{ paddingBottom: '10px' }}>• Giảm giá trực tiếp trên nhiều dòng nhạc cụ phổ biến.</div>
                            <div style={{ paddingBottom: '10px' }}>• Quà tặng đi kèm hấp dẫn như dây đàn, sách hướng dẫn, hoặc phụ kiện.</div>
                            <div style={{ paddingBottom: '10px' }}>• Hỗ trợ trả góp 0%, giúp việc sở hữu nhạc cụ trở nên dễ dàng hơn.</div>
                        </div>
                        <div style={{ width: '600px', paddingLeft: '20px' }}>
                            <div style={{ width: '600px', paddingLeft: '20px' }}>
                                <Image src={hssv} alt="image" preview={true} with="100%" height="100%" />
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '50px' }}></div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '600px', paddingLeft: '20px' }}>
                            <Image src={backbuy} alt="image" preview={true} with="100%" height="100%" />
                        </div>
                        <div style={{ width: '720px', paddingLeft: '20px' }}>
                            <div style={{ paddingTop: '20px', paddingBottom: '10px', textAlign: 'center', color: '#493628', fontWeight: 'bold', fontSize: '20px', }}>
                                Tri ân khách hàng thân thiết
                            </div>
                            <div style={{ paddingBottom: '10px' }}>
                                Khi bạn quay lại mua sắm và mang theo 3 hóa đơn đã mua trước đó,
                                bạn sẽ được giảm ngay 5% tổng giá trị đơn hàng mới. Đây là cơ hội
                                tuyệt vời để vừa tiết kiệm, vừa nhận thêm những sản phẩm yêu thích.
                                Hãy tiếp tục đồng hành cùng chúng tôi và tận hưởng nhiều ưu đãi hấp dẫn hơn nữa!</div>
                        </div>
                    </div>
                </div>
            </Loading>
        </div>
    );
};

export default GiftPage;
