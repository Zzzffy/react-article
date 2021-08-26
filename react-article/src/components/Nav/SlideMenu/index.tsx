import { useContext } from 'react';
import { Menu } from 'antd';
import {  useHistory } from 'react-router-dom'

import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

import * as api from '../../../services/api'
import { delCookie } from '../../../utils/cookie';
import UserStore from '../../../store/UserStore';
import style from './style.module.less'
export default function SlideMenu(props: any) {
  const store = useContext(UserStore)
  const history = useHistory()
  const menuData = [
    {
      iconType: <UserOutlined />,
      text: '个人中心',
      linkPath: 'user'
    },
    {
      iconType: <LogoutOutlined />,
      text: '退出',
      linkPath: 'logout'
    }
  ]

  const handleClick = async (e: any) => {
    if (e.keyPath[0] === 'logout') {
      delCookie()
      let result = await api.logout()
      if (result.stat === 'ok') {
        window.location.href = "/";
        store.delUserInfo()
      }
    } else {
      history.push('/' + e.keyPath[0])
    }
  }
  return (
    <div>
      <Menu onClick={e => handleClick(e)} style={{ width: 120, border: 'none' }} mode="vertical">
        {
          menuData.map((item, index) => {
            return (
              <Menu.Item key={item.linkPath} icon={item.iconType} className={style.menu}>
                {item.text}
              </Menu.Item>)
          })
        }
      </Menu>
    </div>
  )
}
