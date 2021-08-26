import { useState, useEffect, useContext } from "react";
import { Form, Input, Upload, Button, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { observer } from 'mobx-react-lite'
import * as api from '../../../../services/api'
import User from '../../../../store/UserStore'
import style from './style.module.less'

export default observer(function Profile(props: any) {
  const [form] = Form.useForm();
  const store = useContext(User)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('') //图片展示
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
  // 图片显示组件
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
    </div>
  );
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  useEffect(() => {
    getAvatar(store.user.avatar)
    form.setFieldsValue({
      account: store.user?.account,
      nickname: store.user?.nickname,
      avatar: imageUrl,
    })
  }, [])

  const getAvatar = async (key: string) => {
    if (key !== '') {
      let result: any = await api.getAvatar(key)
      setImageUrl(result)
    }
  }

  // 提交表单
  const onFinish = async (values: any) => {
    let result = await api.updateUser(store.user._id, values.nickname, store.user.avatar)
    if (result.stat === 'ok') {
      message.success("更新成功！")
      props.history.push('/user')
    }
  };
  // 对上传图片的限制
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传jpg或png格式的图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不超过2MB！');
    }
    return isJpgOrPng && isLt2M;
  }
  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  // 发生改变才会触发，如果用户没有修改图片就不会触发
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setImageUrl(imageUrl)
        setLoading(false)
        //会触发mobx的user更新，因为mobx同时也检测了user下面的属性
        store.setAvatar(info.file.response.data)
      })
    }
  }
  // 重置头像
  const resetImg = () => {
    setImageUrl('')
    store.setAvatar('')
  }

  return (
    <Form
      {...formItemLayout}
      className={style.form}
      form={form}
      name="profile"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        className={style.item}
        name="account"
        label="用户名"
        tooltip="用户名不可更改"
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        className={style.item}
        name="nickname"
        label="昵称"
        tooltip="给自己起个好听的昵称吧"
        rules={[
          {
            pattern: /^[\w\u4e00-\u9fa5]{0,8}$/,
            message: '昵称由汉字、字母、数字、下划线组成，最多8位',
          }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        className={style.item}
        name="picture"
        label="头像"
        getValueFromEvent={normFile}
      >
        <Upload
          name='avatar'
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="/api/file/upload"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {/* 编辑展示图片，添加展示默认图标 */}
          {(imageUrl) ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </Form.Item>
      <Button type="text" onClick={() => resetImg()} className={style.reset}>重置</Button>
      <Form.Item {...tailFormItemLayout} className={style.item}>
        <Button type="primary" htmlType="submit">
          提交修改
        </Button>
      </Form.Item>
    </Form>
  )
})
