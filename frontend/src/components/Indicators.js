import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import {ASC, DESC, ALL} from "../util/util"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import propTypes from 'prop-types'
import {IndicatorTable} from "./IndicatorTable"

export class Main extends React.Component{
  constructor(props){
    super(props)
  }
  render() { 
    let tabs = [0,1,2,3,4,5,6,7]
  return (
              <Tabs className={"offset-sm-2 col-sm-8"} selectedIndex={this.props.selectedTabIndex} onSelect={this.props.tabUpdate}>
                  <TabList>
                    <Tab data-value="md5">MD5 ({this.props.md5.totalcount})</Tab>
                    <Tab data-value="sha1">SHA1 ({this.props.sha1.totalcount})</Tab>
                    <Tab data-value="sha256">SHA256 ({this.props.sha256.totalcount})</Tab>
                    <Tab data-value="netloc">NetLoc</Tab>
                    <Tab data-value="email">Email</Tab>
                    <Tab data-value="ipv4">IPV4 ({this.props.ipv4.totalcount})</Tab>
                    <Tab data-value="ipv6">IPV6</Tab>
                  </TabList>
                    {tabs.map((index,value)=>{
                      return (
                      <TabPanel>
                        <IndicatorTable
                          paginate={this.props.paginate}
                          indicatorsList={this.props.indicatorsList}
                          indicatorsTotalCount={this.props.indicatorsTotalCount}
                          indicatorsNext={this.props.indicatorsNext}
                          indicatorsPrevious={this.props.indicatorsPrevious}
                          fetchit={this.props.fetchit}
                          fetchIndicatorsFullUri={this.props.fetchIndicatorsFullUri}
                          selections={this.props.selections}
                          setQuery={this.props.setQuery}
                         />
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
  indicatorsPrevious:propTypes.string


}
export default Main;
