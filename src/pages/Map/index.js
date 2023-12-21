import React from "react"
// import './index.scss'
import styles from "./index.module.css"
import NavHeader from "../../components/NavHeader"
import axios from "axios"
const BMapGL = window.BMapGL

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
  initMap() {
    const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"))
    const map = new BMapGL.Map("container")
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

          const res = await axios.get(
            `http://localhost:8080/area/map?id=${value}`
          )
          console.log(res)
          const data = res.data.body

          data.forEach(
            ({ coord: { latitude, longitude }, count, label: name, value }) => {
              const areaPoint = new BMapGL.Point(longitude, latitude)
              // 获取自定义文本
              var opts = {
                position: areaPoint, // 指定文本标注所在的地理位置
                offset: new BMapGL.Size(-35, -35), // 设置文本偏移量
              }
              // 创建文本标注对象
              var mylabel = new BMapGL.Label("", opts)

              mylabel.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">${name}</p>
              <p>${count}套</p>
            </div>`)
              // 自定义文本标注样式
              mylabel.setStyle(labelStyle)
              map.addOverlay(mylabel)
            }
          )
        } else {
          alert("您选择的地址没有解析到结果！")
        }
      },
      label
    )
  }
  componentDidMount() {
    this.initMap()
  }
  render() {
    return (
      <div className={styles.map}>
        {/* <div className="test">35465456qweqwe</div> */}
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
      </div>
    )
  }
}
