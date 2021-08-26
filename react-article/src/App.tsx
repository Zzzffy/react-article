import { lazy, Suspense } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN'
import publicRoutes from './routes/publicRoutes';
import privateRoutes from './routes/privateRoutes';
import AuthRoute from './components/AuthRoute';
const NotFound = lazy(() => import("./pages/NotFound")) // 404页面
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Suspense fallback={<Spin className="example" />}>
          <Switch>
            {/* 公共页面 */}
            {publicRoutes.map(
              ({ path, component, ...routes }) =>
                <Route key={path} path={path} component={component} {...routes} />
            )}
            {/* 鉴权页面 */}
            {privateRoutes.map(
              ({ path, component, ...routes }) => <AuthRoute key={path} path={path} component={component} {...routes} />
            )}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
