import React from 'react'
import { Route,Switch } from 'react-router-dom'
import Home from "../containers/Home"
import SourcesJobList from "../containers/SourcesJobList"
import SourcesJobEdit from "../containers/SourcesJobEdit"
import SourcesUploadList from "../containers/SourcesUploadList"
import SourcesUploadEdit from "../containers/SourcesUploadEdit"
import SourcesRssList from "../containers/SourcesRSSList"
import SourcesRSSEdit from "../containers/SourcesRSSEdit"

import SettingsEdit from "../containers/SettingsEdit"

import ModelsList from "../containers/ModelsList"
import ModelsEdit from "../containers/ModelsEdit"

import About from "./About"
import Logout from "./Logout"
import Password from "../containers/Password"
import Edit from './SourceEditFormComp'
import EditRSS from './SourceEditRSSFormComp'
import EditModels from './ModelsEditFormComp'
import EditJob from './SourceEditJobFormComp'
import Article from "../containers/Article"
import Train from "../containers/Train"
import TrainList from "../containers/TrainList"
import {ADD, EDIT} from "../util/util"
import CreateMLVersion from "../containers/CreateMLVersion"
import Ver from "../containers/ModelVersionList"
const Main = (props)=>(
  <Switch>
    <Route exact path="/" component={Home} />

    <Route exact path="/article/:id" component={Article} />
    <Route exact path="/train/:id/:model" component={Train} />
    <Route exact path="/train_list" component={TrainList} />
    <Route exact path="/versions" component={Ver} />

    <Route exact path="/createmlversion/:id" component={CreateMLVersion} />

    <Route exact path="/sources_upload" component={SourcesUploadList} />
    <Route exact path="/sources_upload_add" 
      render={()=>
      <SourcesUploadEdit 
        form={<Edit/>}
        action={"ADD"}
        state={ {
          action:ADD,
        }}
        match={undefined}/>} 
      />


    <Route exact path="/sources_upload/:id" 
      render={({match})=>
      <SourcesUploadEdit 
        form={<Edit/>}
        state={ {
          action:EDIT,
        }}
        match={match}/>} 
      />
    <Route exact path="/models" component={ModelsList} />
    <Route exact path="/models_add" 
      render={()=>
      <ModelsEdit 
        form={<EditModels/>}
        state={ {
          action:ADD,
        }}
        match={undefined}/>} 
      />


    <Route exact path="/models/:id"       
      render={({match})=>
      <ModelsEdit 
        form={<EditModels/>}
        state={ {
          action:EDIT,
        }}
        match={match}/>} 
      />

    <Route exact path="/settings"       
      component={SettingsEdit}
      />



    <Route exact path="/sources_rss" component={SourcesRssList} />
    <Route exact path="/sources_rss_add" 
      render={()=>
      <SourcesRSSEdit 
        form={<EditRSS/>}
        state={ {
          action:ADD,
        }}
        match={undefined}/>} 
      />


    <Route exact path="/sources_rss/:id"       
      render={({match})=>
      <SourcesRSSEdit 
        form={<EditRSS/>}
        state={ {
          action:EDIT,
        }}
        match={match}/>} 
      />


    <Route exact path="/sources_job" component={SourcesJobList} />
    <Route exact path="/sources_job_add" 
      render={()=>
      <SourcesJobEdit 
        form={<EditJob/>}
        state={ {
          action:ADD,
        }}
        match={undefined}/>} 
      />


    <Route exact path="/sources_job/:id"       
      render={({match})=>
      <SourcesJobEdit 
        form={<EditJob/>}
        state={ {
          action:EDIT,
        
        }}
        match={match}/>} 
      />


    <Route exact path="/about" component={About}/>
    <Route exact path="/logout" component={Logout}/>
    <Route exact path="/password" component={Password}/>
  </Switch>
  
)

export default Main 

