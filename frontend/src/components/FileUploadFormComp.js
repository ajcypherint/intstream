import React, { Component } from 'react'
import { Row, Label, Input, FormGroup, Alert, Button, Jumbotron, Form } from 'reactstrap'
import DropDown from './Choice'
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'
import { getIds } from '../util/util'
import { ARTICLE_TYPES_API, ARTICLE_TYPES_DD } from '../containers/api'
import { PAGINATION, MULTIPARTFORM, JSONFORM } from '../actions/util'

export default class Edit extends Component {
  constructor (props) {
    super(props)

    const errors = this.props.errors || {}
    const err_name = errors.name || {}
    const upload = this.upload.bind(this)
  }

  upload (event) {
    // call action to
    // 1. post file and title=READ_TITLE
    // 2. start saga to wait for finished job.
    // 3. display loader
    // 4. when complete display title field and text box with clean_text
    //
  }

  componentDidMount () {
    // if  EDIT form
    this.props.fetchArticleTypes(ARTICLE_TYPES_API, '', ARTICLE_TYPES_DD)
  }

  render () {
    const errors = this.props.errors || {}
    const err_file = errors.file || []
    const err_title = errors.title
    const drop = this.props.dropDown || {}
    const articleTypesObject = drop[ARTICLE_TYPES_DD] || {}

    const articleTypes = articleTypesObject.results || []
    let id_list = getIds(articleTypes)
    id_list = id_list.map(function (i) {
      return parseInt(i)
    })

    const title = this.props.object.title || ''
    const type = this.props.object.type || ''
    return (
        <Form >
             <FormGroup>

              {err_file.length > 0 && <Alert color="danger">{err_file[0]}</Alert>}
              <DropDown
                name={'type'}
                error={undefined}
                value={type}
                onChange={this.props.handleChange}
                idList={id_list}
                prop={'name'}
                uniqueList={articleTypes}
                disabled={false}
               />
               <FormGroup>
             <Label htmlFor={'file'}>File</Label>
              <Input
                id={'file'}
                onChange={this.props.handleChange}
                label={'File'}
                type="file"
                name="file"
              />
            </FormGroup>
            <TextInput
              onChange={this.props.handleChange}
              name={'title'}
              label={'title'}
              value={title}
              error={err_title} />
            </FormGroup>

            <FormGroup>
               <FormButtons data-contenttype={MULTIPARTFORM} saving={this.props.saving}
                            onSubmit={this.props.onSubmit}
                             goBack={this.props.goBack}/>

           </FormGroup>
          </Form>
    )
  }
};

Edit.propTypes = {
  handleChange: propTypes.func,
  error: propTypes.object,
  saving: propTypes.bool,
  updating: propTypes.bool,
  object: propTypes.shape({
    id: propTypes.number,
    name: propTypes.string,
    active: propTypes.bool
  }

  ),
  goBack: propTypes.func,
  onSubmit: propTypes.func
}
