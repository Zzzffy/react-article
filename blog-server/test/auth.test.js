const axios = require('axios').default
const describe = require('mocha').describe
const it = require('mocha').it
const { expect } = require('chai')
const crypto = require('crypto')

const { host } = require('./util')

let token = ''
const name = crypto.randomBytes(16).toString('hex')

describe('auth api', () => {
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
  it('logout', async () => {
    const res = await axios.post(
      `${host}/api/auth/logout`,
      {},
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    )
    expect(res.data.stat).eq('ok')
  })
})
