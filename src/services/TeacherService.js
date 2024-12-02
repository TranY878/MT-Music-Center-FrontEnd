import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllTeacher = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/teacher/get-all?filter=musicalInstrument&search=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/teacher/get-all?limit=${limit}`)
    }
    return res.data
}

// export const getTeacherMusicalInstrument = async (musicalInstrument, page, limit) => {
//     if (musicalInstrument) {
//         const res = await axios.get(`${process.env.REACT_APP_API_URL}/teacher/get-all?filter=musicalInstrument&filter=${musicalInstrument}&limit=${limit}&page=${page}`)
//         return res.data
//     }
// }

export const createTeacher = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/teacher/create`, data)
    return res.data
}

export const getDetailsTeacher = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/teacher/get-details/${id}`)
    return res.data
}

export const updateTeacher = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/teacher/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteTeacher = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/teacher/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyTeacher = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/teacher/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllMusicalInstrument = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/teacher/get-all-musical-instrument`)
    return res.data
}