import React, { Component } from 'react';
import {Button} from 'reactstrap';
export default ({saving, goBack}) => {
  return (     
    <div>
        {saving===true?
               <span className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
               </span>:
                <div className="form-row">    
                  <div className="col">
                    <Button type="submit" className="button-brand-primary" size="lg">Save</Button>
                  </div>
                  <div className="col">
                    <Button type="Back" onClick={goBack} className="button-brand-primary" size="lg">Back</Button>
                  </div>
                  </div>
            }
    </div>
  )
}
 
