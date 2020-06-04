import jwtDecode from 'jwt-decode'
import * as pass from '../actions/password'


export const initialState = {
  isPasswordChanged:false,
  errors: {},
}

export default (state=initialState, action) => {
  switch(action.type) {
    case pass.PASSWORD_SUCCESS:
      return {
        errors:{},
        isPasswordChanged:true,
      }
    case pass.PASSWORD_FAILURE:
      return {
         isPasswordChanged:false,
         errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
    case pass.PASSWORD_CHANGED:
      return{
        ...state,
        isPasswordChanged:action.bool,
      }
    default:
      return state

  }
}
 
export function errors(state){
  return state.errors;
}

export function getPasswordChanged(state){
  return state.isPasswordChanged;
}
