import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom'
import { List, Pagination } from 'antd';

import { observer } from 'mobx-react-lite'
import ArticleStore from "../../store/ArticleStore";
import * as api from '../../services/api'
import { IArticle } from "../../types";
import ArticleItem from "./ArticleItem";
import style from './style.module.less'

export default observer(function Article() {
  const location = useLocation()
  const article = useContext(ArticleStore)
  const [dataList, setDataList] = useState<IArticle[]>([])
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(4)
  const [total, setTotal] = useState<number>(0)

  // 获取文章数据
  useEffect(() => {
    getData(pageIndex, pageSize, article.searchKey)
  }, [pageIndex, pageSize, article.searchKey])

  // 根据不同路径渲染列表
  const getData = async (pageIndex: number, pageSize: number, keyword: string) => {
    let result
    // 获取当前用户所有文章
    if (location.pathname === '/user') {
      result = await api.getUserArticles(pageIndex, pageSize, keyword)
      // 如果不在第一页搜索，需要进行判断，得到的结果回到第一页展示
      if ((pageIndex - 1) * pageSize >= result.data?.total) {
        setPageIndex(1)
      }
    }
    // 获取所有用户文章
    else if (location.pathname === '/') {
      result = await api.getAllArticles(pageIndex, pageSize, keyword)
      if ((pageIndex - 1) * pageSize >= result.data.total) {
        setPageIndex(1)
      }
    } else {
      // 按浏览量排序
      result = await api.getAllArticles(pageIndex, pageSize, keyword, 'preview')
      if ((pageIndex - 1) * pageSize >= result.data.total) {
        setPageIndex(1)
      }
    }
    if (result.stat === 'ok') {
      setTotal(result.data.total)
      setDataList(result.data.items)
    }
  }

  // 页码或每页条数改变后回调
  const handleChange = (page: number, pageSize: any) => {
    setPageIndex(page)
    setPageSize(pageSize)
  }

  // 子组件传过来的删除文章事件
  const delArticle = () => {
    getData(pageIndex, pageSize, '')
  }

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={dataList}
        renderItem={item => (
          <ArticleItem article={item} delArticle={delArticle} key={item._id} />
        )}
      />
      <Pagination
        showTotal={total => `共 ${total} 条数据`}
        showSizeChanger
        onChange={handleChange}
        current={pageIndex}
        total={total}
        defaultPageSize={pageSize}
        pageSizeOptions={['4', '8', '10', '15']}
        className={style.pagination}
      />
    </>
  )
})
