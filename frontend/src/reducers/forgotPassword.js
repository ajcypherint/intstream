import * as forgot from '../actions/forgotPassword' 
const initialState = {
  message:"",
  errors: {},
}
export default (state=initialState, action) => {
  switch(action.type) {
    case forgot.PASSWORDRESET_REQUEST:
      {
        return {
          ...initialState,
        }

      }
    case forgot.PASSWORDRESET_SUCCESS:
      {
        return {
          message:"email sent",
          errors:{}
        }
      }
   case forgot.PASSWORDRESET_FAILURE:
      {
        return {
          ...state,
           errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
    default:
      {
        return state
      }
  }
}

export const getMessage = (state)=>{
  return state.message
}

export const errors = (state)=>{
  return state.errors
}
