import { RSAA } from 'redux-api-middleware'

export const POST_REGISTER_REQUEST = '@@registration/REGISTER_REQUEST'
export const POST_REGISTER_SUCCESS = '@@registration/REGISTER_SUCCESS'
export const POST_REGISTER_FAILURE = '@@registration/REGISTER_FAILURE'

const REGISTER_URL = '/api/register/'

export const register = (org,
  username,
  firstName,
  lastName,
  password,
  password2,
  email) => {
  const data = {
    username: username,
    first_name: firstName,
    last_name: lastName,
    password: password,
    password2: password2,
    organization_name: org,
    email: email
  }
  return {
    [RSAA]: {
      endpoint: REGISTER_URL,
      method: 'POST',
      fetch: fetch,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      types: [
        POST_REGISTER_REQUEST, POST_REGISTER_SUCCESS, POST_REGISTER_FAILURE
      ]

    }
  }
}

export const registerWOrg = (orgName,
  username,
  firstName,
  lastName,
  password,
  password2,
  email,
  history) => {
  return async (dispatch, getState) => {
    const respReg = await dispatch(register(
      orgName,
      username,
      firstName,
      lastName,
      password,
      password2,
      email))
    if (respReg.error) {
      return
    }
    history.goBack()
  }
}
