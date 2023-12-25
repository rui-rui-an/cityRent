import { Component } from "react"
import NavHeader from "../../components/NavHeader"
import styles from "./index.module.css"

export default class Favorate extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader className={styles.navHeader}>我的收藏</NavHeader>

        {/* 收藏的内容 */}
        <div className={styles.nodata}>暂无收藏</div>
      </div>
    )
  }
}
