import { Form, Input, Button, message } from 'antd';
import Nav from "../../components/Nav/index";
import * as api from '../../services/api'
import style from './style.module.less'

export default function Register(props: any) {
  const { history } = props
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
    const { account, pwd } = values
    let result = await api.register(account, pwd)
    if (result.stat === 'ok') {
      message.success('注册成功，请登录！')
      history.push('/sign_in')
    } else {
      message.error('注册失败！')
    }
  };
  // 检查用户名是否存在
  const checkAccount = async (value: string) => {
    let result = await api.check(value)
    if (result.stat === 'ok') {
      message.warning('用户名已存在，请重新输入！')
    }
  }

  return (
    <>
      <Nav />
      <div className={style.login}>
        <div className={style.container}>
          <div className={style.content}>
            <h1 className={style.title}>用户注册</h1>
            <Form
              {...formItemLayout}
              name="register"
              onFinish={onFinish}
              scrollToFirstError
            >
              <Form.Item
                name="account"
                label="用户名"
                tooltip="用户名唯一且不可更改"
                rules={[{ required: true, message: '请输入用户名', whitespace: true }, {
                  pattern: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){1,9}$/,
                  message: '用户名为2-10位以字母开头，可带数字下划线',
                }]}
              >
                <Input onBlur={e => checkAccount(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="pwd"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  }, {
                    pattern: /^(\w){6,12}$/,
                    message: '只能输入6-12个字母、数字、下划线',
                  }
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="确认密码"
                dependencies={['pwd']}
                rules={[
                  {
                    required: true,
                    message: '请确认密码',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('pwd') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码输入不一致！'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" >
                  注册
                </Button>
              </Form.Item>
              <div className={style.text}>
                已有账户，<Button type="link" style={{ padding: 0 }} onClick={() => { history.push('/sign_in') }}>立即登录</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

