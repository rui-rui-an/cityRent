import React from "react"
import "./index.scss"
import styles from "./index.module.css"
import NavHeader from "../../components/NavHeader"
import { Link } from "react-router-dom"
// import axios from "axios"
import { API } from "../../utils/api"
import { Toast } from "antd-mobile-v2"
import { BASE_URL } from "../../utils/url"
// 导入 HouseItem 组件
import HouseItem from '../../components/HouseItem'
const BMapGL = window.BMapGL
// 导入BASE_URL

// 覆盖物样式
const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center",
}

export default class Map extends React.Component {
  state = {
    // 小区下的房源列表
    housesList: [],
    // 表示是否展示房源列表
    isShowList: false,
  }

  initMap() {
    const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"))
    const map = new BMapGL.Map("container")
    this.map = map
    //创建地址解析器实例
    const myGeo = new BMapGL.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          map.centerAndZoom(point, 11)
          const scaleCtrl = new BMapGL.ScaleControl() // 添加比例尺控件
          map.addControl(scaleCtrl)
          const zoomCtrl = new BMapGL.ZoomControl() // 添加缩放控件
          map.addControl(zoomCtrl)

          // const res = await axios.get(
          //   `http://localhost:8080/area/map?id=${value}`
          // )
          // console.log(res)
          // const data = res.data.body

          // data.forEach(
          //   ({ coord: { latitude, longitude }, count, label: name, value }) => {
          //     const areaPoint = new BMapGL.Point(longitude, latitude)
          //     // 获取自定义文本
          //     var opts = {
          //       position: areaPoint, // 指定文本标注所在的地理位置
          //       offset: new BMapGL.Size(-35, -35), // 设置文本偏移量
          //     }
          //     // 创建文本标注对象
          //     var mylabel = new BMapGL.Label("", opts)
          //     mylabel.id = value
          //     mylabel.setContent(`
          //   <div class="${styles.bubble}">
          //     <p class="${styles.name}">${name}</p>
          //     <p>${count}套</p>
          //   </div>`)
          //     // 自定义文本标注样式
          //     mylabel.setStyle(labelStyle)

          //     mylabel.addEventListener("click", () => {
          //       console.log("覆盖物被点击了", mylabel.id)
          //       map.centerAndZoom(areaPoint, 13)
          //       map.clearOverlays()
          //     })

          //     map.addOverlay(mylabel)
          //   }
          // )

          this.renderOverlays(value)
        } else {
          alert("您选择的地址没有解析到结果！")
        }
      },
      label
    )
    // 给地图绑定移动事件
    map.addEventListener('movestart', () => {
      // console.log('movestart')
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }
  componentDidMount() {
    this.initMap()
  }

  // async renderOverlays(id) {
  //   const res = await API.get(`http://localhost:8080/area/map?id=${id}`)
  //   // console.log(res)
  //   const data = res.data.body
  //   const { nextZoom, type } = this.getTypeAndZoom()
  //   data.forEach((item) => {
  //     // 创建覆盖物
  //     this.createOverlays(item, nextZoom, type)
  //   })
  // }
   // 渲染覆盖物入口
  // 1 接收区域 id 参数，获取该区域下的房源数据
  // 2 获取房源类型以及下级地图缩放级别
  async renderOverlays(id) {
    try {
      // 开启loading
      Toast.loading('加载中...', 0, null, false)

      const res = await API.get(`/area/map?id=${id}`)
      // 关闭 loading
      Toast.hide()

      const data = res.data.body

      // 调用 getTypeAndZoom 方法获取级别和类型
      const { nextZoom, type } = this.getTypeAndZoom()

      data.forEach(item => {
        // 创建覆盖物
        this.createOverlays(item, nextZoom, type)
      })
    } catch (e) {
      // 关闭 loading
      Toast.hide()
    }
  }

  // 创建覆盖物
  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value,
    } = data

    // 创建坐标对象
    const areaPoint = new BMapGL.Point(longitude, latitude)

    if (type === "circle") {
      // 区或镇
      this.createCircle(areaPoint, areaName, count, value, zoom)
    } else {
      // 小区
      this.createRect(areaPoint, areaName, count, value)
    }
  }
  // 创建区、镇覆盖物
  createCircle(point, name, count, id, zoom) {
    // 创建覆盖物
    const label = new BMapGL.Label("", {
      position: point,
      offset: new BMapGL.Size(-35, -35),
    })

    // 给 label 对象添加一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
    `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener("click", () => {
      // 调用 renderOverlays 方法，获取该区域下的房源数据
      this.renderOverlays(id)

      // 放大地图，以当前点击的覆盖物为中心放大地图
      this.map.centerAndZoom(point, zoom)

      // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
      setTimeout(() => {
        // 清除当前覆盖物信息
        this.map.clearOverlays()
      }, 0)
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label)
  }

  // 创建小区覆盖物
  createRect(point, name, count, id) {
    // 创建覆盖物
    const label = new BMapGL.Label("", {
      position: point,
      offset: new BMapGL.Size(-50, -28),
    })

    // 给 label 对象添加一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener("click", (e) => {
      // 获取并渲染房源数据
      this.getHousesList(id)
      console.log(e)
      // 获取当前被点击项
      const target = e.domEvent.changedTouches[0]
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      )
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label)
  }
  // 计算要绘制的覆盖物类型和下一个缩放级别
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
  getTypeAndZoom() {
    // 调用地图的 getZoom() 方法，来获取当前缩放级别
    const zoom = this.map.getZoom()
    let nextZoom, type

    // console.log('当前地图缩放级别：', zoom)
    if (zoom >= 10 && zoom < 12) {
      // 区
      // 下一个缩放级别
      nextZoom = 13
      // circle 表示绘制圆形覆盖物（区、镇）
      type = "circle"
    } else if (zoom >= 12 && zoom < 14) {
      // 镇
      nextZoom = 15
      type = "circle"
    } else if (zoom >= 14 && zoom < 16) {
      // 小区
      type = "rect"
    }

    return {
      nextZoom,
      type,
    }
  }
  // 获取小区房源数据
  async getHousesList(id) {
    try {
      // 开启loading
      Toast.loading("加载中...", 0, null, false)

      const res = await API.get(`/houses?cityId=${id}`)
      console.log(res);
      // 关闭 loading
      Toast.hide()

      this.setState({
        housesList: res.data.body.list,
        // 展示房源列表
        isShowList: true,
      })
    } catch (e) {
      // 关闭 loading
      Toast.hide()
    }
  }
  // 封装渲染房屋列表的方法
  renderHousesList() {
    return this.state.housesList.map(item => (
      <HouseItem
        onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
        key={item.houseCode}
        src={BASE_URL + item.houseImg}
        title={item.title}
        desc={item.desc}
        tags={item.tags}
        price={item.price}
      />
    ))

    // return this.state.housesList.map((item) => (
    //   <div className={styles.house} key={item.houseCode}>
    //     <div className={styles.imgWrap}>
    //       <img className={styles.img} src={BASE_URL + item.houseImg} alt="" />
    //     </div>
    //     <div className={styles.content}>
    //       <h3 className={styles.title}>{item.title}</h3>
    //       <div className={styles.desc}>{item.desc}</div>
    //       <div>
    //         {/* ['近地铁', '随时看房'] */}
    //         {item.tags.map((tag, index) => {
    //           const tagClass = "tag" + (index + 1)
    //           return (
    //             <span
    //               className={[styles.tag, styles[tagClass]].join(" ")}
    //               key={tag}
    //             >
    //               {tag}
    //             </span>
    //           )
    //         })}
    //       </div>
    //       <div className={styles.price}>
    //         <span className={styles.priceNum}>{item.price}</span> 元/月
    //       </div>
    //     </div>
    //   </div>
    // ))
  }
  render() {
    return (
      <div className={styles.map}>
        {/* <div className="test">35465456qweqwe</div> */}
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
        {/* 房源列表 */}
        {/* 添加 styles.show 展示房屋列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : "",
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    )
  }
}
