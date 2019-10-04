import React from 'react'
import { Route,Switch } from 'react-router-dom'
import Home from "../containers/Home"
import SourcesJobList from "../containers/SourcesJobList"
import SourcesUploadList from "../containers/SourcesUploadList"
import SourcesUploadEdit from "../containers/SourcesUploadEdit"
import SourcesRssList from "../containers/SourcesRSSList"
import SourcesRSSEdit from "../containers/SourcesRSSEdit"
import About from "./About"
import Logout from "./Logout"
import Password from "../containers/Password"
import Edit from './SourceEditFormComp'
import EditRSS from './SourceEditRSSFormComp'
export const ADDFORM = "ADD"
export const EDITFORM = "EDIT"
const Main = (props)=>(
  <Switch>
    <Route exact path="/" component={Home} />

    <Route exact path="/sources_upload" component={SourcesUploadList} />
    <Route exact path="/sources_upload_add" 
      render={()=>
      <SourcesUploadEdit 
        form={<Edit/>}
        state={ {
          action:ADDFORM,
          firstrender:true,
          stateLoaded:true,
          object:{
            name:'',
            active:false
          }
        }}
        match={undefined}/>} 
      />


    <Route exact path="/sources_upload/:id" 
      render={({match})=>
      <SourcesUploadEdit 
        form={<Edit/>}
        state={ {
          action:EDITFORM,
          firstrender:true,
          stateLoaded:false,
          object:{
            id:undefined,
            name:undefined,
            active:undefined
          }
        }}
        match={match}/>} 
      />

    <Route exact path="/sources_rss" component={SourcesRssList} />
    <Route exact path="/sources_rss_add" 
      render={()=>
      <SourcesRSSEdit 
        form={<EditRSS/>}
        state={ {
          action:ADDFORM,
          firstrender:true,
          stateLoaded:true,
          object:{
            name:'',
            active:false
          }
        }}
        match={undefined}/>} 
      />


    <Route exact path="/sources_rss/:id"       
      render={({match})=>
      <SourcesRSSEdit 
        form={<EditRSS/>}
        state={ {
          action:EDITFORM,
          firstrender:true,
          stateLoaded:false,
          object:{
            id:undefined,
            name:undefined,
            active:undefined
          }
        }}
        match={match}/>} 
      />


    <Route exact path="/sources_job" component={SourcesJobList} />
    <Route exact path="/about" component={About}/>
    <Route exact path="/logout" component={Logout}/>
    <Route exact path="/password" component={Password}/>
  </Switch>
  
)

export default Main 

