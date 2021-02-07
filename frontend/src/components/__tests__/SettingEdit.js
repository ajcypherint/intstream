import React from 'react'
import Main from '../SettingEdit'
import { shallow, mount } from 'enzyme'
describe('create ', () => {
  it('render', () => {
    const fetchSettings = jest.fn()
    const history = { goBack: jest.fn() }
    const saving = false
    const settings = {
      aws_key: 'test',
      aws_secret: 'test',
      aws_region: 'test',
      aws_s3_log_base: 'test',
      aws_s3_upload_base: 'test'
    }

    const wrapper = shallow(
      <Main
        fetchSettings={fetchSettings}
        history={history}
        saving={false}
        settings={settings}

      />
    )
    expect(fetchSettings.mock.calls.length).toBe(1)
    // todo change input on each field and check mock calls
  })
})
