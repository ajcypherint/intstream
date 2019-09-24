import React from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { set_password,setPasswordChanged } from '../actions/password'
import {get_username,getPasswordChanged} from '../reducers/'
import TextInput from '../components/TextInput'
import {errors} from '../reducers/password'
import { Alert,Col,Button,Form,FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import { Redirect,Link } from 'react-router-dom'

class Main extends React.Component{
  constructor(props){
    super(props)
    this.state={
      password1:'',
      password2:'',
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)

  }
    handleChange(event){
    this.setState({
      [event.target.name]:event.target.value
    })
  }
  handleClick(event){
    //call action to unshorten url
    event.preventDefault()
    if (this.state.password1!==this.state.password2) {
        alert("Passwords do not match")
    }
    else if (this.state.password1==='' || this.state.password2===''){
        alert("Password cannot be empty")
    }
    else{

      this.props.onSubmit(this.props.username,this.state.password1)
    }
  }

  render(){
   let  i = 1
   if (this.props.passwordChanged){
     this.props.setPasswordChanged(false)  
      return <Redirect to="/"/>
     //redirecthere:
   }
   else{

      return(
        //check if password was sucessfully set, if so then alert password set
       <div className="col-sm-8 offset-sm-2">

          <Form onSubmit={this.handleClick}>
            <h1>Change Password</h1>
              {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
              
              <TextInput className="form-control"  
                type="password"
                label="Password"
                error={errors.password}
                name="password1"  
                value = {this.state.password1} onChange={this.handleChange}/>
              <TextInput className="form-control"  
                type="password"
                label="Password"
                error={errors.password}
                name="password2"  
                value = {this.state.password2} onChange={this.handleChange}/>
   
              <FormGroup >

                <Col className="text-center"> 
                  <Button type="submit" className="brand-primary" size="lg">Submit</Button>
               </Col>
            </FormGroup>
        </Form>
       </div>
    
      )
   
   }
  }
}

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (username,password) => {
    dispatch(set_password(username,password))
  },
  setPasswordChanged:(bool) =>{
    dispatch(setPasswordChanged(bool))
  }
})
const mapStateToProps = (state) => ({
  errors:errors(state),
  username:get_username(state),
  passwordChanged:getPasswordChanged(state)
})


export default connect(mapStateToProps, mapDispatchToProps)(Main);
