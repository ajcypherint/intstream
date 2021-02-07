import TrueFalse from '../TrueFalse'
import React from 'react'
import { shallow, mount } from 'enzyme'

describe('create TrueFalse', () => {
  it('entry undefined', () => {
    const handler = jest.fn()
    const wrapper = mount(<TrueFalse
      trueFalse={false}
      articleId={1}
      classif={{ 1: undefined }}
      mlModel={'test'}
      handleChange={handler}
      />)
    const firstLink = wrapper.find('input').first()
    firstLink.simulate('change', { target: { checked: true } })
    expect(handler.mock.calls.length).toBe(1)
  })

  it('entry exists', () => {
    const handlerF = jest.fn()
    const wrapper = mount(<TrueFalse
      trueFalse={true}
      articleId={1}
      classif={
        { 1: { id: 1 } }
      }
      mlModel={'test'}
      handleChange={handlerF}
      />)
    const firstLink = wrapper.find('input').first()
    firstLink.simulate('change', { target: { checked: true } })
    expect(handlerF.mock.calls.length).toBe(1)
  })
})
