import React from 'react'
import { Carousel, WingBlank, Flex } from 'antd-mobile-v2';
import axios from 'axios'
import './index.css'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/home/findHouse'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/home/rent'
  }
]
export default class Index extends React.Component {
  state = {
    swipers: ['1', '2', '3']
  }
  async getSwipers () {
    const res = await axios.get('http://localhost:8080/home/swiper')
    //  console.log(res);
    this.setState({
      swipers: res.data.body
    })
  }
  renderNavs () {
    return navs.map((item) =>
      <Flex.Item key={item.id} onClick={()=> this.props.history.push(item.path)}>
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    )
  }
  componentDidMount () {
    this.getSwipers()
  }
  render () {
    return (
      <div className='index'>
        {/* 轮播图 */}
        <WingBlank>
          <Carousel
            autoplay={true}
            infinite
          >
            {this.state.swipers.map(val => (
              <a
                key={val.id}
                href="http://www.baidu.com"
                style={{ display: 'inline-block', width: '100%', height: 212 }}
              >
                <img
                  src={`http://localhost:8080${val.imgSrc}`}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                />
              </a>
            ))}
          </Carousel>
        </WingBlank>
        {/* 导航菜单 */}
        <Flex className='nav'>
          {this.renderNavs()}
          {/* <Flex.Item>
            <img src={Nav1} alt="" />
            <h2>整租</h2>
          </Flex.Item> */}
        </Flex>
      </div>
    )
  }
}