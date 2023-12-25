import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom"
import Home from "./pages/Home"
// import CityList from "./pages/CityList"
// import Map from "./pages/Map"
// // // 登录
// import Login from "./pages/Login"
// import Registe from "./pages/Registe"
// // // 房源详情组件
// import HouseDetail from "./pages/HouseDetail"
// // // 房源详情组件
// import Favorate from "./pages/Favorate"
// // // 房源详情组件
import AuthRoute from "./components/AuthRoute"
// // // 房源发布
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import RentSearch from './pages/Rent/Search'
// 使用动态组件的方式导入组件：
const CityList = lazy(() => import("./pages/CityList"))
const Map = lazy(() => import("./pages/Map"))
const HouseDetail = lazy(() => import("./pages/HouseDetail"))
const Login = lazy(() => import("./pages/Login"))
const Registe = lazy(() => import("./pages/Registe"))
const Favorate = lazy(() => import("./pages/Favorate"))
const Rent = lazy(() => import("./pages/Rent"))
const RentAdd = lazy(() => import("./pages/Rent/Add"))
const RentSearch = lazy(() => import("./pages/Rent/Search"))

function App() {
  return (
    <Suspense fallback={<div className="route-loading">loading...</div>}>
      <Router>
        <div className="App">
          <Route
            exact
            path="/"
            render={() => <Redirect to={"/home"}></Redirect>}
          ></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/citylist" component={CityList}></Route>
          <AuthRoute path="/map" component={Map}></AuthRoute>
          {/* 房源详情的路由规则： */}
          <Route path="/detail/:id" component={HouseDetail} />
          <Route path="/login" component={Login} />
          <Route path="/registe" component={Registe} />
          <Route path="/favorate" component={Favorate} />
          {/* 配置登录后，才能访问的页面 */}
          <AuthRoute exact path="/rent" component={Rent} />
          <AuthRoute path="/rent/add" component={RentAdd} />
          <AuthRoute path="/rent/search" component={RentSearch} />
        </div>
      </Router>
    </Suspense>
  )
}

export default App
