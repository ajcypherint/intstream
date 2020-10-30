import { connect } from 'react-redux'
import SettingEdit from '../components/SettingEdit';
import {API, getSettings,FormUpdate, setSettings, clear} from '../actions/settings'
import * as reducers from '../reducers/'

// edit
// models


const mapStateToProps = (state) => {
  return { 
    
    settings:reducers.getSettings(state),
    loading:reducers.getSettingsLoading(state),
    saving:reducers.getSettingsSaving(state),
    errors:reducers.getSettingsErrors(state),
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    //settings
    fetchSettings: (params=undefined) => dispatch(getSettings(API,params)),
    setSettings: (data) => dispatch(setSettings(API,data)),
    FormUpdate:(data)=>dispatch(FormUpdate(data)),
    clear:() => dispatch(clear())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingEdit);
