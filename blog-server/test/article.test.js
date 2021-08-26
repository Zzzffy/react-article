const axios = require('axios').default
const describe = require('mocha').describe
const it = require('mocha').it
const { expect } = require('chai')
const crypto = require('crypto')
const { host } = require('./util')

let token = ''
const name = crypto.randomBytes(16).toString('hex')
let articleId = ''

describe('article api', () => {
  it('registry', async () => {
    const res = await axios.post(`${host}/api/auth/registry`, {
      account: name,
      pwd: '123qwe',
    })
    expect(res.data.stat).eq('ok')
  })
  it('login', async () => {
    const res = await axios.post(`${host}/api/auth/login`, {
      account: name,
      pwd: '123qwe',
    })
    token = res.data.data.token
    expect(res.data.stat).eq('ok')
  })
  it('add article', async () => {
    const res = await axios.post(
      `${host}/api/article/add`,
      {
        content: 'string',
        title: 'string',
        subTitle: 'string',
        tags: ['asd', 'asdf'],
        banner: [],
      },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    )
    articleId = res.data.data
    expect(res.data.stat).eq('ok')
  })
  it('add article', async () => {
    const res = await axios.post(
      `${host}/api/article/add`,
      {
        content: 'strasfing',
        title: 'string',
        subTitle: 'string',
        tags: ['asd', 'asdf'],
        banner: [],
      },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    )
    expect(res.data.stat).eq('ok')
  })
  it('set article', async () => {
    const res = await axios.put(
      `${host}/api/article/${articleId}`,
      {
        content: 'asdf',
        title: 'striaasdfsdfng',
        subTitle: 'staasdfsdfring',
        tags: ['aasdfsd', 'asasdfdf'],
        banner: ['asdf'],
      },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    )
    expect(res.data.stat).eq('ok')
  })
  it('get article', async () => {
    const res = await axios.get(`${host}/api/article/${articleId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    })
    expect(res.data.stat).eq('ok')
  })
  it('search all article', async () => {
    const res = await axios.post(
      `${host}/api/article/searchall`,
      {
        pageIndex: 1,
        pageSize: 10,
        keyword: '',
      },
      // {
      //   headers: {
      //     Cookie: `token=${token}`,
      //   },
      // },
    )
    expect(res.data.stat).eq('ok')
  })
  it('search owner article', async () => {
    const res = await axios.post(
      `${host}/api/article/searchowner`,
      {
        pageIndex: 1,
        pageSize: 10,
        keyword: '',
      },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    )
    expect(res.data.data.total).eq(2)
  })
  it('delete article', async () => {
    const res = await axios.delete(`${host}/api/article/${articleId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    })
    expect(res.data.stat).eq('ok')
  })
  it('search owner article', async () => {
    const res = await axios.post(
      `${host}/api/article/searchowner`,
      {
        pageIndex: 1,
        pageSize: 10,
        keyword: '',
      },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    )
    expect(res.data.data.total).eq(1)
  })
})
