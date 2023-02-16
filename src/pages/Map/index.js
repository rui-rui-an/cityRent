import React from "react"
import './index.scss'
export default class Map extends React.Component {
  initMap() {
    var map = new window.BMapGL.Map("container")
    var point = new window.BMapGL.Point(116.404, 39.915)
    map.centerAndZoom(point, 15)
  }
  componentDidMount() {
    this.initMap()
  }
  render() {
    return (
      <div className="map">
        <div id="container"></div>
      </div>
    )
  }
}
