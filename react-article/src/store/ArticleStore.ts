import { createContext } from 'react'
import { makeAutoObservable, observable, action} from 'mobx'
import { getVal, setVal, delVal } from './storage'
class ArticleStore {
  constructor() {
    makeAutoObservable(this)
  }

  @observable searchKey = getVal("search", '');  //搜索关键字

  @action setSearchKey(val: string) {
    setVal("searchKey", val)
    this.searchKey = val;
  }
  @action delSearch() {
    delVal("searchKey")
  }

}

export default createContext(new ArticleStore())


