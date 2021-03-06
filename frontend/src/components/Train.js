import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Form, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap'

export default class Train extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // if  not ADD form
    if (typeof this.props.match.params.id !== 'undefined') {
      this.props.fetchArticles(this.props.match.params.id)
    }
  }

  next (classification, event) {
    // todo(aj)
    const model_id = event.target.value
    this.props.fetchArticles(model_id)
  }

  render () {
    const articles = this.props.articlesList || []
    const article = articles.length > 0 ? articles[0] : {}
    const title = article.title || ''
    const clean_text = article.clean_text || ''
    const model = this.props.match.params.model
    const model_id = this.props.match.params.id
    const errors = this.props.articlesErrors || {}
    return (

      <div className="container mt-2 col-sm-8 offset-sm-2" >

        <h1>{model}</h1>
        {errors.error ? <Alert color="danger">{errors.error}</Alert> : ''}
        <Form>

         <FormGroup>
           <Label for="Article">{title}</Label>
        <Input type="textarea" className="bktextarea" name="text" rows="15" id="Article" readOnly value={clean_text}/>
      </FormGroup>

      <FormGroup>
        <Row>
       <Col>
          <Button onClick={this.next.bind(this, false)} value={model_id} className="button-brand-primary" size="lg">True</Button>
        </Col>
        <Col>
          <Button onClick={this.next.bind(this, true)} value={model_id} className="button-brand-primary" size="lg">False</Button>
        </Col>
        <Col>
          <Button onClick={this.props.history.goBack} className="button-brand-primary" size="lg">Edit {model}</Button>
        </Col>
      </Row>
      </FormGroup>
    </Form>
      </div>

    )
  }
}
Train.propTypes = {
  articlesList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    clean_text: PropTypes.string
  })),
  match: PropTypes.shape(
    PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.number }) })),
  history: PropTypes.object,
  fetchArticles: PropTypes.func

}
