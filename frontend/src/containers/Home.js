import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import TextInput from '../components/TextInput'
import SearchForm from '../components/SearchForm.js'
import SubmitButton from '../components/Submit.js'
import { Col,Alert,Form,FormGroup,Button,ListGroup,ListGroupItem } from 'reactstrap';

class Main extends React.Component{
  constructor(props){
    super(props)
    //this.state={
    //  na:'',
    //}
 
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)


  }
  handleChange(event){
    this.setState({
      na:event.target.value
    })
  }
  handleClick(event){
    //call action to unshorten url
    event.preventDefault()
    //this.props.submitLoading ? this.props.onCancel() : this.props.onSubmit(this.state.url)
  }


  render(){
    
    const errors = this.props.errors || {}
    return(
     <div >
       <SearchForm />
    </div>
    )
 
 }
}

const mapStateToProps = (state) => ({
  // add state for node
})


const mapDispatchToProps = (dispatch) => ({
  //add state for node

})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
