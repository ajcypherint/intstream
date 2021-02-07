import React from 'react'
import { FormGroup, Col, Button } from 'reactstrap'
export default ({ className, loading, ...rest }) => {
  return (
          <FormGroup >
              <Col className="text-center">
               <Button type="submit"
                  className="button-brand-primary" size="lg">Submit</Button>
             </Col>
          </FormGroup>
  )
}
