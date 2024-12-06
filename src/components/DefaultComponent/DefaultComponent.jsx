import React, { useEffect, useState } from 'react'; // import useState
import { useLocation } from 'react-router-dom';
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import HeaderComponent from '../HeaderComponent/HeaderComponent';

const DefaultComponent = ({ children }) => {
    const { pathname } = useLocation(); // lấy URL hiện tại
    const [isVisible, setIsVisible] = useState(false); // trạng thái để điều khiển hiển thị nút

    useEffect(() => {
        // Cuộn về đầu trang mỗi khi URL thay đổi
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) { // thay đổi giá trị 300 theo nhu cầu
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            {/* Cố định vị trí HeaderComponent */}
            {/* <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}> */}
            <HeaderComponent />
            {/* </div> */}

            {/* Tạo khoảng trống cho nội dung chính tránh bị HeaderComponent che */}
            {/* <div style={{ paddingTop: '100px' }}> */}
            {children}
            {/* </div> */}

            {/* Nút Quay về đầu trang */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        padding: '10px 20px',
                        border: 'none',
                        backgroundColor: '#f5f5fa',
                        cursor: 'pointer',
                        fontSize: '20px',
                        zIndex: 1000
                    }}
                >
                    <VerticalAlignTopOutlined />
                </button>
            )}
        </div>
    );
}

export default DefaultComponent;
