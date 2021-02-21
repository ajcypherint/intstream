import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/Home'
import IndicatorHome from '../containers/IndicatorHome'
import SourcesIndJobList from '../containers/SourcesIndJobList'
import SourcesIndJobEdit from '../containers/SourcesIndJobEdit'
import SourcesJobList from '../containers/SourcesJobList'
import SourcesJobEdit from '../containers/SourcesJobEdit'
import SourcesUploadList from '../containers/SourcesUploadList'
import SourcesUploadEdit from '../containers/SourcesUploadEdit'
import SourcesRssList from '../containers/SourcesRSSList'
import SourcesRSSEdit from '../containers/SourcesRSSEdit'
import AllUserList from '../containers/AllUserList'
import AllUserEdit from '../containers/AllUserEdit'
import EditAllUserForm from './AllUserEditFormComp.js'
import OrgUserList from '../containers/OrgUserList'
import OrgUserEdit from '../containers/OrgUserEdit'
import EditOrgUserForm from './OrgUserEditFormComp.js'
import OrgList from '../containers/OrgList'
import OrgEdit from '../containers/OrgEdit'
import SettingsEdit from '../containers/SettingsEdit'

import ModelsList from '../containers/ModelsList'
import ModelsEdit from '../containers/ModelsEdit'

import About from './About'
import Logout from '../containers/Logout'
import Password from '../containers/Password'
import EditOrgForm from './OrgEditFormComp'
import Edit from './SourceEditFormComp'
import EditRSS from './SourceEditRSSFormComp'
import EditModels from './ModelsEditFormComp'
import EditJob from './SourceEditJobFormComp'
import EditIndJob from './SourceEditIndJobFormComp'
import Article from '../containers/Article'
import Train from '../containers/Train'

import TrainingScriptsList from '../containers/TrainingScriptsList'
import TrainingScriptsEdit from '../containers/TrainingScriptsEdit'
import EditTrainingScripts from './TrainingScriptsEditFormComp'

import Registration from '../containers/Registration'
import TrainList from '../containers/TrainList'
import LogList from '../containers/LogList'
import { ADD, EDIT } from '../util/util'
import CreateMLVersion from '../containers/CreateMLVersion'
import Ver from '../containers/ModelVersionList'
import ModelVersionTable from './ModelVersionTable'

import JobVer from '../containers/JobVersionList'
import JobVersionTable from './JobVersionTable'
import JobVersionEditForm from './JobVersionEditFormComp'
import JobVersionEdit from '../containers/SourcesJobVersionEdit'

import IndJobVer from '../containers/IndJobVersionList'
import IndJobVersionTable from './IndJobVersionTable'
import IndJobVersionEditForm from './IndJobVersionEditFormComp'
import IndJobVersionEdit from '../containers/SourcesIndJobVersionEdit'

const Main = (props) => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/indicatorhome" component={IndicatorHome} />

    <Route exact path="/article/:id" component={Article} />
    <Route exact path="/train/:id/:model" component={Train} />
    <Route exact path="/train_list" component={TrainList} />
    <Route exact path="/jobloglist/" component={LogList} />
    <Route exact path="/indjobversions"
      render={() =>
          <IndJobVer
            table={<IndJobVersionTable/>}
          />
      }
      />
    <Route exact path="/indjobversions_add"
          render={() =>
          <IndJobVersionEdit
            form={<IndJobVersionEditForm/>}
            state={ {
              action: ADD
            }}
            match={undefined}/>}
    />

    <Route exact path="/jobversions"
      render={() =>
          <JobVer
            table={<JobVersionTable/>}
          />
      }
      />
    <Route exact path="/jobversions_add"
          render={() =>
          <JobVersionEdit
            form={<JobVersionEditForm/>}
            state={ {
              action: ADD
            }}
            match={undefined}/>}
    />

    <Route exact path="/versions"
      render={() =>
          <Ver
            table={<ModelVersionTable/>}
          />
      }
      />

    <Route exact path="/createmlversion/:id" component={CreateMLVersion} />

    <Route exact path="/sources_upload" component={SourcesUploadList} />
    <Route exact path="/sources_upload_add"
      render={() =>
      <SourcesUploadEdit
        form={<Edit/>}
        action={'ADD'}
        state={ {
          action: ADD
        }}
        match={undefined}/>}
      />
    <Route exact path="/sources_upload/:id"
      render={({ match }) =>
      <SourcesUploadEdit
        form={<Edit/>}
        state={ {
          action: EDIT
        }}
        match={match}/>}
      />

    <Route exact path="/alluserinfo" component={AllUserList} />
    <Route exact path="/alluserinfo_add"
          render={() =>
          <AllUserEdit
            form={<EditAllUserForm/>}
            state={ {
              action: ADD
            }}
            match={undefined}/>}
    />
    <Route exact path="/alluserinfo/:id"
          render={({ match }) =>
          <AllUserEdit
            form={<EditAllUserForm/>}
            state={ {
              action: EDIT
            }}
            match={match}/>}
    />

    <Route exact path="/orguserinfo" component={OrgUserList} />
    <Route exact path="/orguserinfo_add"
          render={() =>
          <OrgUserEdit
            form={<EditOrgUserForm/>}
            state={ {
              action: ADD
            }}
            match={undefined}/>}
    />
    <Route exact path="/orguserinfo/:id"
          render={({ match }) =>
          <OrgUserEdit
            form={<EditOrgUserForm/>}
            state={ {
              action: EDIT
            }}
            match={match}/>}
    />

    <Route exact path="/organization" component={OrgList} />
    <Route exact path="/organization_add"
          render={() =>
          <OrgEdit
            form={<EditOrgForm/>}
            state={ {
              action: ADD
            }}
            match={undefined}/>}
    />
    <Route exact path="/organization/:id"
          render={({ match }) =>
          <OrgEdit
            form={<EditOrgForm/>}
            state={ {
              action: EDIT
            }}
            match={match}/>}
    />

   <Route exact path="/trainingscripts" component={TrainingScriptsList} />
    <Route exact path="/trainingscripts_add"
      render={() =>
      <TrainingScriptsEdit
        form={<EditTrainingScripts/>}
        state={ {
          action: ADD
        }}
        match={undefined}/>}
      />

    <Route exact path="/trainingscripts/:id"
      render={({ match }) =>
      <TrainingScriptsEdit
        form={<EditTrainingScripts/>}
        state={ {
          action: EDIT
        }}
        match={match}/>}
      />

    <Route exact path="/models" component={ModelsList} />
    <Route exact path="/models_add"
      render={() =>
      <ModelsEdit
        form={<EditModels/>}
        state={ {
          action: ADD
        }}
        match={undefined}/>}
      />

    <Route exact path="/models/:id"
      render={({ match }) =>
      <ModelsEdit
        form={<EditModels/>}
        state={ {
          action: EDIT
        }}
        match={match}/>}
      />

    <Route exact path="/settings"
      component={SettingsEdit}
      />

    <Route exact path="/sources_rss" component={SourcesRssList} />
    <Route exact path="/sources_rss_add"
      render={() =>
      <SourcesRSSEdit
        form={<EditRSS/>}
        state={ {
          action: ADD
        }}
        match={undefined}/>}
      />

    <Route exact path="/sources_rss/:id"
      render={({ match }) =>
      <SourcesRSSEdit
        form={<EditRSS/>}
        state={ {
          action: EDIT
        }}
        match={match}/>}
      />

    <Route exact path="/sources_indjob" component={SourcesIndJobList} />
    <Route exact path="/sources_indjob_add"
      render={() =>
      <SourcesIndJobEdit
        form={<EditIndJob/>}
        state={ {
          action: ADD
        }}
        match={undefined}/>}
      />
    <Route exact path="/sources_indjob/:id"
      render={({ match }) =>
      <SourcesIndJobEdit
        form={<EditIndJob/>}
        state={ {
          action: EDIT

        }}
        match={match}/>}
      />

    <Route exact path="/sources_job" component={SourcesJobList} />
    <Route exact path="/sources_job_add"
      render={() =>
      <SourcesJobEdit
        form={<EditJob/>}
        state={ {
          action: ADD
        }}
        match={undefined}/>}
      />

    <Route exact path="/sources_job/:id"
      render={({ match }) =>
      <SourcesJobEdit
        form={<EditJob/>}
        state={ {
          action: EDIT

        }}
        match={match}/>}
      />

    <Route exact path="/about" component={About}/>
    <Route exact path="/logout" component={Logout}/>
    <Route exact path="/password" component={Password}/>
  </Switch>

)

export default Main
