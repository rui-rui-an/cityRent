
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import Home from './pages/Home'
import CityList from './pages/CityList'


function App () {
  return (
    <Router>
      <div className="App">
        <Route exact path='/' render={()=> <Redirect to={'/home'}></Redirect>}></Route>
        <Route path='/home' component={Home}></Route>
        <Route path='/citylist' component={CityList}></Route>
      </div>
    </Router>
  );
}

export default App;
