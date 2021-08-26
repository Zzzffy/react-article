import Stat from '../stat'
const __stat = new Map<string, string>()
export interface Stat {
  [key: string]: string
}
export class Exception {
  stat: string
  msg: string
  constructor(stat: string, msg: string) {
    this.stat = stat
    this.msg = msg
  }

  static updates(stats: Stat) {
    for (let key in stats) {
      __stat.set(key, stats[key])
    }
  }

  static get(stat: string) {
    return __stat.get(stat)
  }

  static set(key: string, stat: string) {
    __stat.set(key, stat)
  }
}
Exception.updates(Stat)
Exception.set('Internel_Server_Error', '服务端异常')
