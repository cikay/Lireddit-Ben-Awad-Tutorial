import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'urql'
import ChangePassword from './auth/ChangePassword'
import ForgotPassword from './auth/ForgotPassword'
import Login from './auth/Login'
import Register from './auth/Register'
import Home from './home'
import Layout from './shared/components/Layout'
import client from './utils/createUrqlClient'
import CreatePost from './home/PostForm'
import PostCard from './shared/components/PostCard/PostCard'
import SinglePost from './post/SinglePost'
function App() {
  return (
    <Provider value={client}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Layout>
              <Home />
            </Layout>
          </Route>
          <Route exact path='/register'>
            <Register />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/forgot-password'>
            <ForgotPassword />
          </Route>
          <Route exact path='/create-post'>
            <CreatePost />
          </Route>
          <Route exact path='/post/edit/:postId'>
            <CreatePost />
          </Route>
          <Route exact path='/post/:postId'>
            <SinglePost />
          </Route>
          <Route exact path='/change-password/:token'>
            <ChangePassword />
          </Route>
          <Route path='*'>bulunumadı</Route>
        </Switch>
      </Router>
    </Provider>
  )
}

export default App
