const axios = require('axios').default
const describe = require('mocha').describe
const it = require('mocha').it
const { expect } = require('chai')
const crypto = require('crypto')

const { host } = require('./util')

let token = ''
const name = crypto.randomBytes(16).toString('hex')

describe('user api', () => {
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
  it('get userInfo', async () => {
    const res = await axios.get(`${host}/api/user/userInfo`, {
      headers: {
        Cookie: `token=${token}`,
      },
    })
    expect(res.data.stat).eq('ok')
  })
  it('update userInfo pwd', async () => {
    const res = await axios.put(
      `${host}/api/user/updatePwd`,
      {
        oldPwd: '123qwe',
        newPwd: '123qwe123qwe',
      },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    )
    expect(res.data.stat).eq('ok')
  })
  it('get userInfo error', async () => {
    const res = await axios.get(`${host}/api/user/userInfo`, {
      headers: {
        Cookie: `token=${token}`,
      },
    })
    expect(res.data.stat).eq('Err_Token_Not_Found')
  })
  it('login', async () => {
    const res = await axios.post(`${host}/api/auth/login`, {
      account: name,
      pwd: '123qwe123qwe',
    })
    token = res.data.data.token
    expect(res.data.stat).eq('ok')
  })
  it('update userInfo', async () => {
    const res = await axios.put(
      `${host}/api/user/updateUserInfo`,
      {
        avatar: '123qwe',
        nickname: '123qwe123qwe',
      },
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    )
    expect(res.data.stat).eq('ok')
  })
  it('get userInfo avatar', async () => {
    const res = await axios.get(`${host}/api/user/userInfo`, {
      headers: {
        Cookie: `token=${token}`,
      },
    })
    expect(res.data.data.avatar).eq('123qwe')
  })
  it('get userInfo nickname', async () => {
    const res = await axios.get(`${host}/api/user/userInfo`, {
      headers: {
        Cookie: `token=${token}`,
      },
    })
    expect(res.data.data.nickname).eq('123qwe123qwe')
  })
})
