import {ProtectedRoute, Switch, Redirect} from 'react-router-dom'
import {Component} from 'react'

import Login from './components/login'
import Home from './components/Home'
import Trending from './components/Trending'
import Gaming from './components/Gaming'
import SavedVideos from './components/SavedVideos'
import NotFound from './components/NotFound'
import VideoItemDetails from './components/VideoItemDetails'
import ProtectedRoute from './components/ProtectedRoute'

import ActiveMenuContext from './Context/ActiveMenuContext'
import ThemeContext from './Context/ThemeContext'
import SavedVideosContext from './Context/SavedVideosContext'

import './App.css'

const activeMenuConstants = {
  initial: 'INITIAL',
  home: 'HOME',
  trending: 'TRENDING',
  gaming: 'GAMING',
  savedVideos: 'SAVED_VIDEOS',
}

// Replace your code here
class App extends Component {
  state = {
    isDarkTheme: false,
    activeMenu: activeMenuConstants.home,
    savedVideosList: [],
    save: false,
  }

  addVideosToSavedVideos = videoDetails => {
    this.setState(prev => ({
      savedVideosList: [...prev.savedVideosList, videoDetails],
    }))
  }

  deleteVideosFromSavedVideos = videoDetails => {
    const {savedVideosList} = this.state
    const updatedList = savedVideosList.filter(
      each => each.id !== videoDetails.id,
    )
    this.setState({savedVideosList: updatedList})
  }

  updateSaveVideosList = videoDetails => {
    const {save} = this.state
    if (save) {
      this.deleteVideosFromSavedVideos(videoDetails)
    } else {
      this.addVideosToSavedVideos(videoDetails)
    }
  }

  updateSave = videoDetails => {
    this.setState(
      prev => ({save: !prev.save}),
      this.updateSaveVideosList(videoDetails),
    )
  }

  changeTheme = () => {
    this.setState(prev => ({isDarkTheme: !prev.isDarkTheme}))
  }

  changeActiveMenu = value => {
    this.setState({activeMenu: value})
  }

  render() {
    const {isDarkTheme, activeMenu, save, savedVideosList} = this.state

    return (
      <ThemeContext.Provider
        value={{isDarkTheme, changeTheme: this.changeTheme}}
      >
        <SavedVideosContext.Provider
          value={{
            save,
            savedVideosList,
            addVideosToSavedVideos: this.addVideosToSavedVideos,
            deleteVideosFromSavedVideos: this.deleteVideosFromSavedVideos,
            updateSave: this.updateSave,
          }}
        >
          <ActiveMenuContext.Provider
            value={{activeMenu, changeActiveMenu: this.changeActiveMenu}}
          >
            <Switch>
              <ProtectedRoute exact path="/login" component={Login} />
              <ProtectedRoute Route exact path="/" component={Home} />
              <ProtectedRoute exact path="/trending" component={Trending} />
              <ProtectedRoute e exact path="/gaming" component={Gaming} />
              <ProtectedRoute
                exact
                path="/saved-videos"
                component={SavedVideos}
              />
              <ProtectedRoute
                e
                exact
                path="/videos/:id"
                component={VideoItemDetails}
              />
              <ProtectedRoute exact path="/not-found" component={NotFound} />
              <Redirect to="/not-found" />
            </Switch>
          </ActiveMenuContext.Provider>
        </SavedVideosContext.Provider>
      </ThemeContext.Provider>
    )
  }
}

export default App
