import React from "react"
import axios from "axios"
import { Toast} from "antd-mobile-v2"
import NavHeader from '../../components/NavHeader'
// 导入 utils 中获取当前定位城市的方法
import { getCurrentCity,BASE_URL } from "../../utils"
import { List, AutoSizer } from "react-virtualized"
import "./index.scss"
// import styles from './index.module.css'

// List data as an array of strings
// const list = Array(100).fill("react-virtualized")

// function rowRenderer({
//   key, // Unique key within array of rows
//   index, // Index of row within collection
//   isScrolling, // The List is currently being scrolled
//   isVisible, // This row is visible within the List (eg it is not an overscanned row)
//   style, // Style object to be applied to row (to position it)
// }) {
//   return (
//     <div key={key} style={style}>
//       {list[index]}
//     </div>
//   )
// }
// list: [{}, {}]
const formatCityData = (list) => {
  const cityList = {}
  // const cityIndex = []

  // 1 遍历list数组
  list.forEach((item) => {
    // 2 获取每一个城市的首字母
    const first = item.short.substr(0, 1)
    // 3 判断 cityList 中是否有该分类
    if (cityList[first]) {
      // 4 如果有，直接往该分类中push数据
      // cityList[first] => [{}, {}]
      cityList[first].push(item)
    } else {
      // 5 如果没有，就先创建一个数组，然后，把当前城市信息添加到数组中
      cityList[first] = [item]
    }
  })

  // 获取索引数据
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex,
  }
}

// 封装处理字母索引的方法
const formatCityIndex = (letter) => {
  switch (letter) {
    case "#":
      return "当前定位"
    case "hot":
      return "热门城市"
    default:
      return letter.toUpperCase()
  }
}
// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    }
    // 创建ref对象
    this.cityListComponent = React.createRef()
  }

  async componentDidMount() {
    await this.getCityList()

    // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
    this.cityListComponent.current.measureAllRows()
  }
  async getCityList() {
    const res = await axios.get(`${BASE_URL}/area/city?level=1`)
    const { cityList, cityIndex } = formatCityData(res.data.body)

    // 获取热门城市数据
    // const hotRes = await axios.get(`localhost:8080/area/hot`)
    const hotRes = await axios.get(`${BASE_URL}/area/hot`)
    cityList["hot"] = hotRes.data.body
    cityIndex.unshift("hot")

    // 获取当前定位城市
    const curCity = await getCurrentCity()
    cityList["#"] = [curCity]
    cityIndex.unshift("#")

    this.setState({
      cityList,
      cityIndex,
    })
  }

  changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) > -1) {
      // 有
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源数据', 1, null, false)
    }
  }

  // 渲染选择城市组件
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { cityList, cityIndex } = this.state
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {/* <div className="name">深圳</div> */}
        {cityList[letter].map((item) => {
          return (
            <div key={item.value} className="name"   onClick={() => this.changeCity(item)}>
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }

  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    // 索引标题高度 + 城市数量 * 城市名称的高度
    return TITLE_HEIGHT + NAME_HEIGHT * cityList[cityIndex[index]].length
  }

  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    // 获取到 cityIndex，并遍历其，实现渲染
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          // console.log('当前索引号：', index)
          this.cityListComponent.current.scrollToRow(index)
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {item === "hot" ? "热" : item.toUpperCase()}
        </span>
      </li>
    ))
  }

  // 用于获取List组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    if (this.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      })
    }
  }
  render() {
    return (
      <div className="citylist">
        {/* <div className={styles.test}>35465456王企鹅qweqwe</div> */}
        {/* <NavBar
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar> */}
      <NavHeader>城市选择</NavHeader>
        {/* 选择列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        {/* 右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }
}
