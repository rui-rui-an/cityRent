import React from "react"
import { Route } from "react-router-dom"
import News from "../News"
import Index from "../Index"
import FindHouse from "../FindHouse"
import My from "../My"
import "./home.scss"
import { TabBar } from "antd-mobile-v2"

const tabItems = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home",
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/list",
  },
  {
    title: "咨询",
    icon: "icon-infom",
    path: "/home/news",
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/profile",
  },
]

export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
    console.log(prevProps)
    console.log(this.props)
  }
  componentDidMount() {
    // console.log(window.location.pathname);
  }
  renderTabBarItems() {
    return tabItems.map((item) => {
      return (
        <TabBar.Item
          title={item.title}
          key={item.title}
          icon={<i className={`iconfont ${item.icon}`}></i>}
          selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.setState({
              selectedTab: item.path,
            })
            this.props.history.push(item.path)
          }}
          data-seed="logId"
        ></TabBar.Item>
      )
    })
  }
  render() {
    return (
      <div className="home">
        <Route path="/home" exact component={Index}></Route>
        <Route path="/home/list" component={FindHouse}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={My}></Route>
        <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent>
          {this.renderTabBarItems()}
        </TabBar>
      </div>
    )
  }
}
