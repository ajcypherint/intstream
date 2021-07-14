import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/Home'
import IndicatorHome from '../containers/IndicatorHome'

import JobList from '../containers/SourcesJobListTemplate'

// import SourcesIndJobList from '../containers/SourcesIndJobList'
import SourcesIndJobEdit from '../containers/SourcesIndJobEdit'
// import SourcesJobList from '../containers/SourcesJobList'
import SourcesJobEdit from '../containers/SourcesJobEdit'
// import SourcesUploadList from '../containers/SourcesUploadList'
import SourcesUploadEdit from '../containers/SourcesUploadEdit'
// import SourcesRssList from '../containers/SourcesRSSList'
import SourcesRSSEdit from '../containers/SourcesRSSEdit'
import SourcesMitigateIndicatorJobList from '../containers/SourcesMitigateIndicatorJobList'
import SourcesMitigateIndicatorJobEdit from '../containers/SourcesMitigateIndicatorJobEdit'
import EditMitigateIndicatorJob from './SourceEditMitigateIndicatorJobFormComp'

import AllUserList from '../containers/AllUserList'
import AllUserEdit from '../containers/AllUserEdit'
import EditAllUserForm from './AllUserEditFormComp.js'
import OrgUserList from '../containers/OrgUserList'
import OrgUserEdit from '../containers/OrgUserEdit'
import EditOrgUserForm from './OrgUserEditFormComp.js'
import OrgList from '../containers/OrgList'
import OrgEdit from '../containers/OrgEdit'
import SettingsEdit from '../containers/SettingsEdit'

import TaskList from '../containers/TaskList'

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
import IndLogList from '../containers/IndLogList'
import { ADD, EDIT } from '../util/util'
import CreateMLVersion from '../containers/CreateMLVersion'
import Ver from '../containers/ModelVersionList'
import ModelVersionTable from './ModelVersionTable'

import JobVersionEditTemplate from '../containers/JobVersionEditTemplate'
import JobVerListTemplate from '../containers/JobVersionListTemplate'

import JobVersionEditForm from './JobVersionEditFormComp'
import IndJobVersionEditForm from './IndJobVersionEditFormComp'
import MitigateIndJobVersionEditForm from './MitigateIndJobVersionEditFormComp'
import TrainingScriptVersionEditForm from './TrainingScriptVersionEditFormComp'

import VersionTable from './VersionTable'

import {
  MITIGATE_IND_JOB_VERSION_API,
  MITIGATE_ADD_URI,
  MITIGATE_PARENT_URI,
  TRAIN_VERSION_API,
  TRAIN_VERSION_ADD_URI,
  TRAIN_VERSION_PARENT_URI,
  JOB_VERSION_API,
  JOB_VERSION_ADD_URI,
  JOB_VERSION_PARENT_URI,
  JOB_API,
  RSS_API,
  UPLOAD_API,
  INDJOB_API,
  INDJOB_VERSION_API,
  INDJOB_ADD_URI,
  INDJOB_PARENT_URI
} from '../containers/api'

const IndJobVer = JobVerListTemplate(INDJOB_ADD_URI
)(INDJOB_PARENT_URI
)(INDJOB_VERSION_API)

const MitigateIndJobVer = JobVerListTemplate(MITIGATE_ADD_URI
)(MITIGATE_PARENT_URI
)(MITIGATE_IND_JOB_VERSION_API)

const IND_JOBVERSION_HEADING = ' Hunging Job Version'
const JOBVERSION_EMPTY = {
  job: '',
  version: '',
  zip: '',
  active: false
}
const JOBVERSION_FIELDS = [
  'job',
  'zip',
  'version',
  'active']

const IndJobVersionEdit = JobVersionEditTemplate(
  JOBVERSION_EMPTY)(
  JOBVERSION_FIELDS)(
  IND_JOBVERSION_HEADING)(
  INDJOB_VERSION_API)

const MITIGATE_INDJOBVERSION_HEADING = ' Mitigate Indicator Job Version'

const MitigateIndJobVersionEdit = JobVersionEditTemplate(
  JOBVERSION_EMPTY)(
  JOBVERSION_FIELDS)(
  MITIGATE_INDJOBVERSION_HEADING)(
  MITIGATE_IND_JOB_VERSION_API)

const JobVer = JobVerListTemplate(JOB_VERSION_ADD_URI
)(JOB_VERSION_PARENT_URI
)(JOB_VERSION_API)

const TrainingScriptsVer = JobVerListTemplate(TRAIN_VERSION_ADD_URI
)(TRAIN_VERSION_PARENT_URI
)(TRAIN_VERSION_API)

const TRAIN_JOBVERSION_HEADING = ' Training Job Version'

const TrainingScriptVersionEdit = JobVersionEditTemplate(
  JOBVERSION_EMPTY)(
  JOBVERSION_FIELDS)(
  TRAIN_JOBVERSION_HEADING)(
  TRAIN_VERSION_API)

const JOBVERSION_HEADING = ' Job Version'

const JobVersionEdit = JobVersionEditTemplate(
  JOBVERSION_EMPTY)(
  JOBVERSION_FIELDS)(
  JOBVERSION_HEADING)(
  JOB_VERSION_API)

// edit
const JOB_FIELDS = ['id',
  'name',
  'last_run',
  'last_run_status',
  'active']
const JOB_ORDERSTARTCOL = 'name'

const INDJOB_EDITURI = '/sources_indjob/'
const INDJOB_ADDURI = '/sources_indjob_add'
const INDJOB_HEADING = 'Hunting Jobs'

const SourcesIndJobList = JobList(JOB_ORDERSTARTCOL)(
  JOB_FIELDS)(
  INDJOB_HEADING)(
  INDJOB_EDITURI)(
  INDJOB_ADDURI)(
  INDJOB_API)

const JOB_HEADING = 'Scheduled Jobs'
const JOB_EDITURI = '/sources_job/'
const JOB_ADDURI = '/sources_job_add'

const SourcesJobList = JobList(JOB_ORDERSTARTCOL)(
  JOB_FIELDS)(
  JOB_HEADING)(
  JOB_EDITURI)(
  JOB_ADDURI)(
  JOB_API)

const UPLOAD_HEADING = 'Upload Sources'
const UPLOAD_EDITURI = '/sources_upload/'
const UPLOAD_ADDURI = '/sources_upload_add'
const UPLOAD_FIELDS = ['id', 'name', 'active']

const SourcesUploadList = JobList(JOB_ORDERSTARTCOL)(
  UPLOAD_FIELDS)(
  UPLOAD_HEADING)(
  UPLOAD_EDITURI)(
  UPLOAD_ADDURI)(
  UPLOAD_API)

const RSS_HEADING = 'RSS Sources'
const RSS_EDITURI = /sources_rss/
const RSS_ADDURI = '/sources_rss_add'

const RSS_FIELDS = ['id', 'name', 'url', 'active', 'extract_indicators']
const SourcesRssList = JobList(JOB_ORDERSTARTCOL)(
  RSS_FIELDS)(
  RSS_HEADING)(
  RSS_EDITURI)(
  RSS_ADDURI)(
  RSS_API)

const Main = (props) => (

  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/indicatorhome" component={IndicatorHome} />

    <Route exact path="/article/:id" component={Article} />
    <Route exact path="/train/:id/:model" component={Train} />
    <Route exact path="/train_list" component={TrainList} />
    <Route exact path="/jobloglist/" component={LogList} />
    <Route exact path="/indjobloglist/" component={IndLogList} />
    <Route exact path="/tasklist" component={TaskList} />
    <Route exact path="/mitigateindjobversions"
      render={() =>
          <MitigateIndJobVer
            table={<VersionTable/>}
          />
      }
      />
    <Route exact path="/mitigateindjobversions_add"
          render={() =>
          <MitigateIndJobVersionEdit
            form={<MitigateIndJobVersionEditForm/>}
            state={ {
              action: ADD
            }}
            match={undefined}/>}
    />

    <Route exact path="/indjobversions"
      render={() =>
          <IndJobVer
            table={<VersionTable/>}
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
            table={<VersionTable/>}
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

   <Route exact path="/trainingscriptversions"
      render={() =>
          <TrainingScriptsVer
            table={<VersionTable/>}
          />
      }
      />
    <Route exact path="/trainingscriptversions_add"
          render={() =>
          <TrainingScriptVersionEdit
            form={<TrainingScriptVersionEditForm/>}
            state={ {
              action: ADD
            }}
            match={undefined}/>}
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
    <Route exact path="/sources_mitigateindicatorjob" component={SourcesMitigateIndicatorJobList} />
    <Route exact path="/sources_mitigateindicatorjob_add"
      render={() =>
      <SourcesMitigateIndicatorJobEdit
        form={<EditMitigateIndicatorJob/>}
        state={ {
          action: ADD
        }}
        match={undefined}/>}
      />
    <Route exact path="/sources_mitigateindicatorjob/:id"
      render={({ match }) =>
      <SourcesMitigateIndicatorJobEdit
        form={<EditMitigateIndicatorJob/>}
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
