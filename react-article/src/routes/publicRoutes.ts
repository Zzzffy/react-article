import { lazy} from 'react';
const Index = lazy(() => import("../pages/Index")) // 首页
const Login = lazy(() => import("../pages/Login")) // 登录
const Register = lazy(() => import("../pages/Register")) // 注册
const Detail = lazy(() => import("../pages/Detail")) // 文章详情

const publicRoutes = [
  {
    path: '/',
    component: Index,
    exact: true,
  },
  {
    path: '/sort',
    component: Index,
  },
  {
    path: '/sign_in',
    component: Login,
    exact: true,
  },
  {
    path: '/sign_up',
    component: Register,
    exact: true,
  },
  {
    path: '/detail/:id',
    component: Detail,
  },
 
];

export default publicRoutes;