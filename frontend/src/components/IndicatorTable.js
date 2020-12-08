import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import {ASC, DESC, ALL} from "../util/util"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import propTypes from 'prop-types'

export class IndicatorTable extends React.Component{
  constructor(props){
    super(props)
  }
  render() { 
  let indicators = this.props.indicatorsList || []
  return (
    <table className={"table table-sm " }>
      <tbody>
        <tr>
          <td>
            {this.props.paginate(this.props.indicatorsTotalCount,
             this.props.indicatorsNext,
             this.props.indicatorsPrevious,
             this.props.fetchit,
             this.props.fetchIndicatorsFullUri,
             this.props.selections,
             this.props.setQuery,
             )}
          </td>
        </tr>
        <tr>
          <td>
            <table className={"table table-sm"}>
              <thead>
                <tr>
                  <td className="hover" onClick={(event)=>{this.changesort("value", 
                     ASC, 
                      DESC, 
                     this.props.selections,
                     this.props.filterChange,
                     this.props.setQuery,
                     0
                  )}}>Title</td>
                </tr>
 
              </thead>
              <tbody>
                {//indicators
                  !this.props.indicatorsLoading ?
                     indicators.map(( indicator)=>{

                       return (
                         <tr>
                           <td>{indicator.value} </td>
                         </tr>
                        )})
             :<tbody><tr><td><span className="spinner-border" role="status">
               <span className="sr-only">Loading...</span></span> </td> </tr>
               </tbody>
             }

              </tbody>
            </table>
          </td>
        </tr>
 
      </tbody>
    </table>
  )
  }
}

IndicatorTable.propTypes = {
  paginate:propTypes.func,
  totalCount:propTypes.number,
  next:propTypes.string,
  previous:propTypes.string,
  fetchit:propTypes.func,
  fetchIndicatorsFullUri:propTypes.func,
  selections:propTypes.object,
  setQuery:propTypes.func,
  indicatorsList:propTypes.array,
  indicatorsLoading:propTypes.bool,
  indicatorsTotalCount:propTypes.number,
  indicatorsNext:propTypes.string,
  indicatorsPrevious:propTypes.string

}
