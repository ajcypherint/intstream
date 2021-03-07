import {
  GET_IPV4_REQUEST, GET_IPV4_SUCCESS, GET_IPV4_FAILURE,
  GET_IPV6_REQUEST, GET_IPV6_SUCCESS, GET_IPV6_FAILURE,
  GET_MD5_REQUEST, GET_MD5_SUCCESS, GET_MD5_FAILURE,
  GET_SHA1_REQUEST, GET_SHA1_SUCCESS, GET_SHA1_FAILURE,
  GET_SHA256_REQUEST, GET_SHA256_SUCCESS, GET_SHA256_FAILURE,
  GET_NETLOC_REQUEST, GET_NETLOC_SUCCESS, GET_NETLOC_FAILURE,
  GET_EMAIL_REQUEST, GET_EMAIL_SUCCESS, GET_EMAIL_FAILURE
} from '../actions/indicators'

export const IPV4 = 'ipv4'
export const IPV6 = 'ipv6'
export const MD5 = 'md5'
export const SHA1 = 'sha1'
export const SHA256 = 'sha1'
export const EMAIL = 'email'
export const NETLOC = 'netloc'

export const REQ = 'req'
export const FAIL = 'fail'
export const SUCCESS = 'success'

export const TAB_MAP = {
  [IPV4]: {
    [REQ]: GET_IPV4_REQUEST,
    [SUCCESS]: GET_IPV4_SUCCESS,
    [FAIL]: GET_IPV4_FAILURE
  },
  [MD5]: {
    [REQ]: GET_MD5_REQUEST,
    [SUCCESS]: GET_MD5_SUCCESS,
    [FAIL]: GET_MD5_FAILURE
  },
  [IPV6]: {
    [REQ]: GET_IPV6_REQUEST,
    [SUCCESS]: GET_IPV6_SUCCESS,
    [FAIL]: GET_IPV6_FAILURE
  },
  [SHA1]: {
    [REQ]: GET_SHA1_REQUEST,
    [SUCCESS]: GET_SHA1_SUCCESS,
    [FAIL]: GET_SHA1_FAILURE
  },
  [SHA256]: {
    [REQ]: GET_SHA256_REQUEST,
    [SUCCESS]: GET_SHA256_SUCCESS,
    [FAIL]: GET_SHA256_FAILURE
  },
  [EMAIL]: {
    [REQ]: GET_EMAIL_REQUEST,
    [SUCCESS]: GET_EMAIL_SUCCESS,
    [FAIL]: GET_EMAIL_FAILURE
  },
  [NETLOC]: {
    [REQ]: GET_NETLOC_REQUEST,
    [SUCCESS]: GET_NETLOC_SUCCESS,
    [FAIL]: GET_NETLOC_FAILURE
  }

}

export function listActions (type) {
  const requests = []
  for (const item in TAB_MAP) {
    requests.push(TAB_MAP[item][type])
  }
  return requests
}

export function mapActions () {
  const actionTabMap = {}
  for (const ind in TAB_MAP) {
    for (const action in TAB_MAP[ind]) {
      const ac = TAB_MAP[ind][action]
      actionTabMap[ac] = ind
    }
  }
  return actionTabMap
}
