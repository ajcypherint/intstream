import { mapStateToPropsFunc, mapDispatchToPropsFunc, connectFunc } from './ListTemplate.js'

// edit
const API = '/api/indicatorjob/'
const FIELDS = ['id',
  'name',
  'last_run',
  'last_run_status',
  'active']
const HEADING = 'Hunting Jobs'
const EDITURI = '/sources_indjob/'
const ADDURI = '/sources_indjob_add'
const ORDERSTARTCOL = 'name'

export default connectFunc(mapStateToPropsFunc(ORDERSTARTCOL)(
  FIELDS)(
  HEADING)(
  EDITURI)(
  ADDURI)
)(mapDispatchToPropsFunc(API))
