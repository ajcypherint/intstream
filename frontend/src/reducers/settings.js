
import * as settingsData from '../actions/settings';

const initialState = {
  settings:[],
  loading:false,
  errors: {},
  saving: false 
}

export default (state=initialState, action) => {
  switch(action.type) {
    case settingsData.FORM_UPDATE:
      {
        return {
          ...state,
          settings:[action.payload]
        }

      }
 
    case settingsData.GET_TOTAL_SETTINGS:
      {
        return {
          settings:action.payload.settings,
          loading:false,
          errors:{}
        }

      }
    case settingsData.SET_SETTINGS_REQUEST:
      {

      return {
        ...state,
        saving:true
      }
      }
    case settingsData.SET_SETTINGS_SUCCESS:
      {
      return {
        ...state,
        settings:[action.payload],
        saving:false,
      }
      }
    case settingsData.SET_SETTINGS_FAILURE:
      {
      return {
        ...state,
        saving:false,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    case settingsData.GET_SETTINGS_REQUEST:
      {
      return {
        ...state,
        loading:true,
        saving:false,
        errors:{}
      }
      }

    case settingsData.GET_SETTINGS_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newmodelsettingsData= {...result}
      return {
        settings:action.payload.results,
        loading:false,
        errors: {},
      }
      }
    case settingsData.GET_SETTINGS_FAILURE:
      {
      return {
        settings:[],
        loading:false,
        saving:false,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
 
    //used for listing
    case settingsData.CLEAR:
      {
      return {
        ...initialState
      }
      }


     default:
      return state

  }
}
export function settings(state) {
  return state.settings
}
export function loading(state) {
  return  state.loading
}

export function saving(state) {
  return  state.saving
}

export function errors(state) {
  return  state.errors
}

