import { connect } from 'react-redux'
import Register from '../components/Registration';
import {registerWOrg, register, REGISTER_URL} from '../actions/registration'
import * as reducers from '../reducers/'

// edit
// models


const mapStateToProps = (state) => {
  return { 
    saving:reducers.getRegSaving(state),
    errors:reducers.getRegErrors(state),
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    register:(orgName, 
              username,
              first_name,
              last_name,
              password,
              password2,
              email,
              history)=>dispatch(registerWOrg(orgName, 
                         username,
                         first_name,
                         last_name,
                         password,
                         password2,
                         email,
                         history
                         ))

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Register);
