import React, { Component } from 'react'
import { Button, FormGroup, Alert, Col, Row, Form } from 'reactstrap'

export default ({ saving, goBack, onSubmit, ...submitRest }) => {
  return (
    <div>
        {saving === true
          ? <span className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
               </span>
          : <Row>
                  <Col>
                    <Button {...submitRest} type="submit" onClick={onSubmit} className="button-brand-primary mb-1" size="lg">Save</Button>
                  </Col>
                  <Col>
                    <Button onClick={goBack} className="button-brand-primary mb-1" size="lg">Back</Button>
                </Col>
                  </Row>
            }
    </div>
  )
}
