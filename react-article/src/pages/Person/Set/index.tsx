import { lazy } from "react";
import { Link, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite'

import { Layout, Menu } from 'antd'
import { ArrowLeftOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'
import Nav from '../../../components/Nav/index';
import style from './style.module.less'

const Profile = lazy(() => import("./Profile")); // 修改资料
const Account = lazy(() => import("./Account")); // 修改密码

export default observer(function Set() {
  const history = useHistory()
  const { Sider, Content } = Layout;

  const path = history.location.pathname
  return (
    <div className={style.content}>
      <Nav />
      <div className={style.main}>
        <nav className={style.nav}>
          <Link to={'/user'} className={style.text}><ArrowLeftOutlined style={{ marginRight: '4px' }} />返回个人主页</Link>
        </nav>
        <Layout className={style.layout}>
          <Sider className={style.aside} width={200} >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
              selectedKeys={[path]}
            >
              <Menu.Item key="/user/settings/profile" icon={<UserOutlined />}>
                <Link to='/user/settings/profile'>个人资料</Link>
              </Menu.Item>
              <Menu.Item key="/user/settings/account" icon={<SettingOutlined />}>
                <Link to='/user/settings/account'>修改密码</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content className={style.right}>
            <Switch>
              <Route path="/user/settings/profile" component={Profile} />
              <Route path="/user/settings/account" component={Account} />
              <Redirect from="/user/settings" to="/user/settings/profile" />
            </Switch>
          </Content>
        </Layout>
      </div>
    </div>
  )
})
