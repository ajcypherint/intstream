import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';

export default ({name, idList, uniqueList, selections, onChange, ...rest}) => {
  return (
       <Input type="select" name={name} value={selections.modelChosen} id={name+"_id"} onChange={this.handleModelChange}>
             <option  value={""}>---</option>
            {idList.includes(selections.modelChosen)===false && selections.modelChosen!==''? 
               <option  value={selections.modelChosen}>{selections.modelChosen}</option>:''}
             {uniqueList.map((model)=>{
               return ( <option  key={model.mlmodel_id} 
                                value={model.mlmodel_id}>
                                {model.mlmodel}</option>)
             })
             }
            
           </Input> 
    )
}
