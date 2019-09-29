import React from 'react'
import { Route,Switch } from 'react-router-dom'
import Home from "../containers/Home"
import SourcesUploadList from "../containers/SourcesUploadList"
import SourcesRssList from "../containers/SourcesRSSList"
import SourcesUploadEdit from "../containers/SourcesUploadEdit"
import About from "./About"
import Logout from "./Logout"
import Password from "../containers/Password"

const Main = (props)=>(
  <Switch>
    <Route exact path="/" component={Home} />

    <Route exact path="/sources_upload" component={SourcesUploadList} />
    <Route exact path="/sources_upload_edit/:id" 
      render={({match})=><SourcesUploadEdit 
      state={ {
        firstrender:true,
        stateLoaded:false,
        object:{
          id:undefined,
          name:undefined,
          active:undefined
        }
      }}
    match={match}/>} />

    <Route exact path="/sources_rss" component={SourcesRssList} />
    <Route exact path="/sources_rss/:id" component={SourcesRssList} />


    <Route exact path="/about" component={About}/>
    <Route exact path="/logout" component={Logout}/>
    <Route exact path="/password" component={Password}/>
  </Switch>
  
)

export default Main 

