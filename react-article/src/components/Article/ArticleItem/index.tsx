import { useEffect, useState } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { List, Avatar, Statistic, Tag, Space, Button, message, Modal } from 'antd';
import { EyeOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';

import { IArticle } from '../../../types'
import * as api from '../../../services/api'
import getAgoAt from '../../../utils/time' // 转换时间
import style from './style.module.less'

interface Props {
  article: IArticle,
  delArticle: Function,
}

export default function ArticleItem(props: Props) {
  const history = useHistory()
  const location = useLocation()
  const isUser = location.pathname === '/user'
  const { _id, title, subTitle, ctime, author, banner, content, tags, preview } = props.article
  const { account, avatar } = author
  const tagList = tags.split(",")
  const time = getAgoAt(parseInt(ctime))
  const [img, setImg] = useState('') // 头像
  const [bannerImg, setbannerImg] = useState('') // banner

  useEffect(() => {
    avatar && getPicture(avatar)
    banner[0] && getBanner()
  }, [])

  // 获取用户头像
  const getPicture = async (key: string) => {
    const result: any = await api.getAvatar(key)
    setImg(result)
  }

  // 获取文章banner图
  const getBanner = async () => {
    const result: any = await api.getAvatar(banner[0])
    setbannerImg(result)
  }

  // 阻止默认跳转
  const handleClick = (e: any) => {
    if (isUser) {
      e.preventDefault()
    }
    else {
      history.push('/detail/' + _id)
    }
  }

  // Modal对话框
  const showModal = () => {
    Modal.confirm({
      title: '确定要删除该文章吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const result = await api.delArticle(_id)
        if (result.stat === 'ok') {
          props.delArticle()  // 回传父组件
          message.success('删除成功！')
        } else {
          message.error('删除失败！')
        }
      },
      async onCancel() {
        message.success('已取消删除！');
      }
    });
  }

  return (
    <div className={style.article} onClick={e => handleClick(e)}>
      <div className={style.top}>
        <Avatar src={img} icon={<UserOutlined />} onError={() => true} />
        <ul className={style.top}>
          <li>{account}</li>
          <li className={style.time}>{time}</li>
        </ul>
      </div>
      <div className={style.content}>
        <List.Item
        className={style.item}
          extra={
            banner[0] ?
              <img
                className={style.banner}
                alt="banner"
                src={bannerImg}
              /> : ''
          }
        >
          <div className={style.title}>
            {title}
          </div>
          <div>
            {subTitle}
          </div>
          <div className={style.con}> {content}</div>
          <div className={style.comment}>
            {tagList[0] ?
              tagList.map((tag, index) => {
                return (
                  <div className={style.item_view} key={index}>
                    <Tag color="blue">
                      {tag}
                    </Tag>
                  </div>
                )
              })
              : ''}
            <Statistic className={style.num} value={preview} prefix={<EyeOutlined style={{ fontSize: '14px' }} />} />
            {/* 是否为个人中心界面 */}
            {isUser && <Space size="middle">
              <Link to={`/edit/article/${_id}`}>编辑</Link>
              <Link to={`/detail/${_id}`}>浏览</Link>
              <Button type="text" onClick={showModal} className={style.del_btn}>
                删除
              </Button>
            </Space>}
          </div>
        </List.Item>
      </div>
    </div>
  )
}