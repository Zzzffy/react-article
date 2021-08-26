import { createContext } from 'react'
import { makeAutoObservable, observable, action } from 'mobx'
import { IUser, IPerson } from '../types'
import { getVal, setVal, delVal } from './storage'

class UserStore {
  constructor() {
    makeAutoObservable(this)
  }
  @observable login: IPerson = getVal("login", ''); //登录信息
  @observable user: IUser = getVal("user", ''); //用户信息
  
  setUser(user: IUser) {
    this.user = user
  }
  @action loginInfo(val: IPerson) {
    setVal("login", val)
    this.login = val;
  }
  @action delLoginInfo() {
    delVal("login")
  }
  @action delUserInfo() {
    delVal("user")
  }
  @action userInfo(val: IUser) {
    setVal("user", val)
    this.user = val
  }
  @action setAvatar(val: string) {
    this.user.avatar = val
    setVal("user", this.user)
  }

}

export default createContext(new UserStore())


