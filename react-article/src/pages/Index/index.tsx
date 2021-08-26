import { useRef } from "react";
import { NavLink, Route } from "react-router-dom";
import { observer } from "mobx-react-lite";

import Nav from "../../components/Nav/index"
import Article from "../../components/Article"
import BackToTop from "../../components/BackToTop"
import style from './style.module.less'

export default observer(function Index() {
  const container = useRef<HTMLDivElement>(null)

  return (
    <div className={style.page}>
      {/* 顶部导航栏 */}
      <Nav />
        <div className={style.content} ref={container} >
          {/* 最新最热 */}
          <nav className={style.nav}>
            <ul className={style.nav_list}>
              <li className={style.nav_item} key="0">
                <NavLink to="/" exact>最新</NavLink>
              </li>
              <div className={style.line}></div>
              <li className={style.nav_item} key="1">
                <NavLink to="/sort/hottest">最热</NavLink>
              </li>
            </ul>
          </nav>
          {/* 文章列表 */}
          <Route exact path="/" component={Article} />
          <Route exact path="/sort/hottest" component={Article} />
        </div>
      <BackToTop />
    </div>
  )
})