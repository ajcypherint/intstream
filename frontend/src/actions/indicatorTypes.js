import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'

export const INDTYPES_REQUEST = '@@indicatorTypes/INDTYPES_REQUEST'
export const INDTYPES_SUCCESS = '@@indicatorTypes/INDTYPES_SUCCESS'
export const INDTYPES_FAILURE = '@@indicatorTypes/INDTYPES_FAILURE'

export const getIndicatorTypes = () => ({
  [RSAA]: {
    endpoint: '/api/indicatortype/',
    fetch: fetch,
    method: 'GET',
    body: '',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      INDTYPES_REQUEST, INDTYPES_SUCCESS, INDTYPES_FAILURE
    ]

  }
})
