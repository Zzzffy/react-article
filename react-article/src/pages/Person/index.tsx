import { useContext, useEffect, useState } from "react";
import { Button, Avatar } from 'antd'
import { GithubOutlined, DribbbleOutlined, UserOutlined } from '@ant-design/icons';

import { observer } from 'mobx-react-lite'
import * as api from '../../services/api'
import UserStore from '../../store/UserStore'
import Nav from '../../components/Nav/index'
import BackToTop from "../../components/BackToTop";
import Article from "../../components/Article";
import style from './style.module.less'

export default observer(function Person(props: any) {
  const store = useContext(UserStore)
  const [avatar, setAvatar] = useState('')
  const editUser = () => {
    props.history.push('/user/settings')
  }
  useEffect(() => {   
      store.user.avatar && getPicture(store.user.avatar)
  }, [])
  
  const getPicture = async (key: string) => {
    const result: any = await api.getAvatar(key)
    setAvatar(result)
  }

  return (
    <>
      <Nav />
      <div className={style.main}>
        {/* 用户信息 */}
        <div className={style.info}>
          <Avatar src={avatar} icon={<UserOutlined style={{ fontSize: '52px' }} />} onError={() => true} className={style.avatar} />
          <div className={style.box}>
            <div className={style.top}>
              <h1 className={style.name}>{store.user?.account}</h1>
            </div>
            <div className={style.intro}>永远年轻 永远热泪盈眶</div>
          </div>
          <div className={style.action}>
            <div className={style.link}>
              <GithubOutlined style={{ fontSize: '20px' }} onClick={() => window.location.href = 'https://github.com/Zzzffy/'} />
              <DribbbleOutlined style={{ fontSize: '20px' }} onClick={() => window.location.href = 'https://www.cnblogs.com/BAHG/'} />
            </div>
            <Button type="primary" className={style.btn} onClick={editUser}>编辑个人资料</Button>
          </div>
        </div>
        {/* 文章列表 */}
        <div className={style.articles}>
          <Article />
        </div>
        <BackToTop />
      </div>
    </>
  )
})
