import { useContext } from 'react'
import { Form, Input, message,  Button } from 'antd'

import * as api from '../../../../services/api'
import UserStore from '../../../../store/UserStore';
import { delCookie } from '../../../../utils/cookie';
import style from './style.module.less'

export default function Profile() {
  const [form] = Form.useForm();
  const store = useContext(UserStore)
  // 排版设置
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  // 提交表单
  const onFinish = async (values: any) => {
    const { oldPwd, newPwd } = values
    const result = await api.updatePwd(store.user._id, oldPwd, newPwd)
    if (result.stat === 'ok') {
      message.success('修改成功，请重新登录！')
      store.delUserInfo()
      store.delLoginInfo()
      delCookie()
      window.location.href = "/sign_in";
    } else {
      message.error('原密码错误，请重新输入！')
    }
  };

  return (
    <Form
      {...formItemLayout}
      className={style.form}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        className={style.item}
        name="oldPwd"
        label="原密码"
        rules={[
          {
            required: true,
            message: '请输入原密码',
          }
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        className={style.item}
        name="newPwd"
        label="新密码"
        dependencies={['oldPwd']}
        rules={[
          {
            required: true,
            message: '请输入新密码',
          },
          {
            pattern: /^(\w){6,12}$/,
            message: '只能输入6-12个字母、数字、下划线',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('oldPwd') !== value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('密码重复，请重新输入！'));
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        className={style.item}
        name="confirm"
        label="确认密码"
        dependencies={['newPwd']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPwd') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次密码输入不一致！'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailFormItemLayout} className={style.item}>
        <Button type="primary" htmlType="submit">
          提交修改
        </Button>
      </Form.Item>
    </Form>
  )
}
