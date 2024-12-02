import { axiosJWT } from "./UserService"

// export const createProduct = async (data) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
//     return res.data
// }

export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderbyUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsOrder = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/check-my-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteOrder = async (id, access_token, orderItems) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`, { data: orderItems }, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const updateOrderStatus = async (orderId, updatedOrder, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-status/${orderId}`, updatedOrder, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
    });

    if (res?.status !== 200) {
        throw new Error('Cập nhật trạng thái thất bại!');
    }

    return res.data;
};

export const deleteManyOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

// export const getCartByUserId = async (userId, access_token) => {
//     try {
//         const res = await axiosJWT.get(
//             `${process.env.REACT_APP_API_URL}/cart/${userId}`,
//             {
//                 headers: {
//                     token: `Bearer ${access_token}`,
//                 },
//             }
//         );
//         return res.data;
//     } catch (error) {
//         console.error('Lỗi khi gọi API getCartByUserId:', error);
//         throw error;
//     }
// };