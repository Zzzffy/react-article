import { useState, useEffect, useRef } from "react";

import {
  Layout,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Modal,
  Upload,
  Tag, Tooltip
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import { Editor } from "@bytemd/react";
import zhHans from "bytemd/lib/locales/zh_Hans.json";
import gfm from "@bytemd/plugin-gfm";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import "bytemd/dist/index.min.css";
import "highlight.js/styles/vs.css";
import 'github-markdown-css/github-markdown.css'

import * as api from "../../services/api";
import style from "./style.module.less";

export default function Document(props: any) {
  const plugins = [gfm(), gemoji(), highlight(), mediumZoom()];
  const articleId: string = props.match.params.id
  const { history } = props;
  const { Header, Content } = Layout;
  const [form] = Form.useForm();
  const [ModalForm] = Form.useForm();
  // Modal对话框
  const [value, setValue] = useState(""); // 文章内容
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); //图片展示
  // 标签
  const [tags, setTags] = useState<Array<string>>([])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [editInputIndex, setEditInputIndex] = useState(-1)
  const [editInputValue, setEditInputValue] = useState('')
  const inputRef: any = useRef(null)
  const editInputRef: any = useRef(null)
  // 图片key
  const [key, setKey] = useState('')
  // Modal排版设置
  const formItemLayout = {
    labelCol: {
      xs: { span: 32 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  useEffect(() => {
    if (articleId) {
      getInfo()
    }
  }, [])
  // 获取文章信息
  const getInfo = async () => {
    const result = await api.detail(articleId)
    setKey(result.data.info.banner[0])
    form.setFieldsValue({
      title: result.data.info.title,
    })
    ModalForm.setFieldsValue({
      subTitle: result.data.info.subTitle,
    })
    setValue(result.data.info.content.replace(/↵/g, "\n"));
    result.data.info.tags && setTags(result.data.info.tags?.split(','))
    api.getAvatar(result.data.info.banner[0]).then((res: any) => setImageUrl(res))
  }
  // 点击编辑之后获取焦点
  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputIndex, editInputValue])
  // 新增标签获取焦点
  useEffect(() => {
    inputRef.current?.focus()
  }, [inputVisible])

  // 双击编辑标签
  const doubleClick = (e: any, index: number, tag: string) => {
    setEditInputIndex(index)
    setEditInputValue(tag)
    e.preventDefault()
  }
  // 新建标签
  const showInput = () => {
    setInputVisible(true)
  };
  // 输入标签内容
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value)
  };
  // 确认标签
  const handleInputConfirm = () => {
    if (inputValue.trim() && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue.replace(/\s+/g, "")])
    }
    setInputVisible(false)
    setInputValue('')
  };
  // 编辑标签内容
  const handleEditInputChange = (e: any) => {
    setEditInputValue(e.target.value)
  };
  // 编辑成功
  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags)
    setEditInputValue('')
    setEditInputIndex(-1)
  };
  // 删除标签
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags)
  };
  // 图片部分
  const uploadButton = (
    <div>{loading ? <LoadingOutlined /> : <PlusOutlined />}</div>
  );
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只允许上传jpg或png格式的图片！");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("文件大小不超过2MB！");
    }
    return isJpgOrPng && isLt2M;
  };
  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setImageUrl(imageUrl);
        setLoading(false);
        setKey(info.file.response.data)
      });
    }
  };

  //验证标题
  const handleSubmit = () => {
    if (!form.getFieldValue("title")) {
      message.error("标题不能为空！");
    } else {
      setVisible(true);
    }
  };
  const handleCancel = () => {
    setVisible(false);
  };
  // 提交文章
  const handleOk = () => {
    ModalForm
      .validateFields()
      .then(async () => {
        // 准备数据
        let banner = []
        banner.push(key)
        const title: string = form.getFieldValue('title')
        const subTitle: string = ModalForm.getFieldValue('subTitle')
        const content: string = value
        if (!content) {
          message.warning('内容不能为空！')
          return
        }
        // 编辑页面
        if (props.match.params.id) {
          const result = await api.editArticle(props.match.params.id, title, subTitle, content, tags, banner)
          if (result.stat === 'ok') {
            message.success('更新成功！')
            history.push('/user')
          }
        } else {
          // 添加页面
          const result = await api.addArticle(title, subTitle, content, tags, banner)
          if (result.stat === 'ok') {
            message.success('发布成功！')
            history.push('/user')
          }
        }
      })
      .catch((e) => console.log(e));
  };
  //编辑区图片渲染
  const getImg = async (files: any) => {
    const result = await api.upload(files);
    return result.data //返回 key
  };

  // 返回首页
  const backToHome = () => {
    history.push("/");
  };

  return (
    <>
      <Layout>
        <Header>
          <Form
            className={style.form}
            layout={"inline"}
            form={form}
            initialValues={{ title: "" }}
          >
            <Row className={style.form} wrap={false}>
              <Col flex={1}>
                <Form.Item name="title" label="">
                  <Input
                    spellCheck="false"
                    maxLength={56}
                    placeholder={"请输入文章标题..."}
                    className={style.input}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Row className={style.btns}>
                  <Form.Item className={style.search_item}>
                    <Button type={"primary"} onClick={handleSubmit}>
                      {articleId ? '更新' : '发布'}
                    </Button>
                  </Form.Item>

                  <Form.Item>
                    <Button type={"primary"} onClick={backToHome}>
                      回到首页
                    </Button>
                  </Form.Item>
                </Row>
              </Col>
            </Row>
          </Form>
        </Header>
        <Content >
          <div style={{ height: "100%" }} className="markdown-body">
            <Editor
              locale={zhHans}
              value={value}
              plugins={plugins}
              onChange={(v) => {
                setValue(v);
              }}
              // 支持上传图片
              uploadImages={async (files) => {
                const key: string = await getImg(files);
                return [
                  {
                    url: `/api/file/preview/${key}`
                  },
                ];
              }}
            />
          </div>
        </Content>
      </Layout>

      <Modal
        style={{ left: 50 }}
        title={articleId ? "更新文章" : "发布文章"}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="取消"
        okText="确定"
      >
        <Form
          {...formItemLayout}
          className={style.modal_form}
          form={ModalForm}
          scrollToFirstError
        >
          <Form.Item
            className={style.item}
            name="subTitle"
            label="副标题"
            rules={[
              {
                required: true,
                message: '请输入副标题',
              },
              {
                max: 20,
                message: '最多20个字符',
              }]}
            tooltip="添加副标题有助于文章被更多人看到"
          >
            <Input />
          </Form.Item>

          <Form.Item
            className={style.item}
            label="标签"
            tooltip="最多3个标签"
          >
            {/* 编辑标签 */}
            {tags.map((tag, index) => {
              if (editInputIndex === index) {
                return (
                  <Input
                    ref={editInputRef}
                    key={tag}
                    maxLength={10}
                    size="small"
                    className={style.tag_input}
                    value={editInputValue}
                    onChange={handleEditInputChange}
                    onBlur={handleEditInputConfirm}
                    onPressEnter={handleEditInputConfirm}
                  />
                );
              }
              const isLongTag = tag.length > 5;
              {/* 展示标签 */ }
              const tagElem = (
                <Tag
                  className={style.edit_tag}
                  key={tag}
                  closable
                  onClose={() => handleClose(tag)}
                >
                  <span
                    onDoubleClick={(e) => doubleClick(e, index, tag)}
                  >
                    {isLongTag ? `${tag.slice(0, 5)}...` : tag}
                  </span>
                </Tag>
              );
              return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              );
            })}

            {/* 新增标签 */}
            {inputVisible && (
              <Input
                ref={inputRef}
                type="text"
                size="small"
                className={style.tag_input}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                maxLength={10}
              />
            )}
            {/* 新增标签 */}
            {!inputVisible && tags.length < 3 && (
              <Tag className={style.site_tag_plus} onClick={showInput}>
                <PlusOutlined /> 新增标签
              </Tag>
            )}
          </Form.Item>

          {<Form.Item
            className={style.item}
            name="picture"
            label="文章封面"
            getValueFromEvent={normFile}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="/api/file/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {/* 编辑展示图片，添加展示默认图标 */}
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
            <Button type="text" onClick={() => { setImageUrl(''); setKey('') }} >重置</Button>
          </Form.Item>}
        </Form>
      </Modal>
    </>
  );
}
