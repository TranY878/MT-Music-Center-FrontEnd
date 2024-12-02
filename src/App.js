import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { routes } from './routes'
import { isJsonString } from './utils'
import { jwtDecode } from 'jwt-decode'
import * as UserService from './services/UserService'
import * as OrderService from './services/OrderService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slides/userSlide'
import Loading from './components/LoadingComponent/Loading'
import { setUserId, loadOrderItems } from './redux/slides/orderSlide';

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)
  const userId = useSelector(state => state.order.userId);

  useEffect(() => {
    setIsLoading(true)
    const { strorageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, strorageData)
      dispatch(setUserId(decoded.id))
    }
    setIsLoading(false)
  }, [dispatch])

  const handleDecoded = () => {
    let strorageData = localStorage.getItem('access_token')
    let decoded = {}
    if (strorageData && isJsonString(strorageData)) {
      strorageData = JSON.parse(strorageData)
      decoded = jwtDecode(strorageData)
    }
    return { decoded, strorageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     if (userId) {
  //       try {
  //         // Gọi API getCartByUserId
  //         const response = await OrderService.getCartByUserId(userId);
  //         if (response.status === 'OK') {
  //           dispatch(loadOrderItems(response.data)); // Load giỏ hàng vào Redux
  //         } else {
  //           console.error('Lỗi lấy giỏ hàng:', response.message);
  //         }
  //       } catch (error) {
  //         console.error('Lỗi khi gọi API getCartByUserId:', error.message);
  //       }
  //     }
  //   };

  //   fetchCartItems();
  // }, [userId, dispatch]);

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const isCheckAuth = !route.isPrivate || user.isAdmin
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              return (
                <Route key={route.path} path={isCheckAuth ? route.path : undefined} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}

export default App