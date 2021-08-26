import { lazy } from 'react';
const Writer = lazy(() => import("../pages/Writer")) // 写文章
const Person = lazy(() => import("../pages/Person")) // 个人中心
const Set = lazy(() => import("../pages/Person/Set")) // 设置

const privateRoutes = [
  {
    path: '/write',
    component: Writer,
  },
  {
    path: '/user',
    component: Person,
    exact: true,
  },
  {
    path: '/user/settings',
    component: Set,
  },
  {
    path: '/edit/article/:id',
    component: Writer,
  },

];

export default privateRoutes;