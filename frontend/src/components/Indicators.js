import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap'
import { ASC, DESC, ALL } from '../util/util'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import propTypes from 'prop-types'
import { MD5, IPV4, IPV6, SHA1, SHA256, EMAIL, NETLOC } from '../reducers/tab'
import Choice from './MultiChoiceCol'
import _ from 'lodash'
import { changesort } from './ChangeSort'

export class Main extends React.Component {
  constructor (props) {
    super(props)
    this.changesort = changesort.bind(this)
    this.handleMitigate = this.handleMitigate.bind(this)
    this.handleAllowed = this.handleAllowed.bind(this)
    this.handleReviewed = this.handleReviewed.bind(this)
  }

  handleMitigate (event) {

  }

  handleReviewed (event) {

  }

  handleAllowed (event) {

  }

  render () {
    const tabs = [0, 1, 2, 3, 4, 5, 6]
    const indicators = this.props.indicatorsList || []
    const selections = this.props.selections || {}
    const selectedNumCols = selections.numCols || []
    const selectedTxtCols = selections.textCols || []
    const selected = selections.selectedTabIndexNum || 0
    // hard code mitigated column as a column shown.
    return (
    <Tabs selectedIndex={selected} onSelect={this.props.tabUpdate}>
        <TabList>
          <Tab data-value={MD5}>{MD5.toUpperCase() + ' '}

            {this.props.md5.loading
              ? <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
              : '(' + this.props.md5.totalcount + ')'}
          </Tab>
          <Tab data-value={SHA1}>{SHA1.toUpperCase() + ' '}

            {this.props.sha1.loading
              ? <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
              : '(' + this.props.sha1.totalcount + ')'}
          </Tab>
          <Tab data-value={SHA256}>{SHA256.toUpperCase() + ' '}

            {this.props.sha256.loading
              ? <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
              : '(' + this.props.sha256.totalcount + ')'}
          </Tab>
          <Tab data-value={NETLOC}>{NETLOC.toUpperCase() + ' '}
            {this.props.netloc.loading
              ? <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
              : '(' + this.props.netloc.totalcount + ')'}
          </Tab>
          <Tab data-value={EMAIL}>{EMAIL.toUpperCase() + ' '}
            {this.props.email.loading
              ? <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
              : '(' + this.props.email.totalcount + ')'}
          </Tab>
          <Tab data-value={IPV4}>{IPV4.toUpperCase() + ' '}
            {this.props.ipv4.loading
              ? <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
              : '(' + this.props.ipv4.totalcount + ')'}
          </Tab>
          <Tab data-value={IPV6}>{IPV6.toUpperCase() + ' '}
            {this.props.ipv6.loading
              ? <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
              : '(' + this.props.ipv6.totalcount + ')'}
          </Tab>
        </TabList>
          {tabs.map((value, index) => {
            return (
            <TabPanel key={index}>
              <table className={'table table-sm ' }>
                <tbody>
                  <tr>
                    <td >
                      {this.props.paginate(this.props.indicatorsTotalCount,
                        this.props.indicatorsNext,
                        this.props.indicatorsPrevious,
                        this.props.fetchit,
                        this.props.fetchIndicatorsFullUri,
                        this.props.selections,
                        this.props.setQuery
                      )}
                    </td>
                    <td >
                      <Label>Info Columns</Label>
                      <Choice
                        type={'numCols'}
                        name={'numCols'}
                        valueList={this.props.numCols}
                        value={this.props.query.numCols}
                        onChange={this.props.changeColChoice}
                        disabled={false}
                        incMitigated={true}
                      />
                     </td>
                    <td>
                      <Label>Text Columns</Label>
                      <Choice
                        name={'textCols'}
                        type={'textCols'}
                        valueList={this.props.textCols}
                        value={this.props.query.textCols}
                        onChange={this.props.changeColChoice}
                        disabled={false}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <table className={'table table-sm'}>
                        <thead>
                          <tr>
                            <td className="hover" onClick={(event) => {
                              this.changesort('value',
                                ASC,
                                DESC,
                                this.props.selections,
                                this.props.filterChange,
                                this.props.setQuery,
                                0
                              )
                            }}>Value</td>
                          <td>M</td>
                          <td>A</td>
                          <td>R</td>
                          {
                            selectedTxtCols.map((name, index) => {
                              return (
                                  <td key={index}>
                                    {name}
                                  </td>
                              )
                            })
                          }
                          {
                            selectedNumCols.map((name, index) => {
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
                          {// indicators
                            !this.props.indicatorsLoading
                              ? indicators.map((indicator, index) => {
                                return (
                                   <tr key={index}>
                                     <td>{indicator.value} </td>
                                     <td>
                                      <div className="custom-control custom-checkbox">
                                        <Input type="checkbox"
                                          data-id={indicator.id}
                                          checked={indicator.mitigated}
                                          onChange={this.handleMitigate}/>
                                       </div>
                                     </td>
                                     <td>
                                      <div className="custom-control custom-checkbox">
                                        <Input type="checkbox"
                                          data-id={indicator.id}
                                          checked={indicator.allowed}
                                          onChange={this.handleAllowed}/>
                                       </div>
                                     </td>
                                     <td>
                                      <div className="custom-control custom-checkbox">
                                        <Input type="checkbox"
                                          data-id={indicator.id}
                                          checked={indicator.reviewed}
                                          onChange={this.handleReviewed}/>
                                       </div>
                                     </td>
                                        {
                                          selectedTxtCols.map((name, index) => {
                                            // todo get value of column name for id of indicator
                                            return (
                                                <td key={index}>
                                                  {
                                                    _.filter(this.props.textColsData,
                                                      { name: name, indicator: indicator.id }).length > 0
                                                      ? _.filter(this.props.textColsData,
                                                        { name: name, indicator: indicator.id })[0].value
                                                      : ''
                                                        }
                                                </td>
                                            )
                                          })
                                        }
                                        {
                                           selectedNumCols.map((name, index) => {
                                             // todo get value of column name for id of indicator
                                             return (
                                                <td key={index}>
                                                  {
                                                    _.filter(this.props.numColsData,
                                                      { name: name, indicator: indicator.id }).length > 0
                                                      ? _.filter(this.props.numColsData,
                                                        { name: name, indicator: indicator.id })[0].value
                                                      : ''
                                                        }
                                                </td>
                                             )
                                           })
                                       }
                                   </tr>
                                )
                              })
                              : <tr><td><span className="spinner-border" role="status">
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
  totalCount: propTypes.number,
  next: propTypes.string,
  previous: propTypes.string,
  fetchit: propTypes.func,
  fetchIndicatorsFullUri: propTypes.func,
  selections: propTypes.object,
  setQuery: propTypes.func,
  paginate: propTypes.func,
  updateComponent: propTypes.func,
  selectedTabIndex: propTypes.number,
  indicatorsList: propTypes.array,
  indicatorsLoading: propTypes.bool,
  indicatorsTotalCount: propTypes.number,
  indicatorsNext: propTypes.string,
  indicatorsPrevious: propTypes.string,
  query: propTypes.object

}
export default Main
