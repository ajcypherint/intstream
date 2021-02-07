import { AppContainer } from '../components/Logout'
import { connect } from 'react-redux'
import { logout } from '../actions/auth'
const mapDispatchToProps = dispatch => ({
  logout_m: (payload) => dispatch(logout())
})
export default connect(null, mapDispatchToProps)(AppContainer)
