import React, { useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import tuhocguitar from '../../assets/images/tuhocguitar.jpg'
import tuhocpiano from '../../assets/images/tuhocpiano.jpg'
import { Image } from 'antd';


const FilePage = () => {
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
                        Tài liệu
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '720px', paddingLeft: '20px' }}>
                            <div style={{ paddingTop: '20px', paddingBottom: '10px', textAlign: 'center', color: '#493628', fontWeight: 'bold', fontSize: '20px', }}>
                                Tự học guitar
                            </div>
                            <div style={{ fontSize: '14px', paddingBottom: '10px', textAlign: 'center', color: '#59504b', fontWeight: 'bold' }}>
                                <a href='https://www.youtube.com/playlist?list=PLPIKFJXssujURsHuSyYAs53mPXlwBWYKg' target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    Xem tài liệu
                                </a>
                            </div>
                        </div>
                        <div style={{ width: '600px', paddingLeft: '20px' }}>
                            <div style={{ width: '600px', paddingLeft: '20px' }}>
                                <Image src={tuhocguitar} alt="image" preview={true} with="100%" height="100%" />
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '50px' }}></div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '600px', paddingLeft: '20px' }}>
                            <Image src={tuhocpiano} alt="image" preview={true} with="100%" height="100%" />
                        </div>
                        <div style={{ width: '720px', paddingLeft: '20px' }}>
                            <div style={{ paddingTop: '20px', paddingBottom: '10px', textAlign: 'center', color: '#493628', fontWeight: 'bold', fontSize: '20px', }}>
                                Piano căn bản
                            </div>
                            <div style={{ fontSize: '14px', paddingBottom: '10px', textAlign: 'center', color: '#59504b', fontWeight: 'bold' }}>
                                <a href='https://www.youtube.com/watch?v=SFpXwAbwP3Q&list=PLHojBQ5KOx5pdYQ6KtMpJf04RmwNI18vo' target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    Xem tài liệu
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </Loading>
        </div>
    );
};

export default FilePage;
