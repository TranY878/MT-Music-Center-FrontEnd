import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllCourse = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-all?filter=name&search=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-all?limit=${limit}`)
    }
    return res.data
}

export const getCourseSubject = async (subject, page, limit) => {
    if (subject) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-all?filter=subject&filter=${subject}&limit=${limit}&page=${page}`)
        return res.data
    }
}

export const createCourse = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/course/create`, data)
    return res.data
}

export const getDetailsCourse = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-details/${id}`)
    return res.data
}

export const updateCourse = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/course/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteCourse = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/course/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyCourse = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/course/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllCourseLevel = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-all-level`)
    return res.data
}

export const getAllCourseType = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-all-type`)
    return res.data
}

export const getAllCourseSubject = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-all-subject`)
    return res.data
}