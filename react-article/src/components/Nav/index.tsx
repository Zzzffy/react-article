import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom'
import { Input, Button, Popover, Affix, Avatar } from 'antd';
import {  FormOutlined, UserOutlined } from '@ant-design/icons';

import { observer } from 'mobx-react-lite'
import cookie from 'react-cookies'
import SlideMenu from './SlideMenu';
import * as api from '../../services/api'
import UserStore from "../../store/UserStore";
import ArticleStore from "../../store/ArticleStore";
import style from './style.module.less'
import logo from '../../assets/imgs/logo.png';


export default observer(function Nav() {
  const { Search } = Input
  const location = useLocation()
  const store = useContext(UserStore)
  const article = useContext(ArticleStore)
  const [img, setImg] = useState('')
  const isLogin = cookie.load('userToken') !== undefined

  useEffect(() => {
    // 判断是否登录
    if (isLogin) {
      api.userInfo().then(res => {
        if (res.stat === 'ok') {
          store.userInfo(res.data)  // mobx存储用户信息
          store.user.avatar && getPicture(store.user.avatar)
        }
      })
    }
  }, [])

  // 根据key获取头像
  const getPicture = async (key: string) => {
    const result: any = await api.getAvatar(key)
    setImg(result)
  }
  // 存储keyword到mobx
  const searchArticles = (e: string) => {
    article.setSearchKey(e)
  }


  return (
    <Affix offsetTop={0} >
      <header className={[`${style.nav}`, `nav`].join(' ')}>
        <div className={style.container}>
          <div className={style.nav_left}>
            <Link to="/" >
              <img src={logo} alt="" className={style.img} />
            </Link>
            <Search placeholder="请输入关键字"
              allowClear
              style={{ width: 220 }} onSearch={e => searchArticles(e)} />
          </div>
          {/* 右侧 */}
          <div className={style.btns}>
            <div className={isLogin ? style.login : style.logout}>
              {
                isLogin ? <Popover placement="bottom" content={<SlideMenu />} >
                  <Avatar src={img} icon={<UserOutlined />} onError={() => true} />
                </Popover> : <>
                  <Link to={{
                    pathname: "/sign_in",
                    state: { from: location.pathname }
                  }}>
                    <h2>登录</h2>
                  </Link>
                  <Link to="/sign_up" className={style.btn} >
                    <Button shape="round" size={'large'}>
                      注册
                    </Button>
                  </Link>
                </>
              }
            </div>
            <Link to="/write">
              <Button type="primary" shape="round" size={'large'} icon={<FormOutlined />} >
                写文章
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </Affix>
  )
})