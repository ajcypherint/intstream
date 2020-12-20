import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import {ASC, DESC, ALL} from "../util/util"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import propTypes from 'prop-types'
import Choice from "./MultiChoiceCol"

export class Main extends React.Component{
  constructor(props){
    super(props)
  }
  render() { 
    let tabs = [0,1,2,3,4,5,6]
    let indicators = this.props.indicatorsList || []
    let selections = this.props.selections || {}
    let selectedNumCols = selections.numCols || []
    let selectedTxtCols =  selections.textCols || []
    let selected = selections.selectedTabIndexNum || 0
 
  return (
              <Tabs selectedIndex={selected} onSelect={this.props.tabUpdate}>
                  <TabList>
                    <Tab data-value="md5" >MD5 ({this.props.md5.totalcount})</Tab>
                    <Tab data-value="sha1">SHA1 ({this.props.sha1.totalcount})</Tab>
                    <Tab data-value="sha256">SHA256 ({this.props.sha256.totalcount})</Tab>
                    <Tab data-value="netloc">NetLoc ({this.props.netloc.totalcount})</Tab>
                    <Tab data-value="email">Email ({this.props.email.totalcount})</Tab>
                    <Tab data-value="ipv4">IPV4 ({this.props.ipv4.totalcount})</Tab>
                    <Tab data-value="ipv6">IPV6 ({this.props.ipv6.totalcount})</Tab>
                  </TabList>
                    {tabs.map((value, index)=>{
                      return (
                      <TabPanel key={index}>
                        <table className={"table table-sm " }>
                          <tbody>
                            <tr>
                              <td >
                                {this.props.paginate(this.props.indicatorsTotalCount,
                                 this.props.indicatorsNext,
                                 this.props.indicatorsPrevious,
                                 this.props.fetchit,
                                 this.props.fetchIndicatorsFullUri,
                                 this.props.selections,
                                 this.props.setQuery,
                                 )}
                              </td>
                              <td >
                                <Label>Info Columns</Label>
                                <Choice 
                                  type={"numCols"}
                                  name={"numCols"} 
                                  valueList={this.props.numCols} 
                                  value={this.props.query.numCols}
                                  onChange={this.props.changeColChoice}
                                  disabled={false}
                                />
                               </td>
                              <td>
                                <Label>Text Columns</Label>
                                <Choice 
                                  name={"textCols"} 
                                  type={"textCols"} 
                                  valueList={this.props.textCols} 
                                  value={this.props.query.textCols}
                                  onChange={this.props.changeColChoice}
                                  disabled={false}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="3">
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
                                      )}}>Value</td>
                                    {
                                      selectedTxtCols.map(( name, index)=>{
                                        return (
                                            <td key={index}>
                                              {name}
                                            </td>
                                        )
                                      })
                                    }
                                    {
                                      selectedNumCols.map(( name, index)=>{
                                        return (
                                            <td key={index}>
                                              {name}
                                            </td>
                                        )
                                      })
                                    }
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {//indicators
                                      !this.props.indicatorsLoading ?
                                         indicators.map(( indicator, index)=>{
                                           return (
                                             <tr key={index}>
                                               <td>{indicator.value} </td>
                                                  {
                                                    selectedTxtCols.map(( name, index)=>{
                                                      //todo get value of column name for id of indicator
                                                      return (
                                                          <td key={index}>
                                                            
                                                            {name}
                                                          </td>
                                                      )
                                                    })
                                                  }
                                                  {
                                                    selectedNumCols.map(( name, index)=>{
                                                      return (
                                                          <td key={index}>
                                                            {name}
                                                          </td>
                                                      )
                                                    })
                                                  }
                                             </tr>
                                            )})
                                 :<tr><td><span className="spinner-border" role="status">
                                   <span className="sr-only">Loading...</span></span></td></tr>
                                 }
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                     
                          </tbody>
                        </table>
 
                      </TabPanel>
                        )
                      })
                    }
                  
              </Tabs>
   )
  }
}

Main.propTypes = {
  totalCount:propTypes.number, 
  next:propTypes.string,
  previous:propTypes.string,
  fetchit:propTypes.func,
  fetchIndicatorsFullUri:propTypes.func,
  selections:propTypes.object,
  setQuery:propTypes.func,
  paginate:propTypes.func,
  updateComponent:propTypes.func,
  selectedTabIndex:propTypes.number,
  indicatorsList:propTypes.array,
  indicatorsLoading:propTypes.bool,
  indicatorsTotalCount:propTypes.number,
  indicatorsNext:propTypes.string,
  indicatorsPrevious:propTypes.string,
  query:propTypes.object

}
export default Main;
