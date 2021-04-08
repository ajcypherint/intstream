import React, { Component } from 'react'
import { ASC, DESC, ALL } from '../util/util'
import { Alert, Form, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap'
import propTypes from 'prop-types'
import Choice from './Choice'
import _ from 'lodash'

class ModelVersionTable extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    const newSelections = {
      ...this.props.query,
      chosen: event.target.value,
      page: 1
    }
    this.props.filterChange(newSelections, this.props.setQuery)
  }

  render () {
    const loading = typeof this.props.VersionLoading === 'undefined' ? true : this.props.VersionLoading
    const VersionList = this.props.VersionList || []
    const ids = this.props.List.map(a => a.id.toString()) || []
    const unique = _.uniqBy(this.props.List, 'id')

    return (
      <div>
          <Form>
            <FormGroup>

             <Row >
                <Col >
                   <Choice name={'Model'}
                    value={this.props.query.chosen || ''}
                    onChange={this.handleChange}
                    idList={ids}
                    uniqueList={unique}
                    disabled={false}
                   />
                </Col>
                <Col>
                </Col>
                <Col>
                </Col>
                <Col>
                  <Button disabled={loading} type="submit" onClick={this.onRefresh} className="button-brand-primary mb-1" size="md">
                  {loading
                    ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    : ''
                  }Refresh
                   </Button>
                </Col>
              </Row>
            </FormGroup>
            </Form>

            <table className={'table table-sm'}>
               <thead>
                 <tr>
                   <td className="hover" onClick={(event) => {
                     this.props.changesort('model__name',
                       ASC,
                       DESC,
                       this.props.query,
                       this.props.filterChange,
                       this.props.setQuery,
                       0
                     )
                   }}>
                     Model
                   </td>
                   <td className="hover" onClick={(event) => {
                     this.props.changesort('version',
                       ASC,
                       DESC,
                       this.props.query,
                       this.props.filterChange,
                       this.props.setQuery,
                       0
                     )
                   }}>
                     Version Name
                   </td>
                   <td className="hover" onClick={(event) => {
                     this.changesort('status',
                       ASC,
                       DESC,
                       this.props.query,
                       this.props.filterChange,
                       this.props.setQuery,
                       0
                     )
                   }}>
                     Status
                   </td>
                  <td>
                     Metric
                   </td>
                   <td>
                     Value
                   </td>
                   <td>
                     Active
                   </td>
                 </tr>
               </thead>
                 { !loading
                   ? VersionList.map((version) => {
                     const metric_value = version.metric_value || 0
                     return (
                        <tbody key={version.id}>
                           <tr key={version.id}>
                             <td>
                               {version.model.name}
                             </td>
                             <td >
                                {version.version}
                             </td>
                             <td>
                               {version.status}
                             </td>
                             <td >
                                {version.metric_name}
                             </td>
                             <td>
                               {metric_value.toFixed(3)}
                             </td>
                          <td>
                            <div className="custom-control custom-checkbox">
                              <Input type="checkbox"
                                data-model={version.model.id}
                                data-id={version.id}
                                checked={version.active}
                                onChange={this.props.handleActiveChange}/>
                             </div>
                         </td>
                            </tr>
                        </tbody>)
                   })
                   : <tbody><tr><td><span className="spinner-border" role="status">
                       <span className="sr-only">Loading...</span></span>
                   </td>
                   </tr>
                 </tbody>
                 }
              </table>
            </div>
    )
  }
}
ModelVersionTable.propTypes = {
  VersionList: propTypes.arrayOf(propTypes.object),
  VersionLoading: propTypes.bool,
  query: propTypes.object,
  List: propTypes.array,

  setQuery: propTypes.func,
  handleActiveChange: propTypes.func,
  setPage: propTypes.func,
  handleChange: propTypes.func,
  changesort: propTypes.func

}

export default ModelVersionTable
