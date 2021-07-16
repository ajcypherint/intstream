import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../containers/Home'
import IndicatorHome from '../containers/IndicatorHome'

import JobListTemplate from '../containers/SourcesJobListTemplate'
import JobEditTemplate from '../containers/JobEditTemplate.js'

import JobVersionEditTemplate from '../containers/JobVersionEditTemplate'
import JobVerListTemplate from '../containers/JobVersionListTemplate'

import AllUserList from '../containers/AllUserList'
import AllUserEdit from '../containers/AllUserEdit'
import ModelsEdit from '../containers/ModelsEdit'
import SettingsEdit from '../containers/SettingsEdit'
import TrainList from '../containers/TrainList'
import LogList from '../containers/LogList'
import IndLogList from '../containers/IndLogList'
import Ver from '../containers/ModelVersionList'
import TaskList from '../containers/TaskList'

// keep below
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

import EditAllUserForm from './AllUserEditFormComp.js'
import EditOrgUserForm from './OrgUserEditFormComp.js'
import EditTrainingScripts from './TrainingScriptsEditFormComp'
import JobVersionEditForm from './JobVersionEditFormComp'
import IndJobVersionEditForm from './IndJobVersionEditFormComp'
import MitigateIndJobVersionEditForm from './MitigateIndJobVersionEditFormComp'
import TrainingScriptVersionEditForm from './TrainingScriptVersionEditFormComp'
import EditMitigateIndicatorJob from './SourceEditMitigateIndicatorJobFormComp'

import { ADD, EDIT } from '../util/util'
import CreateMLVersion from '../containers/CreateMLVersion'
import ModelVersionTable from './ModelVersionTable'

import VersionTable from './VersionTable'

import {
  MITIGATE_IND_JOB_API,
  MITIGATE_IND_JOB_ADD_URI,
  MITIGATE_IND_JOB_EDIT_URI,
  MITIGATE_IND_JOB_VERSION_API,
  MITIGATE_VERSION_ADD_URI,
  MITIGATE_VERSION_PARENT_URI,
  ORG_API,
  ORG_EDITURI,
  ORG_ADDURI,
  TRAINING_SCRIPT_API,
  TRAINING_SCRIPT_EDITURI,
  TRAINING_SCRIPT_ADDURI,
  ORGUSER_API,
  ORGUSER_EDITURI,
  ORGUSER_ADDURI,
  MODELS_API,
  MODELS_EDITURI,
  MODELS_ADDURI,
  TRAIN_VERSION_API,
  TRAIN_VERSION_ADD_URI,
  TRAIN_VERSION_PARENT_URI,
  JOB_VERSION_API,
  JOB_VERSION_ADD_URI,
  JOB_VERSION_PARENT_URI,
  JOB_API,
  RSS_API,
  RSS_EDITURI,
  RSS_ADDURI,
  UPLOAD_API,
  INDJOB_API,
  INDJOB_VERSION_API,
  INDJOB_ADD_URI,
  INDJOB_PARENT_URI
} from '../containers/api'

const IndJobVer = JobVerListTemplate(INDJOB_ADD_URI
)(INDJOB_PARENT_URI
)(INDJOB_VERSION_API)

const MitigateIndJobVer = JobVerListTemplate(MITIGATE_VERSION_ADD_URI
)(MITIGATE_VERSION_PARENT_URI
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
const JOB_LIST_FIELDS = ['id',
  'name',
  'last_run',
  'last_run_status',
  'active']
const JOB_ORDERSTARTCOL = 'name'

const INDJOB_EDITURI = '/sources_indjob/'
const INDJOB_ADDURI = '/sources_indjob_add'
const INDJOB_HEADING = 'Hunting Jobs'

const SourcesIndJobList = JobListTemplate(JOB_ORDERSTARTCOL)(
  JOB_LIST_FIELDS)(
  INDJOB_HEADING)(
  INDJOB_EDITURI)(
  INDJOB_ADDURI)(
  INDJOB_API)

const JOB_LIST_HEADING = 'Scheduled Jobs'
const JOB_LIST_EDITURI = '/sources_job/'
const JOB_LIST_ADDURI = '/sources_job_add'

const SourcesJobList = JobListTemplate(JOB_ORDERSTARTCOL)(
  JOB_LIST_FIELDS)(
  JOB_LIST_HEADING)(
  JOB_LIST_EDITURI)(
  JOB_LIST_ADDURI)(
  JOB_API)

const UPLOAD_HEADING = 'Upload Sources'
const UPLOAD_EDITURI = '/sources_upload/'
const UPLOAD_ADDURI = '/sources_upload_add'
const UPLOAD_FIELDS = ['id', 'name', 'active']

const SourcesUploadList = JobListTemplate(JOB_ORDERSTARTCOL)(
  UPLOAD_FIELDS)(
  UPLOAD_HEADING)(
  UPLOAD_EDITURI)(
  UPLOAD_ADDURI)(
  UPLOAD_API)

const ORGUSER_ORDERSTARTCOL = 'username'
const ORGUSER_FIELDS = ['username', 'email', 'is_staff', 'is_integrator']
const ORGUSER_HEADING = 'Users'
const OrgUserList = JobListTemplate(ORGUSER_ORDERSTARTCOL)(
  ORGUSER_FIELDS)(
  ORGUSER_HEADING)(
  ORGUSER_EDITURI)(
  ORGUSER_ADDURI)(
  ORGUSER_API)

const MODELS_HEADING = 'Models'
const MODELS_FIELDS = ['id', 'name', 'active']
const ModelsList = JobListTemplate(JOB_ORDERSTARTCOL)(
  MODELS_FIELDS)(
  MODELS_HEADING)(
  MODELS_EDITURI)(
  MODELS_ADDURI)(
  MODELS_API)

const ORG_FIELDS = ['id', 'name']
const ORG_HEADING = 'Organization'
const OrgList = JobListTemplate(JOB_ORDERSTARTCOL)(
  ORG_FIELDS)(
  ORG_HEADING)(
  ORG_EDITURI)(
  ORG_ADDURI)(
  ORG_API)

const TRAINING_SCRIPT_HEADING = 'Trainingscripts'
const TRAINING_SCRIPT_FIELDS = ['id', 'name', 'active']
const TrainingScriptsList = JobListTemplate(JOB_ORDERSTARTCOL)(
  TRAINING_SCRIPT_FIELDS)(
  TRAINING_SCRIPT_HEADING)(
  TRAINING_SCRIPT_EDITURI)(
  TRAINING_SCRIPT_ADDURI)(
  TRAINING_SCRIPT_API)

const RSS_HEADING = 'RSS Sources'
const RSS_FIELDS = ['id', 'name', 'url', 'active', 'extract_indicators']
const SourcesRssList = JobListTemplate(JOB_ORDERSTARTCOL)(
  RSS_FIELDS)(
  RSS_HEADING)(
  RSS_EDITURI)(
  RSS_ADDURI)(
  RSS_API)

const MITIGATE_IND_JOB_HEADING = 'Indicator Mitigate Jobs'
const MITIGATE_FIELDS = ['id',
  'name',
  'auto_mitigate',
  'manual_mitigate',
  'active']

const SourcesMitigateIndicatorJobList = JobListTemplate(JOB_ORDERSTARTCOL)(
  MITIGATE_FIELDS)(
  MITIGATE_IND_JOB_HEADING)(
  MITIGATE_IND_JOB_EDIT_URI)(
  MITIGATE_IND_JOB_ADD_URI)(
  MITIGATE_IND_JOB_API)

const HUNTING_HEADING = ' Hunting Job'
const JOB_EMPTY = {
  name: '',
  id: '',
  arguments: '',
  timeout: '',
  server_url: '',
  user: '',
  active: false
}

const JOB_FIELDS = undefined // not needed
const SourcesIndJobEdit = JobEditTemplate(JOB_EMPTY)(
  JOB_FIELDS)(
  HUNTING_HEADING)(
  INDJOB_API)

const JOB_HEADING = ' Scheduled Job'
const SourcesJobEdit = JobEditTemplate(JOB_EMPTY)(
  JOB_FIELDS)(
  JOB_HEADING)(
  JOB_API)

const ORGUSER_EDIT_HEADING = ' User '
const ORGUSER_EDIT_FIELDS = ['username', 'email', 'first_name', 'last_name', 'is_integrator', 'is_staff']
const ORGUSER_EDIT_EMPTY = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  is_integrator: false,
  is_staff: false
}
const OrgUserEdit = JobEditTemplate(ORGUSER_EDIT_EMPTY)(
  ORGUSER_EDIT_FIELDS)(
  ORGUSER_EDIT_HEADING)(
  ORGUSER_API)

const TRAININGSCRIPTS_EDIT_HEADING = ' Training Scripts'
const TRAININGSCRIPTS_EDIT_EMPTY = {
  name: '',
  active: false,
  id: ''
}
const TRAININGSCRIPTS_EDIT_FIELDS = ['name', 'active']
const TrainingScriptsEdit = JobEditTemplate(TRAININGSCRIPTS_EDIT_EMPTY)(
  TRAININGSCRIPTS_EDIT_FIELDS)(
  TRAININGSCRIPTS_EDIT_HEADING)(
  TRAINING_SCRIPT_API)

const ORG_EDIT_HEADING = ' Organization'
const ORG_EDIT_EMPTY = { name: '', id: '' }
const OrgEdit = JobEditTemplate(ORG_EDIT_EMPTY)(
  ORG_FIELDS)(
  ORG_EDIT_HEADING)(
  ORG_API)

const RSS_EDIT_HEADING = ' RSS Source'
const RSS_EMPTY = { id: '', name: '', url: '', active: false, extract_indicators: false }

const SourcesRSSEdit = JobEditTemplate(RSS_EMPTY)(
  JOB_FIELDS)(
  RSS_EDIT_HEADING)(
  RSS_API)

const UPLOAD_EDIT_HEADING = ' Upload Source'
const UPLOAD_EMPTY = { name: '', id: '', file: '', active: false }
const SourcesUploadEdit = JobEditTemplate(UPLOAD_EMPTY)(
  JOB_FIELDS)(
  UPLOAD_EDIT_HEADING)(
  UPLOAD_API)

const MITIGATE_EMPTY = {
  name: '',
  id: '',
  arguments: '',
  timeout: '',
  server_url: '',
  user: '',
  auto_mitigate: false,
  manual_mitigate: false,
  active: false
}

const MITIGATE_EDIT_HEADING = ' Mitigate Job'
const SourcesMitigateIndicatorJobEdit = JobEditTemplate(MITIGATE_EMPTY)(
  JOB_FIELDS)(
  MITIGATE_EDIT_HEADING)(
  MITIGATE_IND_JOB_API)

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
