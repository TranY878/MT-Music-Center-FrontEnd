import React, { useEffect, useState } from 'react';
import { WrapperProducts } from './style';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import Loading from '../../components/LoadingComponent/Loading';
import TeacherCardComponent from '../../components/TeacherCardComponent/TeacherCardComponent';
import * as TeacherService from '../../services/TeacherService';

const TeacherPage = () => {
    const searchTeacher = useSelector((state) => state?.teacher?.search) || '';
    const searchDebounce = useDebounce(searchTeacher, 500);
    const [typeTeachers, setTypeTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('createdAt');
    const [teachers, setTeachers] = useState([]);

    const fetchTeacherAll = async () => {
        setLoading(true);
        const res = await TeacherService.getAllTeacher();
        setLoading(false);

        if (res?.data) {
            // Lọc và sắp xếp giáo viên dựa trên sortOption
            let filteredTeachers = res.data;
            if (sortOption === 'Guitar' || sortOption === 'Piano' || sortOption === 'Trống' || sortOption === 'Thanh nhạc') {
                filteredTeachers = filteredTeachers.filter((teacher) =>
                    teacher.musicalInstrument.toLowerCase() === sortOption.toLowerCase()
                );
            }

            // Sắp xếp theo các tùy chọn khác
            if (sortOption === 'createdAt') {
                filteredTeachers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortOption === 'experience') {
                filteredTeachers.sort((a, b) => new Date(b.experience) - new Date(a.experience));
            }
            setTeachers(filteredTeachers);
        }
    };

    const fetchAllTypeTeacher = async () => {
        const res = await TeacherService.getAllMusicalInstrument();
        if (res?.status === 'OK') {
            setTypeTeachers(res?.data);
        }
    };

    useEffect(() => {
        fetchTeacherAll(); // Fetch tất cả sản phẩm khi component render
        fetchAllTypeTeacher(); // Fetch tất cả loại sản phẩm
    }, [sortOption, searchDebounce]); // Cập nhật khi sortOption và searchDebounce thay đổi

    useEffect(() => {
    }, [searchTeacher]);

    return (
        <div className='body' style={{ width: '100%', height: '100%', backgroundColor: '#f5f5fa' }}>
            <Loading isLoading={loading}>
                <div id="container" style={{ width: '1270px', height: '100%', margin: '0 auto', backgroundColor: '#fff', justifyContent: 'center' }}>
                    <div style={{
                        fontWeight: 'bold', fontSize: '24px', padding: '10px 0px 10px', justifyContent: 'center',
                        textAlign: 'center', color: '#0057A1'
                    }}>
                        TẤT CẢ GIÁO VIÊN
                    </div>
                    <div style={{ width: '1250px', margin: '0 auto', marginLeft: '20px' }}>
                        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Sắp xếp theo:</label>
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="createdAt">Mới tham gia</option>
                            <option value="experience">Kinh nghiệm giảng dạy</option>
                            <option value="Guitar">Guitar</option>
                            <option value="Piano">Piano</option>
                            <option value="Trống">Trống</option>
                            <option value="Thanh nhạc">Thanh nhạc</option>
                        </select>
                    </div>
                    <div id="container" style={{ width: '1270px', height: '1000px', margin: '0 auto' }}>
                        <WrapperProducts>
                            {teachers?.filter((tea) => {
                                if (searchDebounce === '') {
                                    return tea;
                                } else if (tea?.musicalInstrument?.toLowerCase()?.includes(searchDebounce.toLowerCase())) {
                                    return tea;
                                }
                            })?.map((teacher) => {
                                return (
                                    <TeacherCardComponent
                                        key={teacher._id}
                                        musicalInstrument={teacher.musicalInstrument}
                                        experience={teacher.experience}
                                        image={teacher.image}
                                        name={teacher.name}
                                        address={teacher.address}
                                        phone={teacher.phone}
                                        intro={teacher.intro}
                                        facebook={teacher.facebook}
                                        id={teacher._id}
                                    />
                                );
                            })}
                        </WrapperProducts>
                    </div>
                </div>
            </Loading>
        </div>
    );
};

export default TeacherPage;
