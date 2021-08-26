import { useEffect, useContext, useState } from "react";
import { Form, Input, Button, Checkbox, message, Avatar } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { observer } from 'mobx-react-lite'
import Nav from "../../components/Nav/index";
import { IPerson } from "../../types";
import * as api from '../../services/api'
import UserStore from "../../store/UserStore";
import { setCookie } from "../../utils/cookie";
import style from './style.module.less'

export default observer(function Login(props: any) {
  const { history } = props
  const store = useContext(UserStore)
  const [form] = Form.useForm();
  const [img, setImg] = useState('') // 头像


  // 设置表单的值
  useEffect(() => {
    form.setFieldsValue({
      account: store.login.account,
      pwd: store.login.pwd
    })
    getAvatar(store.login.account)
  }, [])
  // 用户输完用户名后获取头像（防抖，这里没有使用闭包放到内存，直接将timer放到全局）
  let timer: NodeJS.Timeout
  const getAvatar = async (value: string) => {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        // console.log(111);
        const result = await api.check(value)
        if (result.stat === 'ok' && result.data.user.avatar !== '') {
          const res: any = await api.getAvatar(result.data.user.avatar)
          setImg(res)
        } else setImg('')
      }, 1000);

  }
  // 提交表单
  const onFinish = async (values: IPerson) => {
    const { account, pwd, remember } = values
    let result = await api.login(account, pwd)
    if (result.stat === 'ok') {
      setCookie(result.data.token)  //存入cookie
      if (remember) {
        store.loginInfo({ account, pwd })
      } else {
        store.delLoginInfo()
      }
      message.success('登录成功')
      const { from } = props.location.state || { from: { pathname: '/' } };
      if (from === '/sign_up') {
        history.push('/')
      } else {
        history.push(from)
      }
    } else {
      message.error('账号或密码错误！')
    }
  }

  return (
    <>
      <Nav />
      <div className={style.login}>
        <div className={style.container}>
          <div className={style.content}>
            <h1 className={style.title}>用户登录</h1>
            <div className={style.head}>
              <div className={style.picture}>
                <Avatar size={60} src={img} icon={<UserOutlined />} onError={() => true} />
              </div>
              <div className={style.word}>开启你的创作之旅</div>
            </div>
            <Form
              form={form}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="account"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" onChange={(e) => getAvatar(e.target.value)} />
              </Form.Item>
              <Form.Item
                name="pwd"
                rules={[{ required: true, message: '请输入密码' },]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
              <div className={style.text}>
                没有账户，<Button type="link" style={{ padding: 0 }} onClick={() => { history.push('/sign_up') }}>立即注册</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
})

