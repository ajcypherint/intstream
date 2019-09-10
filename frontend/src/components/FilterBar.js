import React from 'react'
import { Input,Form,Button,FormGroup, Select,Label } from 'reactstrap';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

export default ({...rest}) => {

  return (
    <div>
      <div class="form-row ">
        <div class="col">
          <label  for={"start_id"}>{"Start Date"}</label>
          <div class = "mb-2">
          <DatePicker  id={"start_id"}  />
          </div>
        </div>
        <div class="col">
          <label  for={"end_id"}>{"End Date"}</label>
          <div class = " mb-2">
          <DatePicker  id={"end_id"}  />
        </div>
        </div>
        <div class="col">
          <label  for={"cat_id"}>{"Category"}</label>
          <div >
       <Input type="select" name="Class" id="cat_id" >
            <option>Russia</option>
            <option>North Korea</option>
            <option>ICS</option>
            <option>IOC</option>
          </Input> 

        </div>
        </div>
         <div class="col">
           <label  for={"source_id"}>{"Source"}</label> 
          <div >
       <Input type="select" name="Source" id="source_id" >
            <option>cnn.com</option>
            <option>npr.com</option>
            <option>crisp</option>
          </Input> 

        </div>
        </div>
 
     </div>
    <div class="form-row">
      <div class="col ms-2" >
            <Button type="submit" className="button-brand-primary "  size="md">Filter</Button>
          </div>
    </div>
  </div>
  )
}

