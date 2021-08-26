import { useState, useEffect, useContext } from 'react'
import { Card, Avatar, Affix, Button, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// MarkDown
import { Viewer } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import "bytemd/dist/index.min.css";
import "highlight.js/styles/vs.css";
import 'github-markdown-css/github-markdown.css'

// 导航目录
import MarkNav from 'markdown-navbar'
import 'markdown-navbar/dist/navbar.css';

import moment from 'moment';
import Nav from '../../components/Nav'
import BackToTop from '../../components/BackToTop';
import * as api from '../../services/api'
import UserStore from '../../store/UserStore';
import { IUser } from '../../types'
import style from './style.module.less'

export default function Detail(props: any) {
  const articleId: string = props.match.params.id
  const plugins = [gfm(), gemoji(), highlight(), mediumZoom()];
  const store = useContext(UserStore)

  const [banner, setBanner] = useState<string[]>([])
  const [bannerImg, setBannerImg] = useState('')
  const [avatarImg, setImg] = useState('')
  const [content, setContent] = useState<string>('');
  const [ctime, setCTime] = useState<string>()
  const [preview, setPreview] = useState<number>()
  const [title, setTitle] = useState<string>()
  const [subTitle, setSubTitle] = useState<string>()
  const [author, setAuthor] = useState<IUser>()

  const [loading, setLoading] = useState(true)
  const isUser = author?.account === store.user.account
  
  // 获取文章详情
  useEffect(() => {
    getArticleDetail()
  }, [])

  // 获取到数据后加载banner图
  useEffect(() => {
    const getBanner = async () => {
      const result: any = await api.getAvatar(banner[0])
      setBannerImg(result)
    }
    getBanner()
  }, [loading])

  // 获取用户头像
  useEffect(() => {
    const getPicture = async (key: string) => {
      const result: any = await api.getAvatar(key)
      setImg(result)
    }
    getPicture(author?.avatar || '')
  }, [author])
  
  const getArticleDetail = () => {
    api.detail(articleId).then(res => {
      if (res.stat === 'ok') {
        setAuthor(res.data.info.author)
        setBanner(res.data.info.banner)
        setCTime(res.data.info.ctime)
        setContent(res.data.info.content)
        setPreview(res.data.info.preview)
        setTitle(res.data.info.title)
        setSubTitle(res.data.info.subTitle)
        setLoading(false)
      }
    }, err => console.log(err))
  }

  const editArticle = (articleId: string) => {
    props.history.push(`/edit/article/${articleId}`)
  }

  return (
    <>
      <Nav />
      <Row className={style.container}>
        <Col span={20}>
          <div className={style.article}>
            <div className={style.top}>
                <Avatar src={avatarImg} icon={<UserOutlined style={{ fontSize: '22px' }} />} onError={() => true} className={style.avatar} />
              <div className={style.author}>
                <div className={style.name}>{author?.account}</div>
                <div className={style.meta}>
                  <span>{moment().format('YYYY年MM月DD日')}</span>
                  <span className={style.preview}>浏览量&nbsp;{preview}</span>
                  {isUser ?
                    <Button type="link" onClick={() => editArticle(articleId)}>编辑</Button>
                    : ''}
                </div>
              </div>
            </div>
            <Card style={{ width: '100%', height: '100%' }} loading={loading} bordered={false} className="markdown-body">
                {banner[0] ? <img src={bannerImg} alt="banner图" className={style.banner} /> : ''}
                <h1 className={style.title}>{title}</h1>
                <div className={style.sub_title}>{subTitle}</div>
                {/* 内容 */}
                <Viewer value={content} plugins={plugins} />
            </Card>
          </div>
        </Col>
        {/* 右侧目录 */}
        <Col span={4}>
          <Affix offsetTop={70}>
            <div className={style.nav_title}>文章目录</div>
            <MarkNav
              className="article-menu"
              source={content}				//markdown书写的文本内容,数据源
              headingTopOffset={80}			
              ordered={true}			
            />
          </Affix>
        </Col>
      </Row>
      <BackToTop />
    </>
  )
}
