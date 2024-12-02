import AdminPage from "../pages/AdminPage/AdminPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderDetailsPage from "../pages/OrderDetailsPage/OrderDetailsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import CheckMyOrder from "../pages/CheckMyOrder/CheckMyOrder";
import TeacherPage from "../pages/TeacherPage/TeacherPage";
import TeacherDetailsPage from "../pages/TeacherDetailsPage/TeacherDetailsPage";
import CoursePage from "../pages/CoursePage/CoursePage";
import CourseDetailsPage from "../pages/CourseDetailsPage/CourseDetailsPage";
import IntroPage from "../pages/IntroPage/IntroPage";
import GiftPage from "../pages/GiftPage/GiftPage";
import FilePage from "../pages/FilePage/FilePage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: false
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: false
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: false
    },
    {
        path: '/check-my-order/:id',
        page: CheckMyOrder,
        isShowHeader: false
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: false
    },
    {
        path: '/order-details',
        page: OrderDetailsPage,
        isShowHeader: false
    },
    {
        path: '/product',
        page: ProductPage,
        isShowHeader: true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: '/teacher',
        page: TeacherPage,
        isShowHeader: true
    },
    {
        path: '/course',
        page: CoursePage,
        isShowHeader: true
    },
    {
        path: '/teacher-details/:id',
        page: TeacherDetailsPage,
        isShowHeader: false
    },
    {
        path: '/course-details/:id',
        page: CourseDetailsPage,
        isShowHeader: false
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: false
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: false
    },
    {
        path: '/intro',
        page: IntroPage,
        isShowHeader: false
    },
    {
        path: '/gift',
        page: GiftPage,
        isShowHeader: false
    },
    {
        path: '/file',
        page: FilePage,
        isShowHeader: false
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '*',
        page: NotFoundPage
    }
]