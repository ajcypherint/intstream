import React, { Component } from 'react'
import { ASC, DESC, ALL } from '../util/util'
import { Alert, Form, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap'
import propTypes from 'prop-types'
import { changesort } from './ChangeSort'

class JobVersionTable extends Component {
  constructor (props) {
    super(props)
    this.add = this.add.bind(this)
    this.jobs = this.jobs.bind(this)
    this.changesort = changesort.bind(this)
  }

  add (event) {
    event.preventDefault()
    const name = this.props.query.name
    const parent = this.props.query[this.props.parentIdentifier]
    this.props.history.push(this.props.addUri + '/?name=' + name + '&' + this.props.parentIdentifier + '=' + parent)
  }

  jobs (event) {
    this.props.history.push(this.props.parentUri)
  }

  render () {
    const loading = typeof this.props.VersionLoading === 'undefined' ? true : this.props.VersionLoading
    const VersionList = this.props.VersionList || []

    return (
        <div>
          <Form>
            <FormGroup>
             <Row >
                <Col >
                  <Button data-job={this.props.query.job} data-name={this.props.query.name}
                    disabled={loading} type="submit" onClick={this.add} className="button-brand-primary mb-1" size="md">
                   Add
                 </Button>
               </Col>
                <Col>
                  <Button onClick={this.props.history.goBack} className="button-brand-primary mb-1" size="md">
                    Back
                 </Button>
               </Col>
                <Col>
                  <Button onClick={this.jobs} className="button-brand-primary mb-1" size="md">
                    Jobs
                 </Button>
               </Col>

             </Row>
           </FormGroup>
         </Form>

            <table className={'table table-sm'}>
               <thead>
                 <tr>
                  <td className="hover" onClick={(event) => {
                    this.changesort('version',
                      ASC,
                      DESC,
                      this.props.query,
                      this.props.filterChange,
                      this.props.setQuery,
                      0
                    )
                  }}>
                     Version
                   </td>
                  <td>
                     Active
                   </td>
                 </tr>
               </thead>
                 { !loading
                   ? VersionList.map((version) => {
                     return (
                        <tbody key={version.id}>
                           <tr key={version.id}>
                             <td >
                                {version.version}
                             </td>
                          <td>
                            <div className="custom-control custom-checkbox">
                              <Input type="checkbox"
                                data-model={this.props.query.job}
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

JobVersionTable.propTypes = {
  addUri: propTypes.String,
  parentUri: propTypes.String,
  parentIdentifier: propTypes.String,
  VersionList: propTypes.arrayOf(propTypes.object),
  VersionLoading: propTypes.bool,
  query: propTypes.object,

  history: propTypes.object,
  setQuery: propTypes.func,
  handleActiveChange: propTypes.func,
  setPage: propTypes.func

}

export default JobVersionTable
